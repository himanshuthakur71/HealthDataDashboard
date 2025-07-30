export function parseHealthTextToJSON(input: string): any | null {
	try {
		// Trim and sanitize the input
		const trimmed = input.trim();

		// If the input is already JSON-like, attempt to parse it
		if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
			return JSON.parse(trimmed);
		}

		// If the input has backticks (from Markdown or other sources), strip them
		const cleaned = trimmed
			.replace(/```json|```/g, '') // remove markdown-style code block
			.trim();

		return JSON.parse(cleaned);
	} catch (error) {
		console.error('Failed to parse input as JSON:', error);
		return null;
	}
}
