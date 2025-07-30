// File: src/routes/admin/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
    if (user?.id && user.user_metadata.role != 'admin') {
        throw error(422, 'Access denied');
    }

    const [usersRes, metricsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('health_metrics').select('*'),
    ]);

    const users = usersRes.data ?? [];
    const metrics = metricsRes.data ?? [];

    return {
        users,
        metrics,
    };
};
