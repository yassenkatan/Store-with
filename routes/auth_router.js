const express=require('express');
const auth=require('../controllers/auth_controller');
const router=express.Router();

//SignUp
router.post('/signup',auth.signup);

//Login
router.post('/login',auth.login);

//All Users
router.get('/all_users',auth.auth,auth.all_users);

module.exports=router;