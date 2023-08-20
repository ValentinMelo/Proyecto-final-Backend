import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { handleError } from './errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const swaggerDocument = YAML.load(__dirname + '/../swagger/swaggerProduct.yaml');

router.get("/", (req, res) => {
  try {
    getAllProducts(req, res);
  } catch (error) {
    console.error(`Error al obtener todos los productos: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.get("/:pid", (req, res) => {
  try {
    getProductById(req, res);
  } catch (error) {
    console.error(`Error al obtener el producto por ID: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.post("/", (req, res) => {
  try {
    addProduct(req, res);
  } catch (error) {
    console.error(`Error al agregar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.put("/:pid", (req, res) => {
  try {
    updateProduct(req, res);
  } catch (error) {
    console.error(`Error al actualizar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.delete("/:pid", (req, res) => {
  try {
    deleteProduct(req, res);
  } catch (error) {
    console.error(`Error al eliminar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

export default router;
