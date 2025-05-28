import express from "express";
import multer from "multer";
import { insertUser } from "../controllers/insertUser.js";
import { loginUser } from "../controllers/loginUser.js";
import User from "../models/User.js";
import { sendEmail } from "../controllers/sendEmail.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer();

router.post("/register", upload.none(), insertUser);
router.post("/login", upload.none(), loginUser);

router.post("/progress/submit", async (req, res) => {
  const { email, level, lessonId, comment, submittedFile } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    if (!user.progress[level]) user.progress[level] = {};
    user.progress[level][lessonId] = {
      status: "pending",
      comment,
      submittedFile,
    };

    await user.save();
    res.json({ message: "Прогресс обновлён", progress: user.progress });
  } catch (err) {
    console.error("Ошибка сохранения прогресса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/progress/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    res.json({ progress: user.progress });
  } catch (err) {
    console.error("Ошибка получения прогресса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
