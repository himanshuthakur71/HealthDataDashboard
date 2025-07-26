import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      return fail(400, { email, password,  error: error.message });
    } else {
      redirect(303, '/dashboard')
    }
  },
}