import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
  productos: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      cantidad: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
