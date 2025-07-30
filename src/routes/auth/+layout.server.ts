import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
    

    

    if (user?.id && user.user_metadata.role == 'patient') {
        throw redirect(302, '/dashboard');
    }
    if (user?.id && user.user_metadata.role == 'admin') {
        throw redirect(302, '/admin');
    }
}