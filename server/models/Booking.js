const mongoose = require("mongoose");

const bookingScheme = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Place",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  mobile: {
    type: Number,
    require: true,
  },
  numberOfImg: {
    type: Number,
    require: true,
  },
  price: Number,
});

const BookingModel = mongoose.model("Booking", bookingScheme);

module.exports = BookingModel;
