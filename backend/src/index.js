// const express = require("express");
import express from "express";
import "dotenv/config.js";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", async (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
