import User from '../models/User.js';

export const insertUser = async (req, res) => {
    try {
        const data = req.body;

        const newUser = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        });

        await newUser.save();

        return res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
    }

    catch (err) {
        console.error('Ошибка при сохранении пользователя:', err);
        return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};