const mongoose = require('mongoose');

const menuSchema =new mongoose.Schema({
    title:{
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    img: [],
    category:{
        type: String
    },
    amount: {
        type: Number
    }
})

const MenuItems = mongoose.model("MenuItems",menuSchema);
module.exports = MenuItems;