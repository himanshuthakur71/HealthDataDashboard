import { json } from '@sveltejs/kit';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

import { PUBLIC_GEMINI_API_KEY } from '$env/static/public'

const apiKey = PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { formData, healthScore } = body;

        if (!formData) {
            return json({ error: 'formData is required' }, { status: 400 });
        }

        const aiPrompt = generateDoctorPrompt(formData, healthScore);

        async function run() {
            const chatSession = model.startChat({
                generationConfig,
                history: []
            });

            const result = await chatSession.sendMessage(aiPrompt);
            return result.response.text();
        }

        const generatedText = await run();


        return json({ generatedText }, { status: 200 });

    } catch (error) {
        console.error('Error querying Gemini API:', error);
        return json({ error: 'Failed to fetch Gemini API result' }, { status: 500 });
    }
}


// ✅ Prompt Generator
function generateDoctorPrompt(data: any, score: number): string {
    const {
        systolic,
        diastolic,
        heart_rate,
        blood_glucose,
        weight,
        temperature,
        custom_metrics = [],
        source,
        created_at
    } = data;

    const createdAtFormatted = new Date(created_at).toDateString();

    let prompt = `You are an AI health assistant giving advice to a user based on their vitals.\n`;
    prompt += `\nDate: ${createdAtFormatted}`;
    prompt += `\nHealth Score: ${score}/100`;
    prompt += `\nSource: ${source}`;

    prompt += `\n\nVitals:\n`;
    prompt += `- Blood Pressure: ${systolic}/${diastolic} mmHg\n`;
    prompt += `- Heart Rate: ${heart_rate} bpm\n`;
    prompt += `- Blood Glucose: ${blood_glucose} mg/dL\n`;
    prompt += `- Body Weight: ${weight} kg\n`;
    prompt += `- Temperature: ${temperature} °C\n`;

    if (custom_metrics.length > 0) {
        prompt += `\nAdditional Custom Metrics:\n`;
        for (const m of custom_metrics) {
            prompt += `- ${m.key}: ${m.value} ${m.unit}\n`;
        }
    }

    prompt += `\n\nPlease analyze the values and provide a summary:\n`;
    prompt += `1. Mention any critical or abnormal metrics.\n`;
    prompt += `2. Suggest health advice or lifestyle improvements.\n`;
    prompt += `3. Be supportive and friendly.\n`;
    prompt += `4. Mention that this is AI-generated and not a real diagnosis.`;

    return prompt;
}
