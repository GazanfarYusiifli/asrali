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

  const receiverUsername = formData.get('username') as string;
  const documentType = formData.get('type') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!receiverUsername || !documentType || !title) {
    throw new Error('Missing fields');
  }

  // Remove @ if the user typed it
  const cleanUsername = receiverUsername.replace('@', '').trim();

  // Find receiver user by username
  const { data: receiverUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', cleanUsername)
    .single();

  if (!receiverUser) {
    return { error: 'Bu istifadəçi adı (@username) ilə sistemdə qeydiyyatdan keçmiş istifadəçi tapılmadı.' };
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
  redirect('/erp/network');
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

// Function to update current user's username
export async function updateMyUsername(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  let newUsername = formData.get('username') as string;
  if (!newUsername) throw new Error('Username is required');

  newUsername = newUsername.replace(/[^a-zA-Z0-9_.]/g, '').toLowerCase();

  const { error } = await supabase
    .from('users')
    .update({ username: newUsername })
    .eq('id', user.id);

  if (error) {
    return { error: 'Bu istifadəçi adı artıq məşğuldur və ya xəta baş verdi.' };
  }

  revalidatePath('/erp/network');
  revalidatePath('/erp/ayarlar'); // Assuming there might be a settings page
  return { success: true };
}
