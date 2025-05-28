import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  try {
    // Получаем все поля напрямую из req.body
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
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

    // Отправка письма
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Письмо отправлено успешно" });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
    res.status(500).json({ message: "Ошибка при отправке письма" });
  }
};
