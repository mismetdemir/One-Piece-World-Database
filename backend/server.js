const express = require("express");
const path = require("path");

const characterRoutes = require("./routes/characterRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "./frontend")));
app.use("/api/characters", characterRoutes);
app.listen(PORT, () => {console.log(`Server is running on port: ${PORT}`)});