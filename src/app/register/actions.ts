'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitRegistrationRequest(formData: FormData) {
  const supabase = await createClient()

  const data = {
    org_type: formData.get('orgType'),
    org_name: formData.get('orgName'),
    contact_name: formData.get('contactName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    lang: formData.get('lang'),
    subdomain: formData.get('subdomain'),
  }

  // Burada biz gələcəkdə müraciətləri `tenant_requests` adlı cədvələ yazacağıq
  // Hələlik cədvəl bazada yaradılmadığı üçün dummy "success" qayıdırıq.
  
  console.log("Registration Request:", data);
  
  // Real implementasiya:
  // const { error } = await supabase.from('tenant_requests').insert([data])
  // if (error) return { error: error.message }

  return { success: true }
}
