// File: src/routes/dashboard/+page.server.ts
import { subDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
	if (!user) return { metrics: [], totalMetrics: 0, totalReports: 0 };

	const range = parseInt(url.searchParams.get('range') || '7', 10);
	const validRanges = [7, 30, 60, 90, 120];
	const safeRange = validRanges.includes(range) ? range : 7;

	const fromDate = subDays(new Date(), safeRange);

	// Fetch health metrics
	const { data: metrics, error: metricsError } = await supabase
		.from('health_metrics')
		.select('*')
		.eq('user_id', user.id)
		.gte('created_at', fromDate.toISOString())
		.order('created_at', { ascending: false });

	if (metricsError) {
		console.error('Error loading metrics:', metricsError.message);
	}

	// Fetch total metrics count
	const { count: totalMetrics, error: countMetricsError } = await supabase
		.from('health_metrics')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id);

	if (countMetricsError) {
		console.error('Error getting total metrics count:', countMetricsError.message);
	}

	// Fetch total AI reports count
	const { count: totalReports, error: countReportsError } = await supabase
		.from('ai_reports')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id);

	if (countReportsError) {
		console.error('Error getting total reports count:', countReportsError.message);
	}

	return {
		latestMetric: metrics?.[0] ?? {},
		metrics: metrics ?? [],
		totalMetrics: totalMetrics ?? 0,
		totalReports: totalReports ?? 0,
		range: safeRange
	};
};
