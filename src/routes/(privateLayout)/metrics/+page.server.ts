
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {


    const getUserMetrics = async () => {
        const {
            data: metrics,
            error
        } = await supabase
            .from('health_metrics')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });


        return metrics || []

        //  const latest = metrics?.[0] ?? {};
    }






    return {
        metrics: await getUserMetrics(),

    };
};
