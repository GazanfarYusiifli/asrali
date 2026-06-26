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

  // Get sender tenant
  const { data: senderUser } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!senderUser || !senderUser.tenant_id) {
    throw new Error('Tenant not found');
  }

  const receiverVoen = formData.get('voen') as string;
  const documentType = formData.get('type') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!receiverVoen || !documentType || !title) {
    throw new Error('Missing fields');
  }

  // Find receiver tenant by VOEN
  const { data: receiverTenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('voen', receiverVoen)
    .single();

  if (!receiverTenant) {
    return { error: 'Bu VÖEN ilə sistemdə qeydiyyatdan keçmiş şirkət tapılmadı.' };
  }

  if (receiverTenant.id === senderUser.tenant_id) {
    return { error: 'Özünüzə sənəd göndərə bilməzsiniz.' };
  }

  // Create network document
  const { error: insertError } = await supabase
    .from('network_documents')
    .insert({
      sender_tenant_id: senderUser.tenant_id,
      receiver_tenant_id: receiverTenant.id,
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
