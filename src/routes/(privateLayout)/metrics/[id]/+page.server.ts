import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
	const id = params.id;

	if (!user) {
		throw error(422, 'Access denied');
	}

	const { data: metric, error: err } = await supabase
		.from('health_metrics')
		.select('*')
		.eq('id', id)
		.eq('user_id', user.id)
		.single();


	if (err) {
		console.error('Error fetching metric:', err);

		throw error(422, 'Access denied');
	}

	return { metric };
};
