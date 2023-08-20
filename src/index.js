import express from 'express';
import winston from 'winston';
import { create as handlebarsCreate } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import connectToDatabase from './database.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import passport from 'passport';
import configurePassport from './passport.js';
import { addLogger } from './utils/logger.js';
import stripePackage from 'stripe';
import router from './routes/routes.js';

configurePassport(passport);

const app = express();
const port = 8080;

const stripe = stripePackage('sk_test_51Ngx06DhlPgMN7c9NxcNmvAqNHar6w9LuKeXw9dGhwy7sXRr3zjBwI0WEWEyHCQVoGTRBGNMis9DgTRj5enWV2RA00Pd9R1n5M');

// Configuración del motor de vistas
const hbsEngine = handlebarsCreate({ defaultLayout: 'main' });
app.engine('handlebars', hbsEngine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(addLogger);

app.use('/all-products', router);
app.use('/api', router);
app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  try {
    const Product = mongoose.model('Product', {
      title: String,
      description: String,
      code: String,
      price: Number,
      status: true,
      stock: Number,
      category: String,
      thumbnail: String,
    });

    const products = await Product.find();
    socket.emit('data', JSON.stringify(products));
  } catch (error) {
    console.error(`Error al obtener los productos de la base de datos: ${error}`);
  }
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

app.get('/loggerTest', (req, res) => {
  req.logger.debug('debug log.');
  req.logger.http('http log.');
  req.logger.info('info log.');
  req.logger.warning('warning log.');
  req.logger.error('error log.');
  req.logger.fatal('fatal log.');

  res.send('Logger test completed.');
});

// Ruta para pagos
app.post('/api/pay', async (req, res) => {
  const { amount, currency, source } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      payment_method: source,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({ message: 'Payment successful' });
    } else {
      res.status(500).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
});

server.listen(port, () => {
  console.log(`Servidor arriba en el puerto ${port}`);
});

connectToDatabase();
