import type { PageServerLoad } from './$types';
import { subDays } from 'date-fns';

export const load: PageServerLoad = async ({ locals: { supabase, user }, url, depends }) => {


	depends('supabase:health_metrics')

	if (!user) return { metrics: [] };

	const range = Number(url.searchParams.get('range') || 0);

	// Convert filter values
	const bp = Number(url.searchParams.get('bp'));
	const hr = Number(url.searchParams.get('hr'));
	const glucose = Number(url.searchParams.get('glucose'));
	const weight = Number(url.searchParams.get('weight'));
	const temp = Number(url.searchParams.get('temp'));
	const source = url.searchParams.get('source') || '';

	let query = supabase
		.from('health_metrics')
		.select('*')
		.order('created_at', { ascending: false });

	if (range > 0) {
		const fromDate = subDays(new Date(), range).toISOString();
		query = query.gte('created_at', fromDate);
	}

	// Safe numeric filters
	if (!isNaN(bp)) {
		query = query.gte('systolic', bp).gte('diastolic', bp);
	}

	if (!isNaN(hr)) {
		query = query.gte('heart_rate', hr);
	}

	if (!isNaN(glucose)) {
		query = query.gte('blood_glucose', glucose);
	}

	if (!isNaN(weight)) {
		query = query.gte('weight', weight);
	}

	if (!isNaN(temp)) {
		query = query.gte('temperature', temp);
	}

	if (source) {
		query = query.ilike('source', `%${source}%`);
	}

	const { data: metrics, error } = await query;

	if (error) {
		console.error('Error fetching metrics:', error.message);
		return { metrics: [] };
	}

	return { metrics };
};
