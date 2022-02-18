const express=require('express');
const auth=require('../controllers/auth_controller');
const router=express.Router();
const multer=require('multer');
//SignUp
    let DateNow=new Date(Date.now());
let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Media/Users')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+ '-' +DateNow.toDateString())
    }
});
let upload=multer({storage:storage});
router.post('/signup',upload.single('User'),auth.signup);

//Login
router.post('/login',auth.login);

//All Users
router.get('/all_users',auth.Admin_auth,auth.all_users);

//Update User
router.put('/update_user_byAdmin',auth.Admin_auth,auth.upd_user_by_admin);
router.put('/update_user_byBussiness',auth.Bussiness_auth,auth.upd_user_by_bussines);
router.put('/update_user_byCustomer',auth.Customer_auth,auth.upd_user_by_customer);

module.exports=router;