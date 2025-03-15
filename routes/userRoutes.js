import express from "express";
import {
  addUser,
  fetchUsers,
  fetchUserById,
  fetchUserByEmail,
  modifyUser,
  removeUser,
  findUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Create and get all users
router.post("/users", addUser);
router.get("/users", fetchUsers);

// Search users - moved before the ID route
router.get("/users/search", findUsers);

// Get user by ID
router.get("/users/:id", fetchUserById);

// Get user by email
router.get("/users/email/:email", fetchUserByEmail);

// Update and delete user
router.put("/users/:id", modifyUser);
router.delete("/users/:id", removeUser);

export default router;