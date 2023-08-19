import Cart from '../models/Cart.js';

// Crear un nuevo carrito
const crearCarrito = async (productos) => {
  try {
    const nuevoCarrito = new Cart({ productos });
    await nuevoCarrito.save();
    return nuevoCarrito;
  } catch (error) {
    throw new Error('Error al crear un nuevo carrito');
  }
};

// Obtener carrito por ID
const obtenerCarritoPorId = async (idCarrito) => {
  try {
    const carrito = await Cart.findById(idCarrito).populate('productos.producto');
    return carrito;
  } catch (error) {
    throw new Error('Error al obtener el carrito por ID');
  }
};

// Agregar producto al carrito
const agregarProductoAlCarrito = async (idCarrito, idProducto, cantidad) => {
  try {
    const carrito = await Cart.findById(idCarrito);
    carrito.productos.push({ producto: idProducto, cantidad });
    await carrito.save();
    return carrito;
  } catch (error) {
    throw new Error('Error al agregar el producto al carrito');
  }
};

// Eliminar producto del carrito
const eliminarProductoDelCarrito = async (idCarrito, idProducto) => {
  try {
    const carrito = await Cart.findById(idCarrito);
    carrito.productos = carrito.productos.filter((producto) => producto.producto.toString() !== idProducto);
    await carrito.save();
    return carrito;
  } catch (error) {
    throw new Error('Error al eliminar el producto del carrito');
  }
};

// Actualizar cantidad del producto en el carrito
const actualizarCantidadProductoEnCarrito = async (idCarrito, idProducto, cantidad) => {
  try {
    const carrito = await Cart.findById(idCarrito);
    const producto = carrito.productos.find((p) => p.producto.toString() === idProducto);
    if (producto) {
      producto.cantidad = cantidad;
      await carrito.save();
    }
    return carrito;
  } catch (error) {
    throw new Error('Error al actualizar la cantidad del producto en el carrito');
  }
};

// Vaciar carrito
const vaciarCarrito = async (idCarrito) => {
  try {
    const carrito = await Cart.findById(idCarrito);
    carrito.productos = [];
    await carrito.save();
    return carrito;
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
};

export {
  crearCarrito,
  obtenerCarritoPorId,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  actualizarCantidadProductoEnCarrito,
  vaciarCarrito,
};
