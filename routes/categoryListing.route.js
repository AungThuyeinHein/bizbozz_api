import express from "express";
import {
  createCategoryListings,
  viewCategoryListings,
  pushCategoryListings,
  deleteCategoryListings,
} from "../controllers/categoryListing.controller.js";

const router = express.Router();

router.post("/list", createCategoryListings);
router.post("/list/:id", pushCategoryListings);
router.get("/", viewCategoryListings);
router.delete("/list/:id", deleteCategoryListings);

export default router;
