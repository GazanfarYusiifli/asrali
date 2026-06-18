-- ==============================================================================
-- 1C MƏNTİQİ İLƏ SƏHİYYƏ ERP SİSTEMİ BAZASI (PostgreSQL)
-- Bütün uçot ikiqat yazılış (Double-Entry) və Jurnal üzərindən işləyir.
-- ==============================================================================

-- Təmizləmə
DROP TABLE IF EXISTS erp_journal_lines CASCADE;
DROP TABLE IF EXISTS erp_journal_entries CASCADE;
DROP TABLE IF EXISTS erp_document_lines CASCADE;
DROP TABLE IF EXISTS erp_documents CASCADE;
DROP TABLE IF EXISTS erp_items CASCADE;
DROP TABLE IF EXISTS erp_counterparties CASCADE;
DROP TABLE IF EXISTS erp_warehouses CASCADE;
DROP TABLE IF EXISTS erp_chart_of_accounts CASCADE;
DROP TABLE IF EXISTS erp_users CASCADE;
DROP TABLE IF EXISTS erp_roles CASCADE;
DROP TABLE IF EXISTS erp_companies CASCADE;


-- ==============================================================================
-- 1. SORĞU KİTABÇALARI (DIRECTORIES / CATALOGS)
-- ==============================================================================

-- 1.1. Müəssisələr (Rayon, Xəstəxana, Poliklinika)
CREATE TABLE erp_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- Məs: FAC-001
    name VARCHAR(255) NOT NULL,
    company_type VARCHAR(100) NOT NULL, -- Xəstəxana, Poliklinika, Mərkəzi Şöbə
    voen VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.2. Rollar və İstifadəçilər
CREATE TABLE erp_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL, -- Admin, Mühasib, Kassir, Anbarçı, Həkim
    description TEXT
);

CREATE TABLE erp_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES erp_companies(id) ON DELETE CASCADE,
    role_id UUID REFERENCES erp_roles(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3. Hesablar Planı (Chart of Accounts)
CREATE TABLE erp_chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- Məs: 101, 201, 211, 531, 601, 701
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- Aktiv, Passiv, Gəlir, Xərc
    is_group BOOLEAN DEFAULT FALSE, -- Qrup hesabıdır, yoxsa alt hesablardır?
    parent_id UUID REFERENCES erp_chart_of_accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.4. Kontragentlər (Xəstələr, Təchizatçılar, Sığorta şirkətləri)
CREATE TABLE erp_counterparties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Xəstə, Təchizatçı, Sığorta, Dövlət
    voen VARCHAR(50), -- Hüquqi şəxslər üçün
    fin VARCHAR(50),  -- Fiziki şəxslər üçün
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5. Mallar, Xidmətlər, Əsas Vəsaitlər (Nomenklatura)
CREATE TABLE erp_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- Dərman, Xidmət, Əsas Vəsait, Material
    unit VARCHAR(50) NOT NULL, -- Ədəd, Qutu, Xidmət
    default_price NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.6. Anbarlar
CREATE TABLE erp_warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES erp_companies(id) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. SƏNƏDLƏR (DOCUMENTS)
-- ==============================================================================

CREATE TABLE erp_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES erp_companies(id) NOT NULL,
    doc_number VARCHAR(100) UNIQUE NOT NULL, -- Məs: INV-2026-0001
    doc_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    doc_type VARCHAR(100) NOT NULL, -- PurchaseInvoice, SalesInvoice, CashReceipt, CashPayment, Transfer
    status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- Draft, Posted, Voided
    counterparty_id UUID REFERENCES erp_counterparties(id),
    warehouse_id UUID REFERENCES erp_warehouses(id), -- Anbar əməliyyatları üçün
    total_amount NUMERIC(15, 2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID REFERENCES erp_users(id),
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE erp_document_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES erp_documents(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES erp_items(id) NOT NULL,
    quantity NUMERIC(15, 2) DEFAULT 1.00 NOT NULL,
    price NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    expiration_date DATE -- Dərmanlar üçün
);

-- ==============================================================================
-- 3. JURNAL VƏ REGİSTRLƏR (LEDGER / REGISTERS)
-- ==============================================================================

-- 3.1. Ümumi Jurnal Başlığı (Hər təsdiqlənmiş sənəd üçün yaranır)
CREATE TABLE erp_journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES erp_documents(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES erp_companies(id) NOT NULL,
    entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.2. Jurnal Sətirləri (İkili yazılış: Debet - Kredit)
CREATE TABLE erp_journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID REFERENCES erp_journal_entries(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES erp_chart_of_accounts(id) NOT NULL,
    is_debit BOOLEAN NOT NULL, -- TRUE = Debet, FALSE = Kredit
    amount NUMERIC(15, 2) NOT NULL,
    
    -- Analitika (1C Subconts)
    counterparty_id UUID REFERENCES erp_counterparties(id),
    item_id UUID REFERENCES erp_items(id),
    warehouse_id UUID REFERENCES erp_warehouses(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. BAZA GÖSTƏRİCİLƏRİ (INITIAL DATA)
-- ==============================================================================

INSERT INTO erp_chart_of_accounts (code, name, account_type, is_group) VALUES
('101', 'Əsas vəsaitlər', 'Aktiv', FALSE),
('201', 'Material ehtiyatları (Dərman, Sərfiyyat)', 'Aktiv', FALSE),
('211', 'Debitor borcları (Xəstələr, Sığorta)', 'Aktiv', FALSE),
('221', 'Kassa', 'Aktiv', FALSE),
('223', 'Bank hesablaşma hesabları', 'Aktiv', FALSE),
('531', 'Təchizatçılara qısamüddətli kreditor borcları', 'Passiv', FALSE),
('533', 'İşçilərə ödəniləcək əməkhaqqı borcları', 'Passiv', FALSE),
('601', 'Satış və xidmət gəlirləri', 'Gəlir', FALSE),
('611', 'Sair əməliyyat gəlirləri (Subsidiyalar)', 'Gəlir', FALSE),
('701', 'Əməkhaqqı xərcləri', 'Xərc', FALSE),
('711', 'Kommersiya xərcləri (Dərman maya dəyəri)', 'Xərc', FALSE),
('721', 'İnzibati xərclər (Kommunal, Təmir)', 'Xərc', FALSE);

INSERT INTO erp_roles (name, description) VALUES
('Admin', 'Sistem Administratoru'),
('Rayon Mühasibi', 'Mərkəzi Maliyyə Nəzarətçisi'),
('Filial Mühasibi', 'Tək filial üzrə mühasib'),
('Kassir', 'Kassa əməliyyatları'),
('Anbarçı', 'Anbar və ləvazimat qəbulu'),
('Həkim', 'Xidmət göstərən (Tibbi aktlar)');

-- Default Şirkət
INSERT INTO erp_companies (code, name, company_type, voen) VALUES 
('FAC-001', 'Bərdə Rayon Mərkəzi Xəstəxanası', 'Xəstəxana', '1500000001');

-- View for Trial Balance (Dövriyyə Cədvəli)
CREATE OR REPLACE VIEW view_trial_balance AS
SELECT 
    a.code AS account_code,
    a.name AS account_name,
    a.account_type,
    SUM(CASE WHEN l.is_debit = TRUE THEN l.amount ELSE 0 END) AS total_debit,
    SUM(CASE WHEN l.is_debit = FALSE THEN l.amount ELSE 0 END) AS total_credit,
    SUM(CASE WHEN l.is_debit = TRUE THEN l.amount ELSE -l.amount END) AS balance
FROM erp_journal_lines l
JOIN erp_chart_of_accounts a ON l.account_id = a.id
GROUP BY a.code, a.name, a.account_type
ORDER BY a.code;
