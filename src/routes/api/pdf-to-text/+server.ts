import type { RequestHandler } from './$types';
import pdf from 'pdf-parse';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url } = await request.json();

		if (!url || typeof url !== 'string') {
			return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
		}

		// Fetch the remote PDF
		const response = await fetch(url);
		if (!response.ok) {
			console.error('Failed to fetch PDF:', response.statusText);
			return new Response(JSON.stringify({ error: 'Failed to fetch PDF' }), { status: 500 });
		}

		// Convert to Buffer
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Parse the PDF
		const parsed = await pdf(buffer);

		return new Response(JSON.stringify({ text: parsed.text }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('PDF parse error:', err);
		return new Response(JSON.stringify({ error: 'Failed to parse PDF' }), { status: 500 });
	}
};
