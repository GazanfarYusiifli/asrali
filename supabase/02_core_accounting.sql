-- ==========================================
-- SAAS ERP: CORE ACCOUNTING ENGINE
-- ==========================================

-- 1. Hesablar Planı (Chart of Accounts)
CREATE TABLE public.chart_of_accounts (
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

-- 2. Baş Kitab / Jurnal Əməliyyatları (Journal Entries)
CREATE TABLE public.journal_entries (
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

-- 3. Jurnal Sətirləri (Journal Lines)
CREATE TABLE public.journal_lines (
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

-- İcazələr (Policies): Yalnız öz tenant-ına (şirkətinə) aid olan məlumatları görə bilər.
-- Qeyd: Bu siyasətlərin tam işləməsi üçün istifadəçinin auth.users() məlumatları public.users cədvəli ilə sinxron işləməlidir.
-- Aşağıdakılar ümumi nümunələrdir. Əgər "public.users" cədvəlində tenant_id varsa, onu join edə bilərik.

-- Məsələn:
-- CREATE POLICY "İstifadəçilər yalnız öz şirkətinin hesablarını görə bilər" 
-- ON public.chart_of_accounts FOR ALL 
-- USING (tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Hələlik sadələşdirmə məqsədilə hər kəs üçün AÇIQ edirik (Sonra təhlükəsizlik əlavə olunacaq):
CREATE POLICY "Allow all access to chart_of_accounts for testing" ON public.chart_of_accounts FOR ALL USING (true);
CREATE POLICY "Allow all access to journal_entries for testing" ON public.journal_entries FOR ALL USING (true);
CREATE POLICY "Allow all access to journal_lines for testing" ON public.journal_lines FOR ALL USING (true);
