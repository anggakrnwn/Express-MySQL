require('dotenv').config()
const PORT = process.env.PORT || 4000;
const express = require("express");

const usersRoutes = require("./routes/users");
const middlewareLogsRequest = require("./middleware/logs");

const app = express();

app.use(middlewareLogsRequest);
app.use(express.json());

app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`sever berhasil di running di port ${PORT}`);
});
