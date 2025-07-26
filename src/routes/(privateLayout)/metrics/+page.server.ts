
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {


    const {
        data: metrics,
        error
    } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    const latest = metrics?.[0] ?? {};

    return {
        metrics,
        latestMetrics: latest
    };
};
