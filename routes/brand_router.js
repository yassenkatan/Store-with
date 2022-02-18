const express=require('express');
const Brand_Controller=require('../controllers/brand_controller');
const Auth=require('../controllers/auth_controller');
const router=express.Router();

//Add Brand
router.post('/add_brand',Auth.Admin_auth,Brand_Controller.add_brand);

//All Brands
router.get('/all_brands',Brand_Controller.all_brands);

//Search By Name
router.get('/:brand_name',Brand_Controller.Serach_By_name);

//Update Brand
router.put('/:id',Auth.Admin_auth,Brand_Controller.upd_brand);

//Delete Brand
router.delete('/:id',Auth.Admin_auth,Brand_Controller.del_brand);

module.exports=router;