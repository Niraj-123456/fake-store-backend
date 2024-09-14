import mongoose from "mongoose";
import UserModal from "./user";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModal,
      required: true,
    },
    products: [
      {
        productId: String,
        quantity: Number,
        name: String,
        price: Number,
        image: String,
      },
    ],
    totalPrice: Number,
    shippingFee: Number,
    finalPrice: Number,
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CartModal = mongoose.model("cart", CartSchema);

export default CartModal;
