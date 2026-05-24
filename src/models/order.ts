import mongoose, { Document, Schema } from "mongoose";
import ShippingModel from "./shipping";

export type DeliveryMethod = "STANDARD" | "EXPRESS";

export interface IOrder extends Document {
  userId: string;
  cartId: string;
  products: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  finalAmount: number;
  currency: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: any;
  paymentMethod?: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    cartId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    deliveryMethod: {
      type: String,
      enum: ["STANDARD", "EXPRESS"],
      default: "STANDARD",
    },
    shippingAddress: { type: ShippingModel.schema, required: true },
    paymentMethod: { type: Object },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("order", OrderSchema);

export default OrderModel;
