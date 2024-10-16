import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menuSetupSchema = new Schema({
  categoryName: { type: String, required: true },
  items: [
    {
      dishImage: { type: String, required: true },
      dishName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const Menu = mongoose.model("Menu", menuSetupSchema);

export default Menu;
