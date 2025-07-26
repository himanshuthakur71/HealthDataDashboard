import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
	const range = parseInt(url.searchParams.get('range') || '7', 10);

	const validRanges = [7, 30, 60, 90, 120];
	const safeRange = validRanges.includes(range) ? range : 7;

	const fromDate = subDays(new Date(), safeRange);

	const { data: metrics, error } = await supabase
		.from('health_metrics')
		.select('*')
		.eq('user_id', user?.id)
		.gte('created_at', fromDate.toISOString())
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading metrics:', error.message);
	}

	return {
		latestMetric: metrics?.[0] ?? {},
		metrics,
		range: safeRange
	};
};
