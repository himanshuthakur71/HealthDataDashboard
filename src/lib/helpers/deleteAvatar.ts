import type { SupabaseClient } from "@supabase/supabase-js";

function getFilePathFromUrl(url: string): string {
	const parts = url.split('/avatars/');
	return parts[1] || '';
}

export async function deleteAvatar(
	avatarUrl: string,
	userId: string,
	supabase: SupabaseClient
) {
	const filePath = getFilePathFromUrl(avatarUrl);
	if (!filePath) throw new Error('Invalid avatar URL');

	// 1. Delete from storage
	const { error: storageError } = await supabase.storage.from('avatars').remove([filePath]);
	if (storageError) throw storageError;

	// 2. Clear avatar_url from auth metadata
	await supabase.auth.updateUser({ data: { avatar_url: null } });
}
