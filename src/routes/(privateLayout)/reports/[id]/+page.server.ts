import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
    const { id } = params;

    if (!user) {
        throw error(422, 'Access denied');
    }


    const { data: report, error: err } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('id', id)
        .single();

    if (err) {
        console.error('Error loading report:', err.message);
        throw error(422, 'Access denied');
    }

    return { report };
};
