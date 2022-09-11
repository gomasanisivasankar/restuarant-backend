const MenuModel = require('../models/MenuModel');
const mongoose = require("mongoose");

const getMenuItems = async (req, res, next) => {
    try{
        MenuModel.find()
        .then(user => {
            res.json(user);
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to get customer data",error})
    }
}

// Insert the Menu Item into the Database
const menuPost = async (req, res) => {
    try{
        
        title = req.body.title || "";
        description = req.body.description || "";
        price = req.body.price || null;
        category = req.body.category || "";
        amount = req.body.amount || null;
        imgs = req.body.img || [];


        if(!title) res.json({error:"title of the item is required"});
        if(!price) res.json({error:"price of the item is required"});



        const post = new MenuModel({
            title, description, price, category, amount, img:imgs
        });

        item = await MenuModel.findOne({title,price,category})
        if(item) throw {error_msg:"item is already inserted"};
       
        post.save((err,doc)=>{
            if(!err){res.send(doc)}
            else{console.log("Error while " + JSON.stringify(err));}
        });
        
 
   
        
    }catch(error){
        console.log(error + "Error while inserting the menu item into db");
        res.json({PostCreation:false,error});
    }
}

// Update an item 
const menuPostPatch = async (req,res,next) => {
    try{
        id = req.body.id || "";
        title = req.body.title || "";
        description = req.body.description || "";
        price = req.body.price || "";
        category = req.body.category || "";
        amount = req.body.amount || "";
        imgs = req.body.img || [];

        if(!mongoose.Types.ObjectId.isValid(id)){
            throw {error_message:"Item id is missing"};
        }

        MenuModel.findOne({_id:id})
        .then(post => {
            if(title) post.title = title;
            if(description) post.description = description;
            if(price) post.price = price;
            if(category) post.category = category;
            if(amount) post.amount = amount;
            if(imgs) post.img = imgs;
            return post.save();
        })
        .then(post => {
            return res.json(post);
        })
        .catch(next);

    }
    catch(error){
        console.log(error + "Error while patching the menu item");
        res.json({PostPatching:false,error});
    }
}

// Delete an item
const menuPostDelete = async (req,res,next) => {
    try{
        id = req.body.id || "";
        if(!mongoose.Types.ObjectId.isValid(id)){ 
            throw {error_msg:"Item id is invalid format!",ItemId:id};
        }
        MenuModel.findByIdAndDelete({_id:id})
        .then(post => {
            return res.json({success:"Deleted the item",post});
        })
        .catch(next);
        
    }
    catch(error){
        res.json({error_msg:"deleting an item in failded", error});
    }
}

module.exports = {
    menuPost,
    menuPostPatch,
    menuPostDelete,
    getMenuItems
}