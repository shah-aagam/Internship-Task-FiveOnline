import express from "express";
import { register, login, updateUser , getUserById , getAllUsers , deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

export default router;
