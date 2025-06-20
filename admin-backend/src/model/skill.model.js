import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  _id: false, // Disable automatic _id generation for items

});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  items: [itemSchema],
  color:{
    type: String,
    required: true,
  },

},{timestamps: true});


export const Skill=mongoose.model("Skill", skillSchema);
