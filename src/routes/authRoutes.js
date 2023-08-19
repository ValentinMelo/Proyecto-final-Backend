import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    req.login(user, (err) => {
      if (err) {
        console.error(`Error al iniciar sesión: ${err}`);
        return res.status(500).send('Error al iniciar sesión');
      }
      res.redirect('/');
    });
  } catch (error) {
    req.flash('error', 'Error al registrar usuario');
    res.redirect('/auth/register');
  }
});

router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Nueva ruta para obtener todos los usuarios con datos principales
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username email role'); 
    res.json(users);
  } catch (error) {
    console.error(`Error al obtener usuarios: ${error}`);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Nueva ruta para eliminar usuarios inactivos y enviar correos electrónicos
router.delete('/', async (req, res) => {
  try {
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // Últimos 30 minutos
    const inactiveUsers = await User.find({ lastConnection: { $lt: cutoffTime } });

    for (const user of inactiveUsers) {
      const transporter = nodemailer.createTransport({
        service: 'servicio_de_correo', 
        auth: {
          user: 'correo_electronico',
          pass: 'contraseña',
        },
      });

      const mailOptions = {
        from: 'correo_electronico',
        to: user.email,
        subject: 'Eliminación de cuenta por inactividad',
        text: 'Tu cuenta ha sido eliminada debido a inactividad.',
      };

      await transporter.sendMail(mailOptions);

      await user.remove();
    }

    res.json({ message: 'Usuarios inactivos eliminados y notificados' });
  } catch (error) {
    console.error(`Error al eliminar usuarios inactivos: ${error}`);
    res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
  }
});

export default router;
