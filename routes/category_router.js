const express=require('express');
const Category_Controller=require('../controllers/category_controller');
const router=express.Router();

//Add Category
router.post('/add_category',Category_Controller.add_category);

//All Categories
router.get('/all_categories',Category_Controller.all_categories);

//Search_By_Dept
router.get('/:data',Category_Controller.selected_category_by_Dept);

//Search_By_ Name
router.post('/:data',Category_Controller.selected_category_by_name);

//Update Category
router.put('/:id',Category_Controller.upd_category);

//Delete Category
router.delete('/:id',Category_Controller.del_category);

module.exports=router;