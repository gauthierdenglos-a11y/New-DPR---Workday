import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: SMTP_USER && SMTP_PASSWORD ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
  });
}

export async function sendClotureNotification({
  to,
  projet,
  client,
  periodeLabel,
  ficheUrl,
}: {
  to: string;
  projet: string;
  client: string;
  periodeLabel: string;
  ficheUrl: string;
}): Promise<{ sent: boolean; reason?: string; previewUrl?: string }> {
  const transport = getTransport();
  if (!transport) {
    return { sent: false, reason: "SMTP non configuré (SMTP_HOST manquant)" };
  }

  const from = process.env.SMTP_FROM || "no-reply@fiche-flash-projet.local";
  const subject = `Clôture ${periodeLabel} — Fiche projet "${projet}" à mettre à jour`;
  const text = [
    `Bonjour,`,
    ``,
    `La clôture mensuelle vient d'avoir lieu pour le projet "${projet}" (${client}).`,
    `Merci de mettre à jour la fiche projet avant la prochaine clôture.`,
    ``,
    `Accéder à la fiche : ${ficheUrl}`,
  ].join("\n");
  const html = `
    <p>Bonjour,</p>
    <p>La clôture mensuelle vient d'avoir lieu pour le projet <strong>${projet}</strong> (${client}).</p>
    <p>Merci de mettre à jour la fiche projet avant la prochaine clôture.</p>
    <p><a href="${ficheUrl}">Accéder à la fiche</a></p>
  `;

  const info = await transport.sendMail({ from, to, subject, text, html });
  const previewUrl = nodemailer.getTestMessageUrl(info);
  return { sent: true, previewUrl: previewUrl || undefined };
}
