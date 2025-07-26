// src/routes/logout/+server.ts
import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {


    const { error } = await supabase.auth.signOut()


    if (error) {
        console.error(error)
    } else {
        throw redirect(302, '/signout');
    }


};
