// routes.js
import express from "express";
import {
  addItemToCategory,
  getAllItems,
  deleteItemByDishId,
  updateItemInCategory,
} from "../controllers/itemListings.controller.js";
import upload from "../middlewares/multerImageUpload.js";

const router = express.Router();

// Route to add a new dish under a specific category with image upload
router.post("/add-item", upload.single("dishImage"), addItemToCategory);
router.get("/", getAllItems);
router.delete("/items/:dishId", deleteItemByDishId);
router.patch(
  "/items/:itemId",
  upload.single("dishImage"),
  updateItemInCategory
);

export default router;
