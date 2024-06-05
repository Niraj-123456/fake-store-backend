require("dotenv").config();
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

import DBConnect from "./database/db";
import { Routes } from "./routes";

// connect to the database
DBConnect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", Routes);
app.use("/public", express.static(path.join(__dirname, "public")));

// app.post("/register", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = { name: username, password: hashedPassword };
//     users.push(user);
//     res.status(201).send("User added successfully");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// app.get("/posts", authenticate, (req, res) => {
//   res.json(posts.filter((post) => post.username === req.user.user.name));
// });

// function authenticate(req, res, next) {
//   const authToken = req.headers["authorization"];
//   const token = authToken && authToken.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

app
  .listen(process.env.PORT, () => {
    console.log(`running server in port ${process.env.PORT}`);
  })
  .on("error", (e) => console.log(e));
