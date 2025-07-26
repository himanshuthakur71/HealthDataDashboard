import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data: user_data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      return fail(400, { email, password, error: error.message });
    } else {
      if (user_data?.user.user_metadata.role == 'patient') {
        throw redirect(302, '/dashboard');
      }
      if (user_data?.user.user_metadata.role == 'provider') {
        throw redirect(302, '/admin');
      }
    }
  },
}