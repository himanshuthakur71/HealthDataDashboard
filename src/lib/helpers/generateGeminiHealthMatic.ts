// src/lib/utils/generateGeminiHealthMatic.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PUBLIC_GEMINI_API_KEY } from '$env/static/public';

const genAI = new GoogleGenerativeAI(PUBLIC_GEMINI_API_KEY);
const aiModal = 'gemini-2.5-flash' // gemini-2.5-flash, gemini-1.5-flash

const model = genAI.getGenerativeModel({ model: aiModal });



export async function generateGeminiHealthMatic({
    text
}: {
    text: string;
}): Promise<any> {
    const prompt = `
You are a health assistant. Extract health metrics from the following patient report text.

Return ONLY a valid JSON in this format:

{
  metric: {
  "systolic": "string",
  "diastolic": "string",
  "heart_rate": "string",
  "blood_glucose": "string",
  "weight": "string",
  "temperature": "string",
  "custom_metrics":  [{"order": index, "key": "", "unit": "",  "value": ""}],
  "source": "uploaded"
},
extracted: true
}

If any value is missing, enter null. If any custom metric appears (e.g., "oxygen level", "BMI", etc.), put them under "custom_metrics" like [{"order": 1, "key": "Oxygen Saturation", "unit": "%",  "value": "72"}] if no custom_metrics eneter {"order": 1, "key": "", "unit": "",  "value": ""}, if there is no data in metric then extracted will be false.

--- Begin Report ---

${text}

--- End Report ---

Output only JSON and nothing else.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    return rawText

    // try {
    //     const parsed: any = JSON.parse(rawText);
    //     return {
    //         parsed
    //     };
    // } catch (err) {
    //     console.error('Gemini returned invalid JSON:', rawText);
    //     throw new Error('Failed to parse Gemini response as JSON');
    // }
}
