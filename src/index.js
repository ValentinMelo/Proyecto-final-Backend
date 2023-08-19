import express from 'express';
import winston from 'winston';
import { Console } from 'winston/lib/winston/transports.js';
import router from './routes/routes.js';
import handlebars from 'express-handlebars';
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

configurePassport(passport);

const app = express();
const port = 8080;

const developmentLogger = winston.createLogger({
  level: 'debug',
  transports: [new Console()],
});

app.use(addLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(
  session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/all-products', router);
app.use('/api', router);
app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', async (socket) => {
  req.logger.debug(`Usuario conectado: ${socket.id}`);

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
    req.logger.error(`Error al obtener los productos de la base de datos: ${error}`);
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

  res.send('Logger test completado.');
});

server.listen(port, () => {
  req.logger.info(`Servidor arriba en el puerto ${port}`);
});

connectToDatabase();
