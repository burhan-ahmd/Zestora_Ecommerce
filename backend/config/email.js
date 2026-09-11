import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// checking that did we get the email and pass from .env?
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);


// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verification
transporter.verify((error, success) => {
  if (error) {
    console.error("EMAIL VERIFY ERROR:", error);
  } else {
    console.log("✅ Gmail SMTP authentication successful!");
  }
});

export default transporter;
