import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: String,
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModal = mongoose.model("user", UserSchema);

export default UserModal;
