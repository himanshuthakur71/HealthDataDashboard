import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pdf from 'pdf-parse';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { pdfUrl } = await request.json();

		if (!pdfUrl) {
			throw error(400, 'Missing PDF URL');
		}

		// Fetch the PDF
		const response = await fetch(pdfUrl);
		if (!response.ok) {
			throw error(400, 'Unable to fetch PDF from provided URL');
		}

		const buffer = await response.arrayBuffer();

		// Extract text using pdf-parse
		const data = await pdf(Buffer.from(buffer));

		return json({
			text: data.text
		});
	} catch (err: any) {
		console.error('PDF to Text error:', err);
		throw error(500, err.message || 'PDF parsing failed');
	}
};
