const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const templatePath = path.resolve(process.cwd(), "template", "resetTemplate.html");
const template = fs.readFileSync(templatePath, "utf8");

export const sendResetEmail = async (info, resetLink) => {
  const filledTemplate = template
    .replace("{{name}}", info.name)
    .replace(/{{account_name}}/g, "BudgetPilot")
    .replace(/{{action_url}}/g, resetLink)
    .replace("{{support_url}}", "https://utitbest.netlify.app/#contact");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: info.email,
    subject: "Reset your BudgetPilot password",
    html: filledTemplate,
  });
};