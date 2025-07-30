import { marked } from "marked";

export const createEmailHTML = (healthScore: any, formData: any, geminiReport = '') => {

    let healthColor = '#198754'; // green
    if (healthScore < 40)
        healthColor = '#dc3545'; // red
    else if (healthScore < 70) healthColor = '#ffc107'; // yellow



    const htmlText = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
  <div style="background-color: ${healthColor}; padding: 20px; text-align: center;">
    <h1 style="color: #ffffff;">Health Report Summary</h1>
  </div>

  <div style="padding: 20px; background-color: #ffffff;">
    <p><strong>A new health report has been submitted.</strong></p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; font-weight: bold;">Systolic</td><td>${formData.systolic} mmHg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Diastolic</td><td>${formData.diastolic} mmHg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Heart Rate</td><td>${formData.heart_rate} bpm</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Blood Glucose</td><td>${formData.blood_glucose} mg/dL</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Weight</td><td>${formData.weight} kg</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Temperature</td><td>${formData.temperature} °C</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Source</td><td>${formData.source}</td></tr>
    </table>

    ${formData.custom_metrics?.length
            ? `
    <h3 style="margin-top: 20px;">Custom Metrics:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${formData.custom_metrics
                .map(
                    (m: any) =>
                        `<tr><td style="padding: 8px; font-weight: bold;">${m.key}</td><td>${m.value} ${m.unit}</td></tr>`
                )
                .join('')}
    </table>
    `
            : ''
        }

    <div style="background-color: #f8f9fa; padding: 15px; margin-top: 25px; border-radius: 6px;">
      <strong style="display: block; margin-bottom: 8px;">Health Score: ${healthScore} / 100</strong>
      <div style="width: 100%; background: #dee2e6; border-radius: 4px; height: 16px; overflow: hidden;">
        <div style="width: ${healthScore}%; background: ${healthColor}; height: 100%;"></div>
      </div>
    </div>

    <div style="background-color: #fff3cd; padding: 15px; margin-top: 25px; border-radius: 6px;">
      <strong>AI Doctor's Feedback:</strong>
      <div style="margin: 10px 0 0;">
				${marked(geminiReport)}
	  </div>
    </div>

    <p style="margin-top: 20px;">This summary can be shared with your healthcare provider for review.</p>
  </div>

  <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
    <p>Stay healthy,<br>Your Health App Team</p>
    <p>© ${new Date().getFullYear()} Health Tracker. All rights reserved.</p>
  </div>
</div>`


    return htmlText || null;
}