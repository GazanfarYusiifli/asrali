-- Initial schema for SaaS ERP

-- Create tenants table
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('super_admin', 'company_admin', 'accountant', 'employee', 'auditor')),
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tenants RLS Policies
-- Users can only view their own tenant
CREATE POLICY "Users can view their own tenant" ON public.tenants
    FOR SELECT USING (
        id IN (SELECT tenant_id FROM public.users WHERE public.users.id = auth.uid())
    );

-- Only super_admin or new signups (function bypassed) can insert tenants
-- We will handle tenant creation via security definer function to avoid chicken-and-egg problem

-- Users RLS Policies
-- Users can view other users in the same tenant
CREATE POLICY "Users can view users in same tenant" ON public.users
    FOR SELECT USING (
        tenant_id IN (SELECT tenant_id FROM public.users WHERE public.users.id = auth.uid())
    );

-- Company Admins can insert/update users in their tenant
CREATE POLICY "Company Admins can manage users in same tenant" ON public.users
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM public.users WHERE public.users.id = auth.uid() AND public.users.role = 'company_admin')
    );

-- Create a secure function to handle new tenant and user registration
CREATE OR REPLACE FUNCTION public.create_new_tenant(
    new_tenant_name TEXT,
    new_full_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_tenant_id UUID;
BEGIN
    -- Create the tenant
    INSERT INTO public.tenants (name)
    VALUES (new_tenant_name)
    RETURNING id INTO new_tenant_id;

    -- Update the current auth user's metadata and insert into public.users
    INSERT INTO public.users (id, tenant_id, role, full_name)
    VALUES (auth.uid(), new_tenant_id, 'company_admin', new_full_name);

    RETURN jsonb_build_object('tenant_id', new_tenant_id);
END;
$$;
