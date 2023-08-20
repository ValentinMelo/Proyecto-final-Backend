import Product from '../models/Product.js';
import {
  getAllProducts as repositoryGetAllProducts,
  getProductById as repositoryGetProductById,
  addProduct as repositoryAddProduct,
  updateProduct as repositoryUpdateProduct,
  deleteProduct as repositoryDeleteProduct,
} from '../repositories/productRepository.js';

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await repositoryGetAllProducts();
    res.render("index", { products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await repositoryGetProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Agregar un nuevo producto
const addProduct = async (req, res) => {
  const { title, description, price, code, stock, category, thumbnails, status } = req.body;
  try {
    const newProduct = await repositoryAddProduct({
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
      status
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, code, stock, category, thumbnails, status } = req.body;
  try {
    const updatedProduct = await repositoryUpdateProduct(pid, {
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
      status
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await repositoryDeleteProduct(pid);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
