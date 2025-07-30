// +page.server.ts
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	addMetrics: async ({ request, locals: { supabase, user } }) => {
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const systolic = Number(formData.get('systolic'));
		const diastolic = Number(formData.get('diastolic'));
		const heart_rate = Number(formData.get('heart_rate'));
		const blood_glucose = Number(formData.get('blood_glucose'));
		const weight = Number(formData.get('weight'));
		const temperature = Number(formData.get('temperature'));
		const source = formData.get('source')?.toString() || 'manual';
		const pdf_url = formData.get('pdf_url')?.toString() || null;

		const orders = formData.getAll('order');
		const keys = formData.getAll('key');
		const values = formData.getAll('value');
		const units = formData.getAll('unit');

		const custom_metrics = keys.map((_, i) => ({
			order: Number(orders[i]),
			key: keys[i]?.toString(),
			value: values[i]?.toString(),
			unit: units[i]?.toString()
		}));

		const healthData = {
			user_id: user.id,
			systolic,
			diastolic,
			heart_rate,
			blood_glucose,
			weight,
			temperature,
			source,
			pdf_url,
			custom_metrics
		};

		const { error, data: metric } = await supabase.from('health_metrics').insert(healthData).select().single();

		if (error) {
			console.error(error);
			return fail(500, { error: 'Failed to save health metric' });
		}

		return {
			success: true,
			formData: healthData,
			metric_id: metric?.id,
		};
	}
};
