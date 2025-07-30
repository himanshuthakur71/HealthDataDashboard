// src/routes/profile/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
    update: async ({ request, locals: { supabase, user } }) => {

        const formData = await request.formData();

        const first_name = formData.get('first_name')?.toString();
        const last_name = formData.get('last_name')?.toString();
        const dob = formData.get('dob')?.toString();
        const gender = formData.get('gender')?.toString();
        const country = formData.get('country')?.toString();
        const phone_number = formData.get('phone_number')?.toString();
       

        if (!user) throw redirect(303, '/auth/login');

      
        // Update profile
        const { data: userData, error: updateError } = await supabase.auth.updateUser({
            data: {
                first_name,
                last_name,
                dob,
                gender,
                country,
                phone_number
            }
        });

        if (updateError) {
            return fail(500, { error: 'Failed to update profile.' });
        }

        return { success: 'Profile updated successfully.' };
    }
};
