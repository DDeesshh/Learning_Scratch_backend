import express from "express";
import multer from "multer";
import { sendEmail } from "../controllers/sendEmail.js";

const router = express.Router();
// Настраиваем multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Оборачиваем маршрут в multer
router.post("/", upload.single("file"), sendEmail);

export default router;
