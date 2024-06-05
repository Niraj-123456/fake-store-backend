import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    id: String,
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const CategoryModal = mongoose.model("category", CategorySchema);

export default CategoryModal;
