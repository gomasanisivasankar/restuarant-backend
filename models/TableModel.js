const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    table_no: {
        type: Number,
        unique: true
    },
    customer_name: {
        type: String,
        required: true,
        unique: true
    },
    phone_no: {
        type: Number,
    },
    bill:{
        type: Number,
        default: 0,
    },
    order_status:{
        type:String,
        default:"Not Booked"
    },
    bill_status:{
        type:String,
        default:"Not Paid"
    },
    // References
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartItems"
        }
    ]
    },
    {
        timestamps: true,
        id: false,
    }
);


const TableLists = mongoose.model("TableLists", TableSchema);
module.exports = TableLists;

