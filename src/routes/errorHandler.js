class CustomError extends Error {
  constructor(name, message, cause) {
    super(message);
    this.name = name;
    this.cause = cause;
  }

  static generateCustomError({ name, message, cause }) {
    return new CustomError(name, message, cause);
  }
}

const errorDictionary = {
  PRODUCT_NOT_FOUND: {
    code: 404,
    message: 'El producto no existe.'
  },
  CART_NOT_FOUND: {
    code: 404,
    message: 'El carrito no existe.'
  },
};

export const handleError = (errorCode, res) => {
  const error = errorDictionary[errorCode];
  if (!error) {
    return res.status(500).json({ error: 'Error desconocido.' });
  }

  const { code, message } = error;
  throw CustomError.generateCustomError({ name: errorCode, message, cause: null });
};
