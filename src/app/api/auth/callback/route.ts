import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/erp/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      const isRegistered = session.user.user_metadata?.registered === true;
      
      if (!isRegistered) {
        // Auto-register the user if they login/register with Google or Facebook for the first time
        const { error: updateError } = await supabase.auth.updateUser({
          data: { registered: true }
        });
        
        if (!updateError) {
          // Fetch full name from OAuth provider or default to "Yeni İstifadəçi"
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Yeni İstifadəçi';
          const email = session.user.email || '';
          
          // Complete registration by calling the RPC
          await supabase.rpc('complete_user_registration', {
            p_full_name: fullName,
            p_company_name: 'Mənim Şirkətim', // Default company name for OAuth users
            p_phone: '',
            p_country: 'Azərbaycan',
            p_city: 'Bakı',
            p_username: email.split('@')[0],
            p_email: email
          });
        }
      }
      
      // Hər halda daxil olduqdan sonra ana səhifəyə yox, birbaşa idarəetmə panelinə yönləndir
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
