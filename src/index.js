require("dotenv").config({ path: "./.env" });
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 4000;
const express = require("express");

const usersRoutes = require("./routes/users");
const middlewareLogsRequest = require("./middleware/logs");

const app = express();

app.use(middlewareLogsRequest);
app.use(express.json());

app.use("/users", usersRoutes);

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`sever berhasil di running di port ${PORT}`);
});
