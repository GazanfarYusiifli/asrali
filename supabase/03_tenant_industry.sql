-- ==========================================
-- SAAS ERP: TENANT INDUSTRY UPDATE
-- ==========================================

-- 1. Add industry column to tenants table
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS industry VARCHAR(100) DEFAULT 'General';

-- 2. Update the create_new_tenant function to accept industry
DROP FUNCTION IF EXISTS create_new_tenant(text, text);

CREATE OR REPLACE FUNCTION create_new_tenant(new_tenant_name text, new_full_name text, new_industry text DEFAULT 'General')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Yeni tenant yaradırıq
  INSERT INTO public.tenants (name, industry)
  VALUES (new_tenant_name, new_industry)
  RETURNING id INTO new_tenant_id;

  -- Bizi çağıran istifadəçini bu tenanta bağlayırıq (Admin rolu ilə)
  INSERT INTO public.users (id, tenant_id, full_name, role)
  VALUES (auth.uid(), new_tenant_id, new_full_name, 'Admin');

  RETURN new_tenant_id;
END;
$$;
