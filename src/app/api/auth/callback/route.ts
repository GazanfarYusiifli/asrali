import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/erp/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      const isRegistered = session.user.user_metadata?.registered === true;
      
      if (type === 'register') {
        if (isRegistered) {
          // Zaten qeydiyyatdan keçibsə, birbaşa panelə
          return NextResponse.redirect(`${origin}${next}`)
        } else {
          // Yeni Google istifadəçisidirsə, şirkət məlumatları üçün onboarding-ə göndər
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      } else {
        // type === 'login' və ya undefined (Yəni giriş səhifəsindən Google kliklənibsə)
        if (isRegistered) {
          return NextResponse.redirect(`${origin}${next}`)
        } else {
          // Qeydiyyatdan keçməyib, amma login etməyə çalışır
          // We redirect to login with a flag so the client can perform signOut to clear localStorage
          return NextResponse.redirect(`${origin}/login?error=not_registered&force_logout=true`)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
