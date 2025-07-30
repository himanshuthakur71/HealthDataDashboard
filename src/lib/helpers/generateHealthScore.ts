export function generateHealthScore({
	systolic,
	diastolic,
	heart_rate,
	blood_glucose,
	weight,
	temperature,
	custom_metrics = []
}: {
	systolic: number;
	diastolic: number;
	heart_rate: number;
	blood_glucose: number;
	weight: number;
	temperature: number;
	custom_metrics?: {
		key: string;
		value: number;
		unit: string;
	}[];
}): number {
	let score = 100;

	// Blood pressure
	if (systolic > 140 || diastolic > 90) score -= 15;
	else if (systolic > 130 || diastolic > 85) score -= 8;

	// Heart rate
	if (heart_rate < 50 || heart_rate > 100) score -= 10;
	else if (heart_rate < 60 || heart_rate > 90) score -= 5;

	// Blood glucose
	if (blood_glucose > 200) score -= 20;
	else if (blood_glucose > 140) score -= 10;

	// Temperature
	if (temperature > 38 || temperature < 35) score -= 10;

	// Weight (placeholder logic)
	if (weight > 120) score -= 10;
	else if (weight > 100) score -= 5;

	// Optional: custom metrics (example scoring)
	custom_metrics.forEach((metric) => {
		if (metric.key.toLowerCase().includes('cholesterol') && +metric.value > 240) {
			score -= 10;
		}
	});

	return Math.max(0, Math.min(100, Math.round(score))); // Clamp between 0–100
}
