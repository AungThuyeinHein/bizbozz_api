// itemListings.controller.js
import CategoryListings from "../models/categoryListing.model.js";
import Menu from "../models/itemsListing.model.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";
import cloudinary from "../configs/cloudinary.config.js"; // Ensure you have this import
import streamifier from "streamifier"; // Make sure to import streamifier

export const addItemToCategory = asyncErrorHandler(async (req, res, next) => {
  const { categoryName, dishName, price } = req.body;

  // Step 1: Check if the category exists in CategoryListings
  const categoryExists = await CategoryListings.findOne({
    categories: categoryName,
  });

  if (!categoryExists) {
    return next(
      new CustomError(400, `Category name: ${categoryName} does not exist.`)
    );
  }

  // Step 2: Find or create the Menu document with the given category
  let menu = await Menu.findOne({ "category.name": categoryName });

  if (!menu) {
    // Create a new menu if not found
    menu = new Menu({
      category: [{ name: categoryName, items: [] }],
    });

    // Save the new menu document
    await menu.save();
  }

  // Step 3: Upload the image to Cloudinary
  let dishImage;

  if (req.file) {
    // Create a Promise for the Cloudinary upload
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(
              new CustomError(500, "Error uploading image to Cloudinary.")
            );
          } else {
            resolve(result.secure_url); // Get the secure URL
          }
        }
      );

      // Use stream to upload the image
      streamifier.createReadStream(req.file.buffer).pipe(stream); // Use the buffer from Multer
    });

    // Await the upload result
    try {
      dishImage = await uploadPromise;
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new CustomError(400, "No image provided."));
  }

  // Step 4: Push the new item into the category’s items array
  const updatedMenu = await Menu.findOneAndUpdate(
    { "category.name": categoryName },
    {
      $push: {
        "category.$.items": {
          dishName,
          price,
          dishImage,
        },
      },
    },
    { new: true, runValidators: true }
  );

  // Step 5: Respond with the updated menu
  res.status(201).json({
    code: 201,
    status: "success",
    message: "Dish added to category successfully.",
    data: updatedMenu,
  });
});

export const getAllItems = asyncErrorHandler(async (req, res, next) => {
  // Step 1: Find all Menu documents
  const menus = await Menu.find();

  // Step 2: Check if any menu exists
  if (!menus || menus.length === 0) {
    return next(
      new CustomError(404, `No Menu at the moment!\nSet up your shop menu.`)
    );
  }

  // Step 3: Respond with the menus
  res.status(200).json({
    code: 200,
    status: "success",
    message: "All items retrieved successfully.",
    data: menus,
  });
});
