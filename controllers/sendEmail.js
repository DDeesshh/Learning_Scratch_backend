import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const sendEmail = (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Ошибка при парсинге формы:", err);
      return res.status(400).json({ message: "Ошибка при обработке формы" });
    }

    const { firstName, lastName, email, lesson, comment } = fields;
    const file = files.file;

    // Настройка транспортера
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "university.curator@gmail.com",
        pass: "biayxiacjabdiaxw", // пароль приложения, не обычный
      },
    });

    const mailOptions = {
      from: "university.curator@gmail.com",
      to: "university.curator@gmail.com",
      subject: `Задание от ${firstName} ${lastName} (урок ${lesson})`,
      text: `Комментарий: ${comment}\nEmail ученика: ${email}`,
      attachments: [
        {
          filename: file.originalFilename,
          path: file.filepath,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Письмо отправлено успешно" });
    } catch (error) {
      console.error("Ошибка при отправке письма:", error);
      res.status(500).json({ message: "Ошибка при отправке письма" });
    }
  });
};
