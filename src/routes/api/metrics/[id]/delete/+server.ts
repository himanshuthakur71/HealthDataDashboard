import { json, error } from '@sveltejs/kit';


export const POST = async ({ request, locals: { supabase, user }, params }) => {
    try {


        const id = params.id;


        if (!user?.id && !id) {
            throw error(401, 'Unauthorized');
        }


        const { error: insertError } = await supabase
            .from('health_metrics')
            .delete()
            .eq('id', id);





        if (insertError) {
            console.error(insertError);
            throw error(500, 'Failed to delete metric');
        }

        return json({ success: true });
    } catch (err: any) {
        console.error('API ERROR:', err);
        return json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
    }
};
