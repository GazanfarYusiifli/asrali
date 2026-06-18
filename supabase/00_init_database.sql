-- ==========================================
-- SAAS ERP: COMPLETE DATABASE INIT SCRIPT
-- ==========================================

-- 1. TENANTS (ŞİRKƏTLƏR) CƏDVƏLİ
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. İSTİFADƏÇİLƏR (USERS) CƏDVƏLİ
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'User' CHECK (role IN ('Admin', 'Manager', 'Accountant', 'User')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- HƏR ŞEYƏ İCAZƏ (Test Mərhələsi Üçün)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to tenants" ON public.tenants;
CREATE POLICY "Allow all access to tenants" ON public.tenants FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
CREATE POLICY "Allow all access to users" ON public.users FOR ALL USING (true);

-- 3. QEYDİYYAT ZAMANI AVTOMATİK ŞİRKƏT (TENANT) YARATMAQ ÜÇÜN FUNKSİYA
CREATE OR REPLACE FUNCTION create_new_tenant(new_tenant_name text, new_full_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Yeni tenant yaradırıq
  INSERT INTO public.tenants (name)
  VALUES (new_tenant_name)
  RETURNING id INTO new_tenant_id;

  -- Bizi çağıran istifadəçini bu tenanta bağlayırıq (Admin rolu ilə)
  INSERT INTO public.users (id, tenant_id, full_name, role)
  VALUES (auth.uid(), new_tenant_id, new_full_name, 'Admin');

  RETURN new_tenant_id;
END;
$$;


-- ==========================================
-- SAAS ERP: CORE ACCOUNTING ENGINE
-- ==========================================

-- 4. Hesablar Planı (Chart of Accounts)
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, code)
);

-- 5. Baş Kitab / Jurnal Əməliyyatları (Journal Entries)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    reference_number VARCHAR(100),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Posted', 'Voided')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Jurnal Sətirləri (Journal Lines)
CREATE TABLE IF NOT EXISTS public.journal_lines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    journal_entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.chart_of_accounts(id),
    description TEXT,
    debit NUMERIC(15, 2) DEFAULT 0 CHECK (debit >= 0),
    credit NUMERIC(15, 2) DEFAULT 0 CHECK (credit >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Siyasətləri
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to chart_of_accounts for testing" ON public.chart_of_accounts;
CREATE POLICY "Allow all access to chart_of_accounts for testing" ON public.chart_of_accounts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to journal_entries for testing" ON public.journal_entries;
CREATE POLICY "Allow all access to journal_entries for testing" ON public.journal_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to journal_lines for testing" ON public.journal_lines;
CREATE POLICY "Allow all access to journal_lines for testing" ON public.journal_lines FOR ALL USING (true);
