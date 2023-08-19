import Product from '../models/Product.js';

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error al obtener todos los productos');
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto por ID');
  }
};

const createProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error al crear un nuevo producto');
  }
};

const updateProduct = async (productId, productData) => {
  try {
    const product = await Product.findByIdAndUpdate(productId, productData, { new: true });
    return product;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndDelete(productId);
    return product;
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
