-- Fix for User Error (Cannot coerce to single JSON object)
-- This happens if the user was not inserted into public.users or RLS is blocking.

-- 1. Remove NOT NULL constraint so new users can register without failing
ALTER TABLE public.users ALTER COLUMN username DROP NOT NULL;

-- 2. Make sure all users can select from public.users
DROP POLICY IF EXISTS "Anyone can view usernames" ON public.users;
CREATE POLICY "Anyone can view usernames" 
ON public.users FOR SELECT 
USING (true);

-- 3. Update the complete_user_registration function to auto-generate username if null
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
    gen_username TEXT;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Generate username if not provided
    IF p_username IS NULL OR p_username = '' THEN
        gen_username := 'user_' || substr(v_user_id::text, 1, 8);
    ELSE
        gen_username := p_username;
    END IF;

    -- Create the tenant
    INSERT INTO public.tenants (name, subscription_status)
    VALUES (p_company_name, 'trialing')
    RETURNING id INTO new_tenant_id;

    -- Insert into public.users
    INSERT INTO public.users (id, tenant_id, role, full_name, company_name, phone, country, city, username, email)
    VALUES (v_user_id, new_tenant_id, 'company_admin', p_full_name, p_company_name, p_phone, p_country, p_city, gen_username, p_email)
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        phone = EXCLUDED.phone,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        username = COALESCE(public.users.username, EXCLUDED.username),
        email = EXCLUDED.email;

    -- Create 14 day trial subscription for the user
    INSERT INTO public.subscriptions (user_id, plan, status, trial_start, trial_end)
    VALUES (v_user_id, 'trial', 'active', NOW(), NOW() + INTERVAL '14 days')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN jsonb_build_object('tenant_id', new_tenant_id, 'user_id', v_user_id);
END;
$$;

-- 4. Just in case there are still missing users, insert them from auth.users
INSERT INTO public.users (id, full_name, username)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'User'), 'user_' || substr(id::text, 1, 8)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
