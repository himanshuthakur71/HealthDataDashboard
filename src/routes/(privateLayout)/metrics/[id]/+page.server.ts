// +page.server.ts
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';



export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
    const id = params.id;

    if (!user) {
        throw error(422, 'Access denied');
    }

    const { data: metric, error: err } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('id', id)
        .single();


    if (err) {
        console.error('Error fetching metric:', err);

        throw error(422, 'Access denied');
    }

    return { metric };
};



export const actions: Actions = {
    addMetrics: async ({ request, locals: { supabase, user }, params }) => {

        const id = params.id;

        if (!user) return fail(401, { error: 'Unauthorized' });

        const formData = await request.formData();

        // Parse simple fields
        const systolic = formData.get('systolic');
        const diastolic = formData.get('diastolic');
        const heart_rate = formData.get('heart_rate');
        const blood_glucose = formData.get('blood_glucose');
        const weight = formData.get('weight');
        const temperature = formData.get('temperature');
        const source = formData.get('source');
        const pdf_url = formData.get('pdf_url') || null;

        // Parse dynamic custom metrics
        const orders = formData.getAll('order');
        const keys = formData.getAll('key');
        const values = formData.getAll('value');
        const units = formData.getAll('unit');

        const custom_metrics = keys.map((_, i) => ({
            order: orders[i],
            key: keys[i],
            value: values[i],
            unit: units[i]
        }));

        const raw_data = {
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
        }

        // console.log(raw_data)

        const { error } = await supabase
            .from('health_metrics')
            .update(raw_data)
            .eq('id', id);

        if (error) {
            console.error(error);
            return fail(500, { error: 'Failed to save health metric' });
        }

        return { success: 'Health metric saved!' };
    }
};
