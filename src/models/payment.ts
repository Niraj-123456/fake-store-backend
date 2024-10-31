import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    method: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    status: { type: String },
  },
  { timestamps: true }
);
const PaymentModal = mongoose.model("payment", paymentSchema);
export default PaymentModal;
