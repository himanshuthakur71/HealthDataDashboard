import { json, error } from '@sveltejs/kit';


export const POST = async ({ request, locals: { supabase, user } }) => {
	try {
		
        

       

		if (!user?.id) {
			throw error(401, 'Unauthorized');
		}


        //  console.log(user?.id)

		const body = await request.json();

		// Destructure with fallback/defaults
		const {
			systolic = null,
			diastolic = null,
			heart_rate = null,
			blood_glucose = null,
			weight = null,
			temperature = null,
			source = 'manual',
			custom_metrics = []
		} = body;

		// Validate at least one key metric is filled
		if (
			!systolic &&
			!diastolic &&
			!heart_rate &&
			!blood_glucose &&
			!weight &&
			!temperature &&
			custom_metrics.length === 0
		) {
			throw error(400, 'At least one metric is required');
		}

		const { error: insertError, data: insertData } = await supabase
			.from('health_metrics')
			.insert([
				{
					user_id: user?.id,
					systolic,
					diastolic,
					heart_rate,
					blood_glucose,
					weight,
					temperature,
					source,
					custom_metrics
				}
			]).select().single();

		if (insertError) {
			console.error(insertError);
			throw error(500, 'Failed to save metric');
		}

		return json({ success: true, id: insertData.id });
	} catch (err: any) {
		console.error('API ERROR:', err);
		return json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
	}
};
