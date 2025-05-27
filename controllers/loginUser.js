import User from '../models/User.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Успешный вход
    return res.status(200).json({
      message: 'Вы успешно вошли!',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};
