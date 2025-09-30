import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRouter from "./routes/contact";

dotenv.config();
console.log("ENV VALID_PROJECTS raw:", process.env.VALID_PROJECTS);

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/contact", contactRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
