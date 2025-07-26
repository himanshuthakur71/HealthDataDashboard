import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
    const { session } = await safeGetSession()


    if (session?.user.user_metadata.role == 'patient') {
        throw redirect(302, '/dashboard');
    }
    if (session?.user.user_metadata.role == 'provider') {
        throw redirect(302, '/admin');
    }
}