import express from "express";
import multer from "multer";
import { insertUser } from "../controllers/insertUser.js";
import { loginUser } from "../controllers/loginUser.js";
import User from "../models/User.js";

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
  // try {
  //   const user = await User.findOne({ email: req.params.email });
  //   if (!user)
  //     return res.status(404).json({ message: "Пользователь не найден" });
  //   res.json({ progress: user.progress });
  // } catch (err) {
  //   console.error("Ошибка получения прогресса:", err);
  //   res.status(500).json({ message: "Ошибка сервера" });
  // }
  console.log("Ищу прогресс по email:", req.params.email);
  try {
    let user = await User.findOne({ email: req.params.email });

    // Если пользователь не найден — создаём его
    if (!user) {
      user = new User({
        email: req.params.email,
        firstName: "Без имени",
        lastName: "Без фамилии",
        password: "temporary", // если нужно, можно хешировать или не создавать вовсе
        progress: {},
      });
      await user.save();
    }

    // Если у пользователя нет progress — инициализируем
    if (!user.progress) {
      user.progress = {};
      await user.save();
    }

    res.json({ progress: user.progress });
  } catch (err) {
    console.error("Ошибка получения прогресса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
