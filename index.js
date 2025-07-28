import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { swaggerUi, specs } from "./config/swagger.js";

// Load environment variables
dotenv.config();

const app = express();

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
const CUSTOM_JS = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
];

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://moneywise-api.vercel.app" // Replace with your actual frontend domain (note: .app not .com for Vercel)
        : ["http://localhost:5000", "http://localhost:3000", "http://localhost:4200"], // Add your local development ports
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger documentation route
app.use(
  "/api-docs",
  swaggerUi.serve,
  //swaggerUi.setup(specs, { customCss: CSS_URL, customJs: CUSTOM_JS })
);

// API Routes with /api prefix for better organization
app.use("/api/user", userRoutes);
app.use("/api/txn", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/member", memberRoutes);

// Backward compatibility routes (without /api prefix)
app.use("/user", userRoutes);
app.use("/txn", transactionRoutes);
app.use("/budget", budgetRoutes);
app.use("/member", memberRoutes);

// Root route
app.get("/", (req, res) => {
  const baseUrl = req.get("host").includes("localhost")
    ? `${req.protocol}://${req.get("host")}`
    : `https://${req.get("host")}`;

  res.status(200).json({
    message: "MoneyWise API is running successfully!",
    version: "1.0.0",
    documentationLink: `${baseUrl}/api-docs`,
    endpoints: {
      users: `${baseUrl}/api/user`,
      transactions: `${baseUrl}/api/txn`,
      budgets: `${baseUrl}/api/budget`,
      members: `${baseUrl}/api/member`,
    },
    legacyEndpoints: {
      users: `${baseUrl}/user`,
      transactions: `${baseUrl}/txn`,
      budgets: `${baseUrl}/budget`,
      members: `${baseUrl}/member`,
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API status endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API endpoints are working",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      "/api/user",
      "/api/txn",
      "/api/budget",
      "/api/member",
      "/api-docs",
    ],
  });
});

// For local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `📚 API documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}

// Export the app for Vercel
export default app;
