const router = require('express').Router();
const TableModel = require('../models/TableModel');
const MenuModel = require('../models/MenuModel');
const CartModel = require('../models/CartModel');
const mongoose = require("mongoose");

//Get customerId
router.post('/customerId',(req,res,next) => {
    try{
        table_no = req.body.table_no || "";
        TableModel.find({table_no:table_no})
        .then(user => {
            if(user == [] || user == null || user == '') res.json({});
            res.json({id:user[0]._id});
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to get customer data",error})
    }
});

router.post('/setbill',(req,res,next) => {
    try{
        customer_id = req.body.customer_id || "";
        bill = req.body.bill || '';
        if(bill == '') throw {error_msg:"bill is in not the right format"};
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"Customers id is invalid"};
        TableModel.findById({_id:customer_id})
        .then(user => {
            user.bill = bill;
            return user.save();
        })
        .then(user=>{
            res.json({user});
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to get customer data",error})
    }
});

router.post('/submitBill',(req,res,next) => {
    try{
        customer_id = req.body.customer_id || "";
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"Customers id is invalid"};
        TableModel.findById({_id:customer_id})
        .then(user => {
            user.bill_status = "Paid";
            return user.save();
        })
        .then(user=>{
            res.json({user});
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to update the status of the customer payment!",error})
    }
});

router.post('/submitorder',(req,res,next) => {
    try{
        customer_id = req.body.customer_id || "";
        bill = req.body.bill || '';
        if(bill == '') throw {error_msg:"bill is in not the right format"};
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"Customers id is invalid"};
        TableModel.findById({_id:customer_id})
        .then(user => {
            user.bill = bill;
            user.order_status = "Ordered!"
            return user.save();
        })
        .then(user=>{
            res.json({user});
        })
        .catch(error => res.json({error, err_code:401}));
    }
    catch(error){
        res.json({error_msg:"Failed to get customer data",error})
    }
})

// Get the all details of the customer
router.post('/',(req,res,next) => {
    try{
        customer_id = req.body.customer_id || "";
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"Customers id is invalid"};
        TableModel.findById({_id:customer_id})
        .populate({
            path:"cart",
            select:{__v:0},
            populate: [{
                path:"item",
                select:{__v:0},
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
})

// Add the cart item to Customers cart list
router.put("/",(req,res,next) => {

    try{
    customer_id = req.body.customer_id || "";
    menu_id = req.body.menu_id || "";
    count = req.body.count || 1;

    if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"Customers id is invalid"};
    if(!mongoose.Types.ObjectId.isValid(menu_id)) throw {error_msg:"Menu item id is invalid"};
    if(count && (!Number.isInteger(count) )) throw {error_msg:"Invalid count",err_code:403};


    cart_item = new CartModel({count});

    MenuModel.findById({_id:menu_id})
    .then(item => {
        if(!item) throw {error_msg:"Item is not found",err_code:404};
        cart_item.item = item._id;
        return TableModel.findById({_id:customer_id}).populate({path:"cart",match:{item: item._id}},);
    })
    .then(user => {
        if(user.table_no == null || !user.table_no) throw {error_msg:"Table number is not assigned to the customer"};
        if(user.cart.length > 0) throw {error_msg:"Cart item is already exists",err_code:403};
        user.cart.addToSet(cart_item);
        return user.save().then(user => cart_item.save());
    })
    .then(cartItem => {
        return res.json({success:"item is inserted to user cart",cartItem});
    })
    .catch(error => {
        res.json({cart_error:"cart item is not inserted",error});
    });

    }
    catch(error){
        res.json({error_msg:"cart item is not inserted",error});
    }

});



// Cart item middleware
cart_item_middleware = async (req,res,next) => {
    try{
        cart_item_id = req.body.cart_item_id || "";
        customer_id = req.body.customer_id || "";
        console.log(cart_item_id + "  " + customer_id)
        if(!mongoose.Types.ObjectId.isValid(cart_item_id)) throw {error_msg:"Cart item id is invalid",err_code:403};
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"customer id is invalid",err_code:403};
    
        req.user = await TableModel.findById({_id:customer_id});    
        if(!req.user) throw {error_msg:"Customer is not registered",err_code:404};
    
        cart_item = req.user.cart.filter(item => item._id.toString() === cart_item_id)[0];
        if(!cart_item) throw {error_msg:"Cart item not found",err_code:404};
    
        CartModel.findOne({
            _id: cart_item_id,
        })
        .then(cart_item => {
            req.cart_item = cart_item;
            next();
        })
        .catch(err => {
            res.json(err);
        });

    }catch(err){
        res.json({error_middleware:"error in cart middleware",err});
    }

};

// To set the count to the cart item
router.patch("/",cart_item_middleware,(req,res,next) => {
    try{
        cart_item = req.cart_item;
        count = req.body.count || "";
        if(!count || !Number.isInteger(count) || count < 2 || count > 100) throw {error_msg:"Invalid count",err_code:403};
        cart_item.count = count;
        cart_item 
        .save()
        .then(_ => {
            res.json(cart_item);
        })
        .catch(error => {
            res.json({patch_msg:"error while patching the cart item",error});
        });
    }
    catch(error){
        res.json({error_msg:"error while patching the cart item",error});
    }
});

// To increment
router.patch("/increment",cart_item_middleware,(req,res,next) => {
    try{
        cart_item = req.cart_item;
        cart_item.count += 1;
        cart_item 
        .save()
        .then(_ => {
            res.json(cart_item);
        })
        .catch(next);
    }
    catch(error){
        res.json({error_msg:"error while incrementing count of cart item",error});
    }
});
// To decrement
router.patch("/decrement",cart_item_middleware,(req,res,next) => {
    try{
        cart_item = req.cart_item;
        if(cart_item.count <= 1) throw {error_msg:"Cart count can't be 0",err_code:403};
        cart_item.count -= cart_item.count > 1 ? 1 : 0;
        cart_item 
        .save()
        .then(_ => {
            res.json(cart_item);
        })
        .catch(next);
    }
    catch(error){
        res.json({error_msg:"error while decrementing count of cart item",error});
    }
});

// Delete the item in customers cart
router.post("/deleteCartItem",cart_item_middleware,(req,res,next) => {
    try{
        user = req.user;
        cart_item = req.cart_item;
        user.cart.remove(cart_item);

        CartModel.deleteOne({
            _id: cart_item._id,
        })
        .then(_ => user.save())
        .then(_ => {
            res.json(user);
        })
        .catch(next);
    }
    catch(error){
        res.json({error_msg:"error while deleting the cart item",error});
    }
});

// Delete all items in the customers cart
router.post("/deleteCustomer",async (req,res,next) => {
    try{
        customer_id = req.body.customer_id || "";
        if(!mongoose.Types.ObjectId.isValid(customer_id)) throw {error_msg:"customer id is invalid",err_code:403};
    
        user = await TableModel.findById({_id:customer_id});  
        if(!user) throw {error_msg:"Customer is not registered",err_code:404};
    
        CartModel.find({
            _id:{ $in: user.cart}
        })
        .then(cart_items => {
            ids = cart_items.map(x => x._id);
            for (id of ids) user.cart.pull(id);
            return CartModel.deleteMany({
                _id:{ $in: ids},
            });
        })
        .then(_ => {
            return TableModel.deleteOne({_id: customer_id});
        })
        .then(_ => {
            res.json({success:"User is deleted!!!"});
        })
        .catch(next);
    }
    catch(error){
        res.json({error_msg:"error while deleting all the cart items",error});
    }
})
module.exports = router;