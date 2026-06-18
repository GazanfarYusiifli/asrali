-- ==============================================================================
-- HOSPITAL MANAGEMENT SYSTEM - DATABASE SCHEMA & RLS
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums for Statuses and Roles
CREATE TYPE app_role AS ENUM ('admin', 'doctor', 'receptionist', 'accountant', 'hr', 'pharmacy');
CREATE TYPE appointment_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE transaction_type AS ENUM ('in', 'out');

-- ==============================================================================
-- 3. CORE TABLES
-- ==============================================================================

-- USERS (Maps to auth.users in Supabase)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DEPARTMENTS
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EMPLOYEES (Managed by HR)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable if employee doesn't have system access
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    salary DECIMAL(10, 2),
    hire_date DATE NOT NULL,
    position VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DOCTORS (Extends Employees for Doctor specifics)
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Shortcut reference for RLS
    specialization VARCHAR(150),
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PATIENTS (Managed by Receptionist)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    phone VARCHAR(50),
    address TEXT,
    blood_group VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- APPOINTMENTS (Managed by Receptionist, viewed by Doctors)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEDICAL RECORDS (Managed by Doctors)
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVOICES (Managed by Accountant / Receptionist optionally)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'unpaid',
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS (Managed by Accountant)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- e.g., Cash, Card, Bank
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVENTORY (Managed by Pharmacy)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity_in_stock INT DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVENTORY TRANSACTIONS
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    quantity INT NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- ==============================================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. HELPER FUNCTION TO GET CURRENT USER ROLE
-- ==============================================================================
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 🔹 GLOBAL ADMIN ACCESS
-- Admin has full access to ALL tables.
-- ------------------------------------------------------------------------------
-- Apply to all tables automatically via a simple rule (Repeat for each table)
CREATE POLICY "Admin full access" ON users FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON departments FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON employees FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON doctors FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON patients FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON appointments FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON medical_records FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON invoices FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON payments FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON inventory FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Admin full access" ON inventory_transactions FOR ALL USING (get_current_user_role() = 'admin');


-- ------------------------------------------------------------------------------
-- 👨‍⚕️ DOCTOR POLICIES
-- Doctors only see their own appointments, patients, and medical records.
-- ------------------------------------------------------------------------------
CREATE POLICY "Doctors see own appointments" ON appointments FOR SELECT
USING ( doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) );

CREATE POLICY "Doctors see own patients" ON patients FOR SELECT
USING (
  id IN (
    SELECT patient_id FROM appointments 
    WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Doctors view own medical records" ON medical_records FOR SELECT
USING ( doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) );

CREATE POLICY "Doctors insert own medical records" ON medical_records FOR INSERT
WITH CHECK ( doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) );

CREATE POLICY "Doctors update own medical records" ON medical_records FOR UPDATE
USING ( doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) );


-- ------------------------------------------------------------------------------
-- 🧾 RECEPTIONIST POLICIES
-- Receptionists manage patients and appointments, but cannot see medical details.
-- ------------------------------------------------------------------------------
CREATE POLICY "Receptionist full patient access" ON patients FOR ALL 
USING (get_current_user_role() = 'receptionist');

CREATE POLICY "Receptionist full appointment access" ON appointments FOR ALL 
USING (get_current_user_role() = 'receptionist');

-- Receptionist CANNOT access medical_records (No policy for them on medical_records)


-- ------------------------------------------------------------------------------
-- 💰 ACCOUNTANT POLICIES
-- Accountants manage invoices and payments. They can only SELECT basic patient info.
-- ------------------------------------------------------------------------------
CREATE POLICY "Accountant full invoice access" ON invoices FOR ALL 
USING (get_current_user_role() = 'accountant');

CREATE POLICY "Accountant full payment access" ON payments FOR ALL 
USING (get_current_user_role() = 'accountant');

CREATE POLICY "Accountant can view patients" ON patients FOR SELECT 
USING (get_current_user_role() = 'accountant');

-- Accountant CANNOT access medical_records


-- ------------------------------------------------------------------------------
-- 📦 PHARMACY / INVENTORY POLICIES
-- Pharmacy ONLY manages inventory and transactions.
-- ------------------------------------------------------------------------------
CREATE POLICY "Pharmacy full inventory access" ON inventory FOR ALL 
USING (get_current_user_role() = 'pharmacy');

CREATE POLICY "Pharmacy full transactions access" ON inventory_transactions FOR ALL 
USING (get_current_user_role() = 'pharmacy');

-- Pharmacy CANNOT access patients, appointments, etc.


-- ------------------------------------------------------------------------------
-- 👨‍💼 HR POLICIES
-- HR ONLY manages employees and departments.
-- ------------------------------------------------------------------------------
CREATE POLICY "HR full employee access" ON employees FOR ALL 
USING (get_current_user_role() = 'hr');

CREATE POLICY "HR full department access" ON departments FOR ALL 
USING (get_current_user_role() = 'hr');

-- HR CANNOT access clinical or financial tables.
