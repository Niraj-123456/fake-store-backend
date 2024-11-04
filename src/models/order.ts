import mongoose from "mongoose";
import ShippingModel from "./shipping";

type DeliveryMethod = "STANDARD" | "EXPRESS";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cartId: { type: String, required: true },
    products: [
      {
        productId: String,
        quantity: { type: Number, default: 1 },
        name: String,
        price: Number,
        image: String,
      },
    ],
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    deliveryMethod: {
      type: String,
      enum: ["STANDARD", "EXPRESS"],
      default: "STANDARD",
    },
    shippingAddress: { type: ShippingModel.schema, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", OrderSchema);

export default OrderModel;
