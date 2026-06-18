import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Supabase middleware bypassed — auth is handled by AuthContext on the client side
  return NextResponse.next({ request });
}
