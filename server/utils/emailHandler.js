import { mailtrapClient, sender } from '../config/mailtrap.js';
import {
  createConfirmationEmailTemplate,
  createResetPasswordEmailTemplate,
} from './emailTemplates.js';


// Send Confirmation Email
export const sendConfirmationEmail = async (name, email, link, type) => {
  const subject = type === "reset" ? "Reset Your Password" : "Confirm Your Email Address";
  const html =
    type === "reset"
      ? createResetPasswordEmailTemplate(name, link)
      : createConfirmationEmailTemplate(name, link);
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject,
      html,
      category: type === "reset" ? "password_reset" : "email_confirmation",
      headers: {
        "X-Priority": "1",
        "Importance": "high",
        "X-MSMail-Priority": "High",
        // "List-Unsubscribe": "<mailto:noreply@thepeoplesopposition.org>",
      }
    });
    console.log("Confirmation email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

export const sendSupporterInvite = async (name, email, causeName, joinLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Hello ${name || ''},</h2>
      <p>You've been invited to join the <strong>${causeName}</strong> cause on Citizens United.</p>
      <p>Click below to accept the invitation:</p>
      <a href="${joinLink}" style="padding: 10px 20px; background: #006837; color: white; text-decoration: none; border-radius: 5px;">
        Join Cause
      </a>
      <p>Thank you!</p>
    </div>
  `;

  const recipient = [{ email }];

  return await mailtrapClient.send({
    from: sender,
    to: recipient,
    subject: `You're invited to join ${causeName}`,
    html,
    category: 'cause_invite',
  });
};

