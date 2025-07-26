import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirm_password = formData.get('confirm_password') as string

    if (confirm_password !== password) {
      return fail(400, { first_name, last_name, email, password, confirm_password, passwordMisMatch: true });
    }

    const { error } = await supabase.auth.signUp({
      email, password, options: {
        data: {
          first_name,
          last_name,
          email,
          role: 'patient'
        }
      }
    })
    if (error) {
      console.error(error)
      return fail(400, { first_name, last_name, email, password, confirm_password, error: error.message });
    } else {
      return { first_name, last_name, email, password, confirm_password, success: true };
    }
  },
}