// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const {
    url,
    locals: { supabase }
  } = event

  const code = url.searchParams.get('code') as string
  const next = url.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        const fullName = user.user_metadata.full_name || user.user_metadata.name || ''
        const [first_name, ...rest] = fullName.split(' ')
        const last_name = rest.join(' ')



        const { data: userData, error: updateError } = await supabase.auth.updateUser({
          data: {
            first_name: first_name || '',
            last_name: last_name || '',
            email: user.user_metadata.email,
            role: 'patient',
            country: 'IN',
            avatar_url: user.user_metadata?.avatar_url ?? ''
          }
        });


        if (updateError) {
          console.error('Metadata update failed:', updateError)
        }
      }

      throw redirect(303, next)
    }
  }

  throw redirect(303, '/auth/auth-code-error')
}
