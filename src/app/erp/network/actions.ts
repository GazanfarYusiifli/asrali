'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function sendNetworkDocument(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const receiverEmail = formData.get('email') as string;
  const documentType = formData.get('type') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const redirectTo = formData.get('redirectTo') as string || '/erp/network';

  if (!receiverEmail || !documentType || !title) {
    throw new Error('Missing fields');
  }

  const cleanEmail = receiverEmail.trim().toLowerCase();

  // Find receiver user by email
  const { data: receiverUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', cleanEmail)
    .single();

  if (!receiverUser) {
    return { error: 'Bu E-poçt (Email) ünvanı ilə sistemdə qeydiyyatdan keçmiş istifadəçi tapılmadı.' };
  }

  if (receiverUser.id === user.id) {
    return { error: 'Özünüzə sənəd göndərə bilməzsiniz.' };
  }

  // Create network document
  const { error: insertError } = await supabase
    .from('network_documents')
    .insert({
      sender_user_id: user.id,
      receiver_user_id: receiverUser.id,
      document_type: documentType,
      title: title,
      data: { content },
      status: 'PENDING'
    });

  if (insertError) {
    console.error('Insert error:', insertError);
    return { error: 'Sənəd göndərilərkən xəta baş verdi.' };
  }

  revalidatePath('/erp/network');
  redirect(redirectTo);
}

export async function updateDocumentStatus(documentId: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('network_documents')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', documentId);

  if (error) {
    throw new Error('Failed to update status');
  }

  revalidatePath('/erp/network');
}
