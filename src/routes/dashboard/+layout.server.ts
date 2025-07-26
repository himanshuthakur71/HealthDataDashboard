import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
    const { session } = await safeGetSession()

    
    if (!session?.user?.id) {
        throw error(422, 'Access denied');
    }
}