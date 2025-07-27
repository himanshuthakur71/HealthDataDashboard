// src/lib/uploadPdfWithProgress.ts
export async function uploadPdfWithProgress({
	supabase,
	file,
	userId,
	onProgress
}: {
	supabase: any;
	file: File;
	userId: any;
	onProgress: (percent: number) => void;
}) {
	if (file.type !== 'application/pdf') {
		throw new Error('Only PDF files are allowed');
	}

	// Get file extension
	const fileExt = file.name.split('.').pop();

	// Clean original filename (no extension, no spaces, no special chars)
	const originalName = file.name
		.split('.')
		.slice(0, -1)
		.join('_') // in case multiple dots
		.replace(/\s+/g, '_') // replace spaces with _
		.replace(/[^a-zA-Z0-9_-]/g, ''); // strip special characters

	const timestamp = Date.now();

	// Generate full file path
	const filePath = `reports/${userId}/${timestamp}_${originalName}.${fileExt}`;

	// 1. Create signed URL for upload
	const { data: signed, error: signedError } = await supabase.storage
		.from('pdf-reports')
		.createSignedUploadUrl(filePath, 60); // valid for 60s

	if (signedError) throw signedError;

	// 2. Upload with progress
	await new Promise<void>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signed.signedUrl, true);

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

	// 3. Get public URL
	const { data: publicData, error: publicError } = supabase.storage
		.from('pdf-reports')
		.getPublicUrl(filePath);

	if (publicError) throw publicError;
	return publicData.publicUrl;
}
