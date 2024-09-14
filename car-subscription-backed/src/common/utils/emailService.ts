import { Resend } from 'resend';
import { env } from './envConfig';

// Initialize the Resend instance
const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  error?: Error;
}

export const sendEmail = async ({ from, to, subject, html }: SendEmailParams): Promise<SendEmailResult> => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error from resend API:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err as Error };
  }
};

