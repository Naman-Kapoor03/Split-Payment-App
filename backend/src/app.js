require("dns").setDefaultResultOrder("ipv4first");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const groupRoutes = require("./routes/group.routes");
const expenseRoutes = require("./routes/expense.routes");
const paymentRoutes = require("./routes/payment.routes");

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});