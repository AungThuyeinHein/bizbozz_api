import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menuSetupSchema = new Schema({
  tables: {
    type: Number,
    required: true,
  },
  category: [
    {
      name: { type: String, required: true, unique: true },
      items: [
        {
          name: { type: String, required: true },
          potions: [
            {
              size: { type: String, required: true },
              price: { type: Number, required: true },
            },
          ],
          toppings: [
            {
              name: { type: String },
              additionalPrice: { type: Number, default: 0 },
            },
          ],
        },
      ],
    },
  ],
});

const Menu = mongoose.model("menu", menuSetupSchema);

export default Menu;
