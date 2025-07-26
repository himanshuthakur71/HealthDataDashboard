import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
	const id = params.id;

	if (!user) {
		return { metric: null };
	}

	const { data: metric, error } = await supabase
		.from('health_metrics')
		.select('*')
		.eq('id', id)
		.eq('user_id', user.id)
		.single();

	if (error) {
		console.error('Error fetching metric:', error);
		return { metric: null };
	}

	return { metric };
};
