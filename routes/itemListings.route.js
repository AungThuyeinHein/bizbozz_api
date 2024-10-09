// routes.js
import express from "express";
import { addItemToCategory } from "../controllers/itemListings.controller.js";
import upload from "../middlewares/multerImageUpload.js";

const router = express.Router();

// Route to add a new dish under a specific category with image upload
router.post("/add-item", upload.single("dishImage"), addItemToCategory);

export default router;
