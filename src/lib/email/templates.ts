const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .header { text-align: center; margin-bottom: 24px; }
  .logo { font-size: 24px; font-weight: bold; color: #ef6c4a; }
  .heading { font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 16px; }
  .text { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
  .button { display: inline-block; background: #ef6c4a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; }
  .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
`;

function wrapTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">SponsorNepal</div>
      </div>
      <h1 class="heading">${title}</h1>
      ${content}
    </div>
    <div class="footer">
      <p>SponsorNepal — Connecting Nepali Creators with Brands</p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmailTemplate(name: string): string {
  return wrapTemplate("Welcome to SponsorNepal!", `
    <p class="text">Hi ${name},</p>
    <p class="text">Welcome to SponsorNepal! We're excited to have you join our community of creators and brands.</p>
    <p class="text">Here's what you can do next:</p>
    <ul style="font-size: 14px; color: #6b7280; line-height: 1.8; padding-left: 20px;">
      <li>Complete your profile</li>
      <li>Browse available campaigns</li>
      <li>Connect with creators or brands</li>
    </ul>
    <hr class="divider" />
    <p class="text" style="font-size: 12px;">If you didn't create this account, please ignore this email.</p>
  `);
}

export function applicationUpdateTemplate(creatorName: string, campaignTitle: string, status: string): string {
  const statusText = status === "accepted" ? "accepted" : status === "rejected" ? "not selected for" : "updated for";
  return wrapTemplate("Application Update", `
    <p class="text">Hi ${creatorName},</p>
    <p class="text">Your application for <strong>${campaignTitle}</strong> has been ${statusText}.</p>
    ${status === "accepted" ? '<p class="text">The brand will reach out to you soon with next steps.</p>' : ""}
    <p class="text">Check your dashboard for more details.</p>
  `);
}

export function dealUpdateTemplate(recipientName: string, campaignTitle: string, status: string): string {
  const messages: Record<string, string> = {
    active: "A new deal has been activated for your campaign collaboration.",
    completed: "Your deal has been marked as completed. Payment processing will begin shortly.",
    cancelled: "The deal for your campaign collaboration has been cancelled.",
  };

  return wrapTemplate("Deal Update", `
    <p class="text">Hi ${recipientName},</p>
    <p class="text">${messages[status] || "There's an update on your deal."}</p>
    <p class="text"><strong>Campaign:</strong> ${campaignTitle}</p>
    <p class="text"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
  `);
}

export function campaignNotificationTemplate(creatorName: string, campaignTitle: string, brandName: string): string {
  return wrapTemplate("New Campaign Match", `
    <p class="text">Hi ${creatorName},</p>
    <p class="text">A new campaign that matches your profile has been posted:</p>
    <p class="text"><strong>${campaignTitle}</strong> by ${brandName}</p>
    <p class="text">Check it out on SponsorNepal and apply if you're interested!</p>
  `);
}

export function passwordResetTemplate(name: string, resetUrl: string): string {
  return wrapTemplate("Reset Your Password", `
    <p class="text">Hi ${name},</p>
    <p class="text">We received a request to reset your password. Click the button below to set a new password:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p class="text">This link will expire in 1 hour.</p>
    <hr class="divider" />
    <p class="text" style="font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
  `);
}
