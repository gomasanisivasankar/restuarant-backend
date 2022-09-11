const TableModel = require('../models/TableModel');
const mongoose = require("mongoose");

const getCustomerDetails = async (req, res, next) => {
    try{
        TableModel.find().populate({
            path:"cart",
            select:{count:1},
            populate: [{
                path:"item",
                select:{title:1,price:1},
            }]
        })
        .then(user => {
            res.json(user);
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to get customer data",error})
    }
}



const customerPost = async (req,res,next) => {
    try{
        table_no = req.body.table_no || "";
        customer_name = req.body.customer_name || "";
        phone_no = req.body.phone_no || "";

        if(!table_no) throw {error_msg:"Table number is required"};
        if(!customer_name) throw {error_msg:"Customer name is required"};

        const user = new TableModel({
            table_no, customer_name, phone_no
        });
        user.save((err,doc)=>{
            if(!err){res.send(doc)}
            else{console.log("Error while " + JSON.stringify(err));
                res.json({error_msg:"failed to insert customer to db",err});
            }
        });
    }
    catch(error){
        res.json({error_msg:"failed to add customer number",error});
    }
}

const tablePatch = async (req,res,next) => {
    try{
        id = req.body.id || "";
        table_no = req.body.table_no || "";
        customer_name = req.body.customer_name || "";
        phone_no = req.body.phone_no || "";

        if(!mongoose.Types.ObjectId.isValid(id)){
            throw {error_message:"customer id is invalid"};
        }
        if(!table_no) throw {error_msg:"Table number is required"};
        
        isTableBooked = await TableModel.findOne({table_no});
        if(isTableBooked) throw {tableBooked:"Table is already reserved by another customer"};
       
        TableModel.findById({_id:id})
        .then(user => {
            // console.log(JSON.stringify(user));
            if(!user) throw {error_msg: "customer is not registered",err_code:404};
            if(customer_name) user.customer_name = customer_name;
            if(phone_no) user.phone_no = phone_no;
            user.table_no = table_no;
            return user.save();
        })
        .then(user => {
            return res.json({success:"table number is updated", user});
        })
        .catch(error => res.json({error}));

    }catch(error){
        res.json({error_msg:"failed to add table number",error});
    }
}


module.exports = {
    customerPost,
    tablePatch,
    getCustomerDetails,
}