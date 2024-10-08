import CategoryListings from "../models/categoryListing.model.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";

export const createCategoryListings = asyncErrorHandler(
  async (req, res, next) => {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return next(
        new CustomError(400, "Please provide an array of categories.")
      );
    }

    // Try to find an existing document
    // let newCategoryListing = await CategoryListings.findOne();

    const newCategoryListing = new CategoryListings({ categories });

    // if (!categoryListing) {
    //   categoryListing = new CategoryListings({ categories });
    // } else {
    //   categoryListing.categories = Array.from(
    //     new Set([...newCategoryListing.categories, ...categories])
    //   );
    // }

    const savedCategoryListing = await newCategoryListing.save();

    res.status(200).json({
      status: "success",
      message: "Categories added successfully.",
    });
  }
);

export const pushCategoryListings = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return next(
        new CustomError(400, "Please provide a valid array of categories.")
      );
    }

    const updatedCategoryListings = await CategoryListings.findByIdAndUpdate(
      id,
      { $push: { categories: { $each: categories } } },
      { new: true, runValidators: true }
    );

    if (!updatedCategoryListings) {
      return next(new CustomError(404, "Please add category name"));
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: `Category Name : ${categories} added successfully`,
      // data: updatedCategoryListings,
    });
  }
);

export const viewCategoryListings = asyncErrorHandler(
  async (req, res, next) => {
    const categories = await CategoryListings.find();

    if (categories.length === 0) {
      return next(new CustomError(404, "There is no Categories to show."));
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Categories data retrived successfully.",
      data: {
        categories,
      },
    });
  }
);

export const deleteCategoryListings = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return next(new CustomError(400, "Please provide a category to delete."));
    }
    const categoryListing = await CategoryListings.findById(id);

    if (!categoryListing.categories.includes(category)) {
      return next(
        new CustomError(400, `Category '${category}' does not exist.`)
      );
    }

    const updatedCategoryListings = await CategoryListings.findByIdAndUpdate(
      id,
      { $pull: { categories: category } },
      { new: true }
    );

    if (!updatedCategoryListings) {
      return next(new CustomError(404, "Category listing not found."));
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: `Category name : ${category} deleted successfully.`,
      // data: updatedCategoryListings,
    });
  }
);
