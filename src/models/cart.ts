import mongoose, { Document, Schema } from "mongoose";

export interface ICartProduct {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  products: ICartProduct[];
  totalPrice: number;
  shippingFee: number;
  finalPrice: number;
  active: boolean;
  modifiedOn: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
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

const CartModal = mongoose.model<ICart>("cart", CartSchema);

export default CartModal;
