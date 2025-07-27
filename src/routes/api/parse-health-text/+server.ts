import { json } from '@sveltejs/kit';
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold
} from '@google/generative-ai';
import { PUBLIC_GEMINI_API_KEY } from '$env/static/public';

const apiKey = PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: 'gemini-1.5-flash'
});

const generationConfig = {
	temperature: 0.3,
	topP: 0.9,
	topK: 64,
	maxOutputTokens: 1024,
	responseMimeType: 'application/json'
};

export async function POST({ request }) {
	try {
		const body = await request.json();
		const { text } = body;

		if (!text) {
			return json({ error: 'Missing text input' }, { status: 400 });
		}

		const prompt = generateExtractionPrompt(text);

		const result = await model.generateContent({
			generationConfig,
			safetySettings: [
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_NONE
				}
			],
			contents: [{ role: 'user', parts: [{ text: prompt }] }]
		});

		const parsed = result.response.text();

		let parsedJSON;
		try {
			parsedJSON = JSON.parse(parsed);
		} catch (err) {
			console.warn('Failed to parse JSON. Raw output:', parsed);
			return json({ error: 'Model returned invalid JSON', raw: parsed }, { status: 500 });
		}

		return json({ data: parsedJSON });
	} catch (err) {
		console.error('Gemini parsing error:', err);
		return json({ error: 'Failed to parse health text' }, { status: 500 });
	}
}

// 🧠 Gemini Prompt to extract structured data
function generateExtractionPrompt(rawText: string): string {
	return `
You are a medical data extraction AI. Given a block of raw patient text data, return only the following JSON format:

{
  "systolic": "",
  "diastolic": "",
  "heart_rate": "",
  "blood_glucose": "",
  "weight": "",
  "temperature": "",
  "source": "manual",
  "custom_metrics": [
    { "key": "", "value": "", "unit": "" }
  ]
}

✅ Leave any field as an empty string ("") if not found in the input.
✅ Parse "Custom Metrics" as individual key-value-unit objects in the custom_metrics array.
✅ Respond ONLY with valid JSON — no commentary, no markdown, no extra text.

Here is the input:

""" 
${rawText}
"""
	`.trim();
}
