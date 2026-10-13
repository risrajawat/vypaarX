import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && !resendApiKey.startsWith("re_your") ? new Resend(resendApiKey) : null;
const fromEmail = process.env.FROM_EMAIL || "notifications@vyparx.com";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!resend) {
    console.log(`\n📧 [EMAIL SIMULATION] (Resend API key not configured)`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Preview: ${text || html.slice(0, 150)}...`);
    console.log(`--------------------------------------------------\n`);
    return { success: true, simulated: true };
  }

  try {
    const result = await resend.emails.send({
      from: `VyparX <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || undefined,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
