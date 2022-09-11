const mongoose = require("mongoose");

const ItemCostSchema = new mongoose.Schema({
    item_cost:{
        type: Number,
    },
})

const ItemCost = mongoose.model("ItemCost", ItemCostSchema);
module.exports = ItemCost;