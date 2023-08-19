import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import ProductController from '../controllers/productController.js';
import { handleError } from '/errorHandler.js';

const productController = new ProductController();
const router = express.Router();
const swaggerDocument = YAML.load('./swaggerProduct.yaml');

router.get("/", (req, res) => {
  try {
    productController.getAllProducts(req, res);
  } catch (error) {
    console.error(`Error al obtener todos los productos: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.get("/:pid", (req, res) => {
  try {
    productController.getProductById(req, res);
  } catch (error) {
    console.error(`Error al obtener el producto por ID: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.post("/", (req, res) => {
  try {
    productController.addProduct(req, res);
  } catch (error) {
    console.error(`Error al agregar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.put("/:pid", (req, res) => {
  try {
    productController.updateProduct(req, res);
  } catch (error) {
    console.error(`Error al actualizar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.delete("/:pid", (req, res) => {
  try {
    productController.deleteProduct(req, res);
  } catch (error) {
    console.error(`Error al eliminar el producto: ${error}`);
    const errorCode = 'INTERNAL_SERVER_ERROR';
    handleError(errorCode, res);
  }
});

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

export default router;
