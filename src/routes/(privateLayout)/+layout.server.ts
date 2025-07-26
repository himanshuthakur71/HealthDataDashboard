import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: {user} }) => {
   
    
    if (!user?.id) {
        throw error(422, 'Access denied');
    }
}