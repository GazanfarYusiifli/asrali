-- Create Core Tenant and User Tables

CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'trialing',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extend auth.users with tenant information and role
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'employee',
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create trigger function to automatically create a user profile upon sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- For now, new registrations will need a tenant_id assigned from the application side
  -- This function just ensures a profile row exists if we want it, but typically 
  -- we handle tenant creation and user profile creation transactionally via RPC.
  -- To keep it simple, we insert a basic row if missing.
  INSERT INTO public.users (id, full_name, role)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New User'), 'company_admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tenants RLS
CREATE POLICY "Users can view their own tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid()));

CREATE POLICY "Super admins can view all tenants" ON public.tenants
  FOR ALL TO authenticated
  USING ((SELECT role FROM public.users WHERE users.id = auth.uid()) = 'super_admin');

-- Users RLS
CREATE POLICY "Users can view other users in same tenant" ON public.users
  FOR SELECT TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM public.users u WHERE u.id = auth.uid()));

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Company admins can manage users in same tenant" ON public.users
  FOR ALL TO authenticated
  USING (
    tenant_id = (SELECT tenant_id FROM public.users u WHERE u.id = auth.uid()) 
    AND (SELECT role FROM public.users u WHERE u.id = auth.uid()) = 'company_admin'
  );

-- Create basic schema for Accounting Module
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Accounting
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for accounts" ON public.accounts
  FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid()));

CREATE POLICY "Tenant isolation for journal entries" ON public.journal_entries
  FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid()));
