import express from 'express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantityInCart,
  emptyCart,
  purchaseCart,
} from '../controllers/cartController.js';
import { handleError } from './errorHandler.js';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const swaggerDocument = YAML.load(__dirname + '/../swagger/swaggerCart.yaml');

router.use(express.json());

router.post("/", (req, res) => {
  try {
    createCart(req, res);
  } catch (error) {
    console.error(`Error al crear el carrito: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.get("/:cartId", (req, res) => {
  try {
    getCartById(req, res);
  } catch (error) {
    console.error(`Error al obtener el carrito por ID: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.post("/products/:cartId/product/:productId", (req, res) => {
  try {
    addProductToCart(req, res);
  } catch (error) {
    console.error(`Error al agregar el producto al carrito: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.delete("/products/:cartId/product/:productId", (req, res) => {
  try {
    removeProductFromCart(req, res);
  } catch (error) {
    console.error(`Error al eliminar el producto del carrito: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.put("/products/:cartId/product/:productId", (req, res) => {
  try {
    updateProductQuantityInCart(req, res);
  } catch (error) {
    console.error(`Error al actualizar la cantidad del producto en el carrito: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.delete("/:cartId", (req, res) => {
  try {
    emptyCart(req, res);
  } catch (error) {
    console.error(`Error al vaciar el carrito: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.post("/:cartId/purchase", (req, res) => {
  try {
    purchaseCart(req, res);
  } catch (error) {
    console.error(`Error al realizar la compra: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
