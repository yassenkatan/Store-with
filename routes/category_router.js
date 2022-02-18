const express=require('express');
const Category_Controller=require('../controllers/category_controller');
const Auth=require('../controllers/auth_controller');
const router=express.Router();

//Add Category
router.post('/add_category',Auth.Admin_auth,Category_Controller.add_category);

//All Categories
router.get('/all_categories',Category_Controller.all_categories);

//Search_By_Dept
router.get('/dept/:dept_id',Category_Controller.selected_category_by_Dept);

//Search_By_ Name
router.get('/:name',Category_Controller.selected_category_by_name);

//Update Category
router.put('/:name',Auth.Admin_auth,Category_Controller.upd_category);

//Delete Category
router.delete('/:name',Auth.Admin_auth,Category_Controller.del_category);

module.exports=router;