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
        try {
          // Auto-register the user if they login/register with Google or Facebook for the first time
          await supabase.auth.updateUser({
            data: { registered: true }
          });
          
          // Fetch full name from OAuth provider or default to "Yeni İstifadəçi"
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Yeni İstifadəçi';
          const email = session.user.email || '';
          
          // Complete registration by calling the RPC
          await supabase.rpc('complete_user_registration', {
            p_full_name: fullName,
            p_company_name: email ? email.split('@')[0] + ' MMC' : 'Şirkət',
            p_phone: '',
            p_country: 'Azərbaycan',
            p_city: 'Bakı',
            p_username: email ? email.split('@')[0] : 'user_' + Math.floor(Math.random() * 10000),
            p_email: email
          });
        } catch (e) {
          console.error("Auto registration error:", e);
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Exchange code error:", error);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
