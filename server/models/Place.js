const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    maxImg: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const PlaceModel = mongoose.model("Place", placeSchema);

module.exports = PlaceModel;
