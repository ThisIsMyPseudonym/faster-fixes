const mailDomain = process.env.DOMAIN_NAME;

export const NO_REPLY_EMAIL =
  process.env.MAIL_FROM_EMAIL ?? `noreply@${mailDomain}`;
export const SENDER_EMAIL =
  process.env.MAIL_FROM_EMAIL ?? `contact@${mailDomain}`;
