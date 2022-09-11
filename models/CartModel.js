const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItems",
    },
    count: {
        type: Number,
        default: 1,
    }
}, {id:false});

const CartItems = mongoose.model("CartItems", CartSchema);
module.exports = CartItems;