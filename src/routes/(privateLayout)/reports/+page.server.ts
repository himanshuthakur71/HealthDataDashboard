import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) return { reports: [] };

  const { data: reports, error } = await supabase
    .from('ai_reports')
    .select('*')
    .order('created_at', { ascending: false });

  return { reports: reports || [] };
};