// File: src/routes/admin/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
    if (user?.id && user.user_metadata.role != 'provider') {
        throw error(422, 'Access denied');
    }

    const [usersRes, metricsRes, reportsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('health_metrics').select('*'),
        supabase.from('ai_reports').select('*')
    ]);

    const users = usersRes.data ?? [];
    const metrics = metricsRes.data ?? [];
    const reports = reportsRes.data ?? [];

    return {
        users,
        metrics,
        reports,
    };
};
