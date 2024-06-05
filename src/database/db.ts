const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
const dbName = "fake-store";

const DBConnect = () => {
  mongoose.connect(url + dbName);
};

export default DBConnect;
