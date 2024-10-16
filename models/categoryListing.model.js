import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoryListingsSchema = new Schema({
  categories: [
    {
      type: String,
      required: true,
    },
  ],
});

const CategoryListings = mongoose.model(
  "CategoryListings",
  categoryListingsSchema
);

export default CategoryListings;
