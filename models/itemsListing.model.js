import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menuSetupSchema = new Schema({
  category: [
    {
      name: { type: String, required: true, unique: true },
      items: [
        {
          dishImage: { type: String, required: true },
          dishName: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
});

const Menu = mongoose.model("menu", menuSetupSchema);

export default Menu;
