import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 5000;

const allowedProjects = (process.env.ALLOWED_PROJECTS || "").split(",");

app.post("/contact", async (req, res) => {
  const { projectId, name, email, message, to } = req.body;

  // Basic validation
  if (!projectId || !allowedProjects.includes(projectId)) {
    return res.status(403).json({ error: "Invalid project ID" });
  }

  if (!to || !/\S+@\S+\.\S+/.test(to)) {
    return res.status(400).json({ error: "Invalid recipient email" });
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid sender email" });
  }

  if (!name || !message) {
    return res.status(400).json({ error: "Missing name or message" });
  }

  try {
    console.log("Resend API key:", process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: `📨 Message from ${name} (${projectId})`,
      html: `
        <p><strong>Project:</strong> ${projectId}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log(result);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
