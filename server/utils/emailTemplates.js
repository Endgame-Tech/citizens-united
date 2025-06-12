export function createConfirmationEmailTemplate(name, link) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hi ${name || ''},</h2>
      <p>Thank you for registering on <strong>Citizens United</strong>!</p>
      <p>Please confirm your email by clicking the button below:</p>
      <a href="${link}" style="padding: 10px 20px; background: #0B6739; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
        Confirm Email
      </a>
      <p style="color: #6C6B8F;">If you did not register, you can ignore this email.</p>
      <br/>
      <p>— The Citizens United Team</p>
    </div>
  `;
}

export function createResetPasswordEmailTemplate(name, link) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Hi ${name || ''},</h2>
      <p>You requested to reset your Citizens United account password.</p>
      <p>Click the button below to create a new password:</p>
      <a href="${link}" style="padding: 10px 20px; background: #F9DD16; color: black; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn't request this, you can ignore this email.</p>
      <br/>
      <p>— Citizens United Team</p>
    </div>
  `;
}

