import Cart from '../models/Cart.js';
import {
  crearCarrito,
  obtenerCarritoPorId,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  actualizarCantidadProductoEnCarrito,
  vaciarCarrito,
} from '../repositories/cartRepository.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';

// Crear un nuevo carrito
const createCart = async (req, res) => {
  const { productos } = req.body;
  try {
    const newCart = await crearCarrito(productos);
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Obtener un carrito por ID
const getCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await obtenerCarritoPorId(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Agregar un producto al carrito
const addProductToCart = async (req, res) => {
  const { cartId, productId, quantity } = req.params;
  try {
    const cart = await agregarProductoAlCarrito(cartId, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const cart = await eliminarProductoDelCarrito(cartId, productId);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantityInCart = async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await actualizarCantidadProductoEnCarrito(cartId, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Vaciar el carrito
const emptyCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await vaciarCarrito(cartId);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Finalizar la compra del carrito
const purchaseCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productsToPurchase = cart.products;
    const productsUnavailable = [];

    for (const product of productsToPurchase) {
      const { productId, quantity } = product;
      const dbProduct = product.productId;

      if (!dbProduct || dbProduct.stock < quantity) {
        productsUnavailable.push(productId);
      } else {
        dbProduct.stock -= quantity;
        await dbProduct.save();
      }
    }

    const purchasedProducts = productsToPurchase.filter(
      (product) => !productsUnavailable.includes(product.productId.toString())
    );

    const ticketData = {
      code: generateUniqueCode(),
      amount: calculateTotalAmount(purchasedProducts),
      purchaser: cart.purchaser,
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    cart.products = productsUnavailable.map((productId) => ({
      productId,
      quantity: cart.products.find((p) => p.productId.toString() === productId).quantity,
    }));

    await cart.save();

    res.json({ ticket, productsUnavailable });
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar la compra' });
  }
};


export {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantityInCart,
  emptyCart,
  purchaseCart,
};
