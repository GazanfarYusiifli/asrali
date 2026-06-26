-- Migration: Add B2B Network capabilities (voen and network_documents)

-- 1. Add VÖEN to tenants if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'tenants' 
                   AND column_name = 'voen') THEN
        ALTER TABLE public.tenants ADD COLUMN voen TEXT UNIQUE;
    END IF;
END $$;

-- 2. Create network_documents table
CREATE TABLE IF NOT EXISTS public.network_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    receiver_tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- e.g., 'INVOICE', 'CONTRACT', 'MESSAGE'
    title TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb, -- The payload of the document
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.network_documents ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for network_documents
-- A tenant can SELECT a document if they are the sender OR the receiver
DROP POLICY IF EXISTS "Tenants can view documents they sent or received" ON public.network_documents;
CREATE POLICY "Tenants can view documents they sent or received" 
ON public.network_documents FOR SELECT 
USING (
    sender_tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid()) OR 
    receiver_tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid())
);

-- A tenant can INSERT a document only if they are the sender
DROP POLICY IF EXISTS "Tenants can send documents" ON public.network_documents;
CREATE POLICY "Tenants can send documents" 
ON public.network_documents FOR INSERT 
WITH CHECK (
    sender_tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid())
);

-- A tenant can UPDATE a document if they are the receiver (to change status) or sender (to edit before viewed)
DROP POLICY IF EXISTS "Tenants can update their network documents" ON public.network_documents;
CREATE POLICY "Tenants can update their network documents" 
ON public.network_documents FOR UPDATE 
USING (
    sender_tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid()) OR 
    receiver_tenant_id = (SELECT tenant_id FROM public.users WHERE users.id = auth.uid())
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_network_documents_updated_at ON public.network_documents;
CREATE TRIGGER set_network_documents_updated_at
BEFORE UPDATE ON public.network_documents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
