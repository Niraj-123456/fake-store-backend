import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  city: { type: String, required: true },
  streetName: { type: String },
  phoneNumber: { type: String, required: true },
  zipCode: { type: String },
  country: { type: String, required: true },
});

const ShippingModel = mongoose.model("shipping", ShippingSchema);

export default ShippingModel;
