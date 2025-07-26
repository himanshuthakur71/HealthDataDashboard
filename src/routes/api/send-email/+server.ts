import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const { to, subject, text } = await request.json();

  try {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aiwritely.ai@gmail.com', // your Gmail email
        pass: 'ngxi lntd ulvh tzmf', // your App Password
      },
    });



    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"aiwritely" <aiwritely.ai@gmail.com>', // sender address
      to: to, // recipient email
      subject: subject, // subject line
      // text: text, // plain text body
      html: text, // HTML body content
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (err:any) {
    return new Response(JSON.stringify({ error: 'Failed to send email', details: err.message }), { status: 500 });
  }
}
