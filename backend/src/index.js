// const express = require("express");
import express from "express";
import "dotenv/config.js";

const app = express();
const PORT = process.env.PORT || 3000;
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

app.listen(3000, () => {
  console.log("Server is running on port 123");
});
