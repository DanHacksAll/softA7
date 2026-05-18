export const prerender = false;

import nodemailer from "nodemailer";

export async function POST({ request }) {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  const user = import.meta.env.EMAIL_USER;
  const pass = import.meta.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("Missing email credentials: EMAIL_USER or EMAIL_PASS is not set.");
    return new Response(JSON.stringify({ success: false, error: "Faltan EMAIL_USER o EMAIL_PASS en el servidor." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass
      }
    });

    await transporter.sendMail({
      from: `"SoftA7 Landing" <${user}>`,
      to: user,
      subject: "Nuevo lead desde SoftA7",
      html: `
        <h2>Nuevo lead</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br>${message}</p>
      `
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("send-email error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
