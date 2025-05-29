import express from "express";
import multer from "multer";
import { insertUser } from "../controllers/insertUser.js";
import { loginUser } from "../controllers/loginUser.js";
import { sendEmail } from "../controllers/sendEmail.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // до 10 МБ
  },
});

router.post("/register", upload.none(), insertUser);
router.post("/login", upload.none(), loginUser);
router.post("/email", upload.single("file"), sendEmail);

export default router;
