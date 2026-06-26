-- Migration: Change B2B Network from Tenant/VOEN to User/Username

-- 1. Add username to users if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'username') THEN
        ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
    END IF;
END $$;

-- Assign a random username to existing users who don't have one
UPDATE public.users 
SET username = 'user_' || substr(id::text, 1, 8)
WHERE username IS NULL;

-- Make username NOT NULL after filling existing ones
ALTER TABLE public.users ALTER COLUMN username SET NOT NULL;

-- 2. Drop the old VÖEN-based table if it exists
DROP TABLE IF EXISTS public.network_documents CASCADE;

-- 3. Create the new Username-based network_documents table
CREATE TABLE public.network_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- e.g., 'INVOICE', 'CONTRACT', 'MESSAGE'
    title TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb, -- The payload of the document
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.network_documents ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for network_documents
-- A user can SELECT a document if they are the sender OR the receiver
DROP POLICY IF EXISTS "Users can view documents they sent or received" ON public.network_documents;
CREATE POLICY "Users can view documents they sent or received" 
ON public.network_documents FOR SELECT 
USING (
    sender_user_id = auth.uid() OR 
    receiver_user_id = auth.uid()
);

-- A user can INSERT a document only if they are the sender
DROP POLICY IF EXISTS "Users can send documents" ON public.network_documents;
CREATE POLICY "Users can send documents" 
ON public.network_documents FOR INSERT 
WITH CHECK (
    sender_user_id = auth.uid()
);

-- A user can UPDATE a document if they are the receiver (to change status) or sender (to edit before viewed)
DROP POLICY IF EXISTS "Users can update their network documents" ON public.network_documents;
CREATE POLICY "Users can update their network documents" 
ON public.network_documents FOR UPDATE 
USING (
    sender_user_id = auth.uid() OR 
    receiver_user_id = auth.uid()
);

-- 6. Trigger for updated_at
DROP TRIGGER IF EXISTS set_network_documents_updated_at ON public.network_documents;
CREATE TRIGGER set_network_documents_updated_at
BEFORE UPDATE ON public.network_documents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. Allow all authenticated users to read usernames (so they can verify before sending)
DROP POLICY IF EXISTS "Anyone can view usernames" ON public.users;
CREATE POLICY "Anyone can view usernames" 
ON public.users FOR SELECT 
USING (auth.role() = 'authenticated');
