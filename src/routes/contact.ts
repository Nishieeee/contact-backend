import { Router, Request, Response } from "express";
import transporter from "../config/mailer";
import { contactLimiter } from "../middleware/rateLimiter";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();
const router = Router();


const validProjects = process.env.VALID_PROJECTS
  ? process.env.VALID_PROJECTS.split(",").map(p => p.trim())
  : [];

console.log("Valid projects loaded:", validProjects);
router.post("/", contactLimiter, async (req: Request, res: Response) => {
  const { projectId, name, email, message } = req.body;

  if (!projectId || !validProjects.includes(projectId)) {
    logger.warn(`Invalid projectId attempted: ${projectId}`);
    return res.status(403).json({ error: "Invalid projectId" });
  }

  if (!name || !email || !message) {
    logger.warn(`Missing fields in request for projectId=${projectId}`);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `[${projectId}] Message from ${name}`,
      text: message,
    });

    logger.info(`Message sent from projectId=${projectId}, email=${email}`);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    logger.error(`Email error for projectId=${projectId}: ${(err as Error).message}`);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
