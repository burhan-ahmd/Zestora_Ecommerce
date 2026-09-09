import express from "express";
import {
  createCategory,
  getCategories,
  getPublicCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/public", getPublicCategories);

router.post("/", authMiddleware, roleMiddleware("admin"), createCategory);
router.get("/", authMiddleware, roleMiddleware("admin"), getCategories);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getCategoryById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCategory);

export default router;
