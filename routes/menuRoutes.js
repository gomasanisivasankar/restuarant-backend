const router = require('express').Router();
  
const { menuPost, menuPostPatch, menuPostDelete, getMenuItems } = require('../controllers/menuControllers');
const { customerPost, tablePatch, getCustomerDetails } = require('../controllers/customerControllers');

// Menu Items 
router.post('/menu',menuPost);
router.patch('/menu/update', menuPostPatch);
router.post('/menuItem/delete', menuPostDelete);

// Customer Routes
router.post('/customer',customerPost);
router.patch('/table',tablePatch);

//cart controllers
router.use('/cart',require("../controllers/cartControllers"));

// get Menu items
router.get('/getMenuItems',getMenuItems);
router.get('/getCustomerDetails',getCustomerDetails);

module.exports = router;   