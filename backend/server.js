require("dotenv").config();

const express = require("express");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.listen(PORT, () => {console.log(`Server is running on port: ${PORT}`)});