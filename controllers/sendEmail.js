import nodemailer from "nodemailer";
import fetch from "node-fetch";

export const sendEmail = async (req, res) => {
  try {
    // Получаем все поля напрямую из req.body
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const {
      firstName,
      lastName,
      email,
      level,
      comment,
      lesson: lessonNumber,
    } = req.body || {};
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Файл не прикреплён" });
    }

    // Настройка транспортера
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "university.curator@gmail.com",
        pass: "biayxiacjabdiaxw", // пароль приложения, всё верно
      },
    });

    // Формирование письма
    const mailOptions = {
      from: "university.curator@gmail.com",
      to: "university.curator@gmail.com",
      subject: `Задание от ${firstName} ${lastName} (${level} - урок ${lessonNumber})`,
      text: `Ученик: ${firstName} ${lastName}
      Email: ${email}
      Уровень: ${level}
      Урок: ${lessonNumber}

      Комментарий:
        ${comment}`,
      attachments: [
        {
          filename: file.originalname || "задание.sb3",
          content: file.buffer,
        },
      ],
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);
    console.log("Письмо отправлено");

    // Сохраняем прогресс
    try {
      const response = await fetch(
        "https://learningscratchbackend-production.up.railway.app/api/user/progress/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            level,
            lessonId: lessonNumber,
            comment,
            submittedFile: file.originalname,
          }),
        }
      );

      const resultData = await response.json();
      console.log("Результат сохранения прогресса:", resultData);
    } catch (err) {
      console.error("Ошибка при сохранении прогресса:", err);
      return res
        .status(500)
        .json({
          message: "Письмо отправлено, но не удалось сохранить прогресс",
        });
    }

    // Финальный ответ
    res.status(200).json({ message: "Письмо отправлено и прогресс сохранён" });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
    res.status(500).json({ message: "Ошибка при отправке письма" });
  }
};
