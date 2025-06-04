import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import labelRoutes from "./routes/labelRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { swaggerUi, specs } from "./config/swagger.js";

dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//user
app.use("/api", userRoutes);
// transactions
app.use("/txn", transactionRoutes);
//budgets
app.use("/budget", budgetRoutes);
//labels
app.use("/label", labelRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "API is running...",
    documentationLink: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
