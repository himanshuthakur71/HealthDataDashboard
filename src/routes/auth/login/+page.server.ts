import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data: user_data } = await supabase.auth.signInWithPassword({ email, password })

    // console.log(user_data)
    if (error) {
      console.error(error)
      return fail(400, { email, password, error: error.message });
    } else {
      if (user_data?.user.user_metadata.role == 'patient') {
        throw redirect(302, '/dashboard');
      }
      if (user_data?.user.user_metadata.role == 'admin') {
        throw redirect(302, '/admin');
      }
    }
  },

  google: async ({ url, locals: { supabase } }) => {

    // Start the Google OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url.origin}/auth/callback` // this must match the redirect URL in Supabase
      }
    })

    if (error) {
      console.error(error)
      return fail(400, { error: error.message });
    }

    // Redirect the user to Google's OAuth URL
    throw redirect(302, data.url)
  }

}