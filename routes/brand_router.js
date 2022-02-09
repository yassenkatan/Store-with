const express=require('express');
const Brand_Controller=require('../controllers/brand_controller');
const router=express.Router();

//Add Brand
router.post('/add_brand',Brand_Controller.add_brand);

//All Brands
router.get('/all_brands',Brand_Controller.all_brands);

//Search By Name
router.get('/:brand_name',Brand_Controller.Serach_By_name);

//Update Brand
router.put('/id',Brand_Controller.upd_brand);

//Delete Brand
router.delete('/:id',Brand_Controller.del_brand);

module.exports=router;