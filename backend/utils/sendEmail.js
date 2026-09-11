import transporter from "../config/email.js";

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Zestora" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
