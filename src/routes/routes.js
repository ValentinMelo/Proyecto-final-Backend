import express from 'express';
import ProductRoutes from './productRoutes.js';
import CartRoutes from './cartRoutes.js';
import TicketRoutes from './ticketRoutes.js';
import { faker } from '@faker-js/faker';
import YAML from 'yamljs';
import setupSwagger from '../swagger/swagger.js';

const router = express.Router();
const swaggerDocument = YAML.load('./swagger.yaml');

router.use(express.json());
router.use('/products', ProductRoutes);
router.use('/carts', CartRoutes);
router.use('/tickets', TicketRoutes);

// Endpoint para el Mocking de productos
router.get('/mockingproducts', (req, res) => {
  const mockedProducts = [];
  for (let i = 0; i < 100; i++) {
    const product = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      code: faker.string.alphanumeric(),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: faker.string.alphanumeric(),
      category: faker.commerce.department(),
      thumbnail: faker.image.url()
    };
    mockedProducts.push(product);
  }
  res.json(mockedProducts);
});

router.get('/swagger.yaml', (req, res) => {
  res.header('Content-Type', 'text/yaml');
  res.send(swaggerDocument);
});

export default router;

setupSwagger(router);
