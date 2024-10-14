import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: Number,
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    images: { type: Array, required: true },
    category: {
      id: String,
      name: String,
      image: String,
      creationAt: String,
      updatedAt: String,
    },
  },
  { timestamps: true }
);

const ProductModal = mongoose.model("product", ProductSchema);

export default ProductModal;
