import nodemailer from "nodemailer";

export const sendMail = async ({ from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info; // 👈 return this if you want logging details
};
