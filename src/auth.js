// const express = require("express");
// const jwt = require("jsonwebtoken");

// const app = express();

// app.use(express.json());

// app.post("/login", (req, res) => {
//   const username = req.body.username;

//   const user = {
//     name: username,
//   };

//   const token = generateAccessToken(user);
//   const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.json({ accessToken: token, refreshToken: refreshToken });
// });

// function generateAccessToken(user) {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
// }
