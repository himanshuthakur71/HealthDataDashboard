import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  updatePassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const password = formData.get('password') as string

    const { error: err } = await supabase.auth.updateUser({
      password: password
    });
    if (err) {
      console.error(err)
      return fail(400, { password, error: err.message });
    } else {
      return { success: true };
    }
  },
}