import { fail, json, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
    sendPasswordMail: async ({ request, locals: { supabase }, url }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string

        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${url?.origin}/auth/password/edit` // Replace with your real URL
        });
        if (err) {
            console.error(err)
            return fail(400, { email, error: err.message });
        } else {
            return { success: true };
        }
    },
}