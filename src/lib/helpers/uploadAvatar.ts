// src/lib/uploadAvatar.ts
export async function uploadAvatarWithProgress({
	supabase,
	file,
	userId,
	onProgress
}: {
	supabase: any;
	file: File;
	userId: string;
	onProgress: (percent: number) => void;
}) {
	const fileExt = file.name.split('.').pop();
	const filePath = `${userId}/${Date.now()}.${fileExt}`;

	// Get signed upload URL
	const { data: signed, error: signedError } = await supabase.storage
		.from('avatars')
		.createSignedUploadUrl(filePath, 60);

	if (signedError) throw signedError;
	const signedUrl = signed?.signedUrl;

	// Upload with progress
	await new Promise<void>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedUrl, true);

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) {
				const percent = Math.round((e.loaded / e.total) * 100);
				onProgress(percent);
			}
		};

		xhr.onload = () => {
			if (xhr.status === 200) resolve();
			else reject(new Error('Upload failed with status ' + xhr.status));
		};

		xhr.onerror = () => reject(new Error('Upload failed'));
		xhr.send(file);
	});

	// Get public URL
	const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath);
	return publicData.publicUrl;
}
