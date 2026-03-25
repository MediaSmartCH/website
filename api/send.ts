import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import contactMailer from './_shared/contact-mailer.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const validation = validateContactPayload(req.body ?? {});
  if (!validation.ok) {
    return res.status(validation.error.status).json({ success: false, message: validation.error.message });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, message: contactApiErrors.serverError });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await sendContactEmails(resend, validation.data);

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ success: false, message: contactApiErrors.sendFailed });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ success: false, message: contactApiErrors.serverError });
  }
}
