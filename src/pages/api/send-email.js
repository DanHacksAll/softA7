export const prerender = false; // importante para permitir POST

import nodemailer from "nodemailer";

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"SoftA7 Landing" <${import.meta.env.EMAIL_USER}>`,
      to: import.meta.env.EMAIL_USER,
      subject: "Nuevo lead desde SoftA7",
      html: `
        <h2>Nuevo lead</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br>${message}</p>
      `
    });

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response("Error enviando email", { status: 500 });
  }
}
