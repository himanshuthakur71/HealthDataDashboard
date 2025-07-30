import { GoogleGenerativeAI } from '@google/generative-ai';
import { PUBLIC_GEMINI_API_KEY } from '$env/static/public';

const genAI = new GoogleGenerativeAI(PUBLIC_GEMINI_API_KEY);


const aiModal = 'gemini-2.5-flash' // gemini-2.5-flash, gemini-1.5-flash

const model = genAI.getGenerativeModel({ model: aiModal });

export async function generateGeminiReport({
	formData,
	healthScore,
	patient_name
}: {
	formData: any;
	healthScore: any;
	patient_name:any
}): Promise<string> {
	const prompt = `
Generate a doctor's health report analysis based on the following metrics:

- Patient Name: ${patient_name}
- Date of Report: Today Date


- Systolic: ${formData?.systolic} mmHg
- Diastolic: ${formData?.diastolic} mmHg
- Heart Rate: ${formData?.heart_rate} bpm
- Blood Glucose: ${formData?.blood_glucose} mg/dL
- Weight: ${formData?.weight} kg
- Temperature: ${formData?.temperature} °C
- Health Score: ${healthScore}

${
	formData.custom_metrics?.length
		? 'Additional custom metrics:\n' +
		  formData.custom_metrics
				.map((m: any) => `- ${m.key}: ${m.value} ${m.unit}`)
				.join('\n')
		: ''
}

Give feedback in clear bullet points like a doctor’s health report summary also use emojis if possible also your name is Dr. Health AI.
`;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	return response.text();
}
