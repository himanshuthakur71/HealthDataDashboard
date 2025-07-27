import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
    if (!user || user.user_metadata.role != 'provider') {
        throw error(422, 'Access denied');
    }

    const [{ data: users }, { data: metrics }, { data: reports }] = await Promise.all([
        supabase.from('profiles').select('id, first_name, last_name, email, role'),
        supabase.from('health_metrics').select('id, user_id, created_at'),
        supabase.from('ai_reports').select('id, user_id, created_at')
    ]);

    return {
        users: users || [],
        totalMetrics: metrics?.length || 0,
        totalReports: reports?.length || 0
    };
};