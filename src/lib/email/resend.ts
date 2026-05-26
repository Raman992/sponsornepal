import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SponsorNepal <noreply@sponsornepal.com>";
