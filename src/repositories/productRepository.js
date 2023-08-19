import Product from '../models/Product.js';

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos desde la base de datos.');
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto desde la base de datos.');
  }
};

const addProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error al agregar el producto a la base de datos.');
  }
};

const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error('Error al actualizar el producto en la base de datos.');
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw new Error('Error al eliminar el producto de la base de datos.');
  }
};

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
