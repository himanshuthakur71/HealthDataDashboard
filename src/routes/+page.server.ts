import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals: { user } }) => {


    if (user?.id && user.user_metadata.role == 'patient') {
        throw redirect(302, '/dashboard');
    }
    if (user?.id && user.user_metadata.role == 'provider') {
        throw redirect(302, '/admin');
    }

}