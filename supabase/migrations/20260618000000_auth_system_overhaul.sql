-- Add new columns to public.users table based on the new auth requirements
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Enforce no "@" in username using a check constraint
ALTER TABLE public.users ADD CONSTRAINT no_at_in_username CHECK (username NOT LIKE '%@%');

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'basic', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow anyone to read users to resolve username to email for login
CREATE OR REPLACE FUNCTION public.resolve_username_to_email(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    found_email TEXT;
BEGIN
    SELECT email INTO found_email FROM public.users WHERE username = p_username;
    RETURN found_email;
END;
$$;

-- Create RPC for completing registration
CREATE OR REPLACE FUNCTION public.complete_user_registration(
    p_full_name TEXT,
    p_company_name TEXT,
    p_phone TEXT,
    p_country TEXT,
    p_city TEXT,
    p_username TEXT,
    p_email TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_tenant_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create the tenant
    INSERT INTO public.tenants (name, subscription_status)
    VALUES (p_company_name, 'trialing')
    RETURNING id INTO new_tenant_id;

    -- Insert into public.users
    INSERT INTO public.users (id, tenant_id, role, full_name, company_name, phone, country, city, username, email)
    VALUES (v_user_id, new_tenant_id, 'company_admin', p_full_name, p_company_name, p_phone, p_country, p_city, NULLIF(p_username, ''), p_email)
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        username = EXCLUDED.username,
        email = EXCLUDED.email;

    -- Create 14 day trial subscription for the user
    INSERT INTO public.subscriptions (user_id, plan, status, trial_start, trial_end)
    VALUES (v_user_id, 'trial', 'active', NOW(), NOW() + INTERVAL '14 days')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN jsonb_build_object('tenant_id', new_tenant_id, 'user_id', v_user_id);
END;
$$;
