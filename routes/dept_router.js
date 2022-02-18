const express=require('express');
const Dept_Controller=require('../controllers/dept_controller');
const Auth=require('../controllers/auth_controller');
const router=express.Router();

//Add Department
router.post('/add_dept',Auth.Admin_auth,Dept_Controller.add_dept);

//All Department
router.get('/all_depts',Dept_Controller.all_depts);

//Search
router.get('/:name',Dept_Controller.select_dept);

//Update Department
router.put('/:name',Auth.Admin_auth,Dept_Controller.upd_dept);

//Delete Department
router.delete('/:name',Auth.Admin_auth,Dept_Controller.del_dept);

module.exports=router;