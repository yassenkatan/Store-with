const express =require( 'express');
const mongoose=require('mongoose');
const { findOne } = require('../models/user');
const User =require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotenv=require('dotenv');
const fs=require('fs');
const alert=require('alert');
const Logger=require('../logger/logger_controller');
const logger=new Logger('auth');
const Audit_Controller=require('../audit/audit_controller');
const auditAction=require('../audit/auditAction');
dotenv.config();
let DateNow=new Date(Date.now()).toLocaleString();
//Token
const SignedToken= async (id) =>{
    return jwt.sign({id},process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
}

//signUp Function
const signup=async (req,res)=>{
    try{
        let user=await new User({
            fullname:req.body.fullname,
            email:req.body.email.toLowerCase(),
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            country:req.body.country,
            state:req.body.state,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
            mobileNumber:req.body.mobileNumber,
            photo:{
                data:fs.readFileSync('Media/Users/'+req.file.filename),
                contentType:'image/jpeg'
            },
            nationalID:req.body.nationalID,
            isAdmin:req.body.isAdmin,
            isBussines:req.body.isBussines,
            isNormal:req.body.isNormal    
        });
        //Encrypt Password
        let passwordEncrypted=await bcrypt.hash(user.password,10);
        let passwordConfirmEncrypted=await bcrypt.hash(user.passwordConfirm,10);
        let newUser=await new User({
            fullname:user.fullname,
            email:user.email,
            password:passwordEncrypted,
            passwordConfirm:passwordConfirmEncrypted,
            country:req.body.country,
            state:req.body.state,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
            mobileNumber:req.body.mobileNumber,
            photo:{
                data:fs.readFileSync('Media/Users/'+req.file.filename),
                contentType:'image/jpeg'
            },
            nationalID:req.body.nationalID,
            isAdmin:req.body.isAdmin,
            isBussines:req.body.isBussines,
            isNormal:req.body.isNormal 
        });
        //Check if user Exist
        let userExist=await User.findOne({
            email:user.email
        });
        if(userExist){
            logger.error('User SignUp: ','User Exist | IP: '+req.socket.remoteAddress)
            alert('User Exist , Please Login ..')
            res.render('loginPage');
            
        }
        else{
            //Check password is same confirm password 
            if(user.password==user.passwordConfirm)
            {
                const token=await (await SignedToken(newUser._id)).toString();
                newUser.token=token;
                newUser.save();
                logger.info('User SignUp: ',newUser.email+' | IP: '+req.socket.remoteAddress);
                Audit_Controller.prepareAudit(auditAction.auditAction.signup,newUser.email,200,null,newUser._id,req.socket.remoteAddress,DateNow)
                alert('Welcome '+newUser.fullname+' ,Please Login ...');
                res.render('loginPage')
            }
            else if(user.password!=user.passwordConfirm)
            {
                logger.error('User SignUp: ','Password not confirmed | IP: '+req.socket.remoteAddress)
                alert('Password not confirmed ...');
            }
        }          
    }
    catch(err){
        logger.error('User SignUp: ',err.message)
        console.log('Error Msg:'+err.message);
    }  
}
//All Users Function
const all_users=async(req,res)=>{
    try{
        const token=req.cookies.Auth_token;
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        let user;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            user=await User.findOne({_id:id})
        }
        //select all users from DB
        let users=await User.find({},{_id:0,id:1,fullname:1,email:1,country:1,state:1,address:1,phoneNumber:1,mobileNumber:1,photo:1,isAdmin:1});
        res.status(200).send(users)
        Audit_Controller.prepareAudit(auditAction.auditAction.GET_All_Users,'Get All Users',200,null,user.email,req.socket.remoteAddress);
        logger.info('Get All Users : ','Done by '+user.email)
    }
    catch(err){
        logger.error('Get All Users : ',err.message)
        res.status(404).send('Error MSG:'+err.message);
    }
}
//Login Function
const login = async(req,res)=>{
    try{

            let email=req.body.email;
            let password=req.body.password;
        
        let user_signedIn=await User.findOne({
            email:email
        });
        if(user_signedIn!=null&&user_signedIn.email==email){
            
        let passwordEncrypted=user_signedIn.password;
        //Decrypte Password
        const passwordDecrypted=await bcrypt.compare(password,passwordEncrypted);
         if(passwordDecrypted==true){
        //Check if user true
        logger.info('User Login: ',user_signedIn.email+' | '+req.socket.remoteAddress)
        Audit_Controller.prepareAudit(auditAction.auditAction.login,user_signedIn.email,200,null,user_signedIn._id,req.socket.remoteAddress,DateNow)
                const token=await SignedToken(user_signedIn._id);
                //check user priv
                if(user_signedIn.isAdmin==true){
                    
                    res.cookie('Auth_token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Administrator Roles ..');

                }
                else if(user_signedIn.isBussines==true)
                {
                    res.cookie('Auth_token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Bussines Roles ..');
                }
                else if(user_signedIn.isNormal==true)
                {
                    res.cookie('Auth_token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Customer Roles ..');
                }
        }
        else{
            logger.error('User Login: ','Invalid Username or Password ... | IP: '+req.socket.remoteAddress)
            alert("Invalid Username or Password ...")

        }
    }
        else{
            logger.error('User Login: ','Invalid Username or Password ... | IP: '+req.socket.remoteAddress)
            alert("Invalid Username or Password ...")
        }
    }
    catch(err){
        logger.error('User Login: ',err.message)
        res.status(404).send('Error Message : '+err.message)
    }
    }
//Update User
const upd_user_by_admin=async (req,res)=>{
    try {
        const token=req.cookies.Auth_token;
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        let usertoken;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            usertoken=await User.findOne({_id:id})
        }
        let user={
            fullname:req.body.fullname,
            email:req.body.email,
            country:req.body.country,
            state:req.body.state,
            address:req.body.state,
            phoneNumber:req.body.phoneNumber,
            mobileNumber:req.body.mobileNumber,
            photo:{
                data:fs.readFileSync('Media/Users/'+req.file.filename),
                contentType:'image/jpeg'
            },
            nationalID:req.body.nationalID,
            isAdmin:req.body.isAdmin,
            isBussines:req.body.isBussines,
            isNormal:req.body.isNormal
        }
        let IsAdmin;
        let IsBussines;
        let IsNormal;
        if(user.isAdmin==true){
            IsAdmin=true;
            IsBussines=false;
            IsNormal=false;
        }else if(user.isBussines==true){
            IsAdmin=false;
            IsBussines=true;
            IsNormal=false;
        }else if(user.isNormal==true){
            IsAdmin=false;
            IsBussines=false;
            IsNormal=true;
        }
        let usr=await User.findOne({email:user.email});
        if(usr!=null){
            let upd_user=await User.findOneAndUpdate({email:user.email},{$set:{
                fullname:user.fullname,
                country:user.country,
                state:user.state,
                address:user.address,
                phoneNumber:user.phoneNumber,
                mobileNumber:user.mobileNumber,
                photo:user.photo,
                nationalID:user.nationalID,
                isAdmin:IsAdmin,
                isBussines:IsBussines,
                isNormal:IsNormal
            }})
            Audit_Controller.prepareAudit(auditAction.auditAction.upd_user_by_admin,`User Name ${usr.email} Updated `,200,null,usertoken.email,req.socket.remoteAddress,DateNow)
            logger.info('Update User By Admin : ',`${usr.email} Updated Successfully | ${req.socket.remoteAddress}`)
            res.status(200).send(`${usr.email} Updated Successfully`)
        }
        else{
            alert('User Not Found ...');
            logger.error('Update User By Admin : ','User Not Found')
        }
        
    } catch (err) {
        logger.error('Update User By Admin : ',err.message)
        res.status(404).send('Error MSG: '+err.message)
    }
    }
const upd_user_by_bussines=async (req,res)=>{
    try {
        const token=req.cookies.Auth_token;
    let Email;
    let user={
        fullname:req.body.fullname,
        country:req.body.country,
        state:req.body.state,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
        mobileNumber:req.body.mobileNumber,
         photo:{
             data:fs.readFileSync('Media/Users/'+req.file.filename),
             contentType:'image/jpeg'
         },
        nationalID:req.body.nationalID
    }
    const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        let usertoken;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            usertoken=await User.findOne({_id:id},{email:1});
            Email=usertoken.email;
        }
        let upd_user=await User.findOneAndUpdate({email:Email},{$set:{
            fullname:user.fullname,
            country:user.country,
            state:user.state,
            address:user.address,
            phoneNumber:user.phoneNumber,
            mobileNumber:user.mobileNumber,
            photo:user.photo,
            nationalID:user.nationalID
        }});
        Audit_Controller.prepareAudit(auditAction.auditAction.upd_user_by_bussines,`User Name ${user.email} Updated `,200,null,usertoken.email,req.socket.remoteAddress,DateNow)
        logger.info('Update User By Bussiness : ',`Updated Successfully by ${Email}`)
        res.status(200).send(`${Email} Update Successfully ...`)
    } catch (err) {
        logger.error('Update User By Bussiness : ',err.message);
        res.status(404).send('Error MSG: '+err.message)
    }
    }
 const upd_user_by_customer=async(req,res)=>{
     try {
        const token=req.cookies.Auth_token;
        let Email;
        let user={
            fullname:req.body.fullname,
            country:req.body.country,
            state:req.body.state,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
            mobileNumber:req.body.mobileNumber,
             photo:{
                 data:fs.readFileSync('Media/Users/'+req.file.filename),
                 contentType:'image/jpeg'
             },
            nationalID:req.body.nationalID
        }
        let usertoken;
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
            req.user_signedIn=decoded;
            if(req.user_signedIn=decoded)
            {
                let id=req.user_signedIn.id;
                usertoken=await User.findOne({_id:id},{email:1});
                Email=usertoken.email;
            }
            let upd_user=await User.findOneAndUpdate({email:Email},{$set:{
                fullname:user.fullname,
                country:user.country,
                state:user.state,
                address:user.address,
                phoneNumber:user.phoneNumber,
                mobileNumber:user.mobileNumber,
                photo:user.photo,
                nationalID:user.nationalID
            }});
            Audit_Controller.prepareAudit(auditAction.auditAction.upd_user_by_customer,`User Name ${Email} Updated `,200,null,usertoken.email,req.socket.remoteAddress,DateNow)
        logger.info('Update User By Customer : ',`Updated Successfully by ${Email}`)
            res.status(200).send(`${Email} Update Successfully ...`)
     } catch (err) {
        logger.error('Update User By Customer : ',err.message);
        es.status(404).send('Error MSG: '+err.message)
     }
    }
 //Auth Functions
const Admin_auth=async(req,res,next)=>{
    const token=req.cookies.Auth_token;
    if(!token)
    {
        logger.error('Admin Auth : ',`Access Rejected | IP: ${req.socket.remoteAddress}`)
        alert("Access Rejected ...")
    }
    try {
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            let user=await User.findOne({_id:id})
            if(user.isAdmin==true)
            {
                next();
            }
            else
            {
                alert("You Don`t Have Permession ...")
                logger.error('Admin Auth : ',`You Don't Have Permession ${user.email}`)
                res.render('homePage')
                
            }
        }
           
    } catch (err) {
        logger.error('Admin Auth : '+err.message);
        res.status(404).send("Error MSG : "+err.message);
    }

}
const Bussiness_auth=async(req,res,next)=>{
    const token=req.cookies.Auth_token;
    if(!token)
    {
        logger.error('Bussiness Auth : ',`Access Rejected | IP: ${req.socket.remoteAddress}`);
        alert("Access Rejected ...")
    }
    try {
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            let user=await User.findOne({_id:id})
            if(user.isBussines==true)
            {
                next();
            }
            else
            {
                logger.error('Bussiness Auth : ',`You Don't Have Permession ${user.email} | IP: ${req.socket.remoteAddress}`)
                alert("You Don`t Have Permession ...")
                res.render('homePage')
            }
        }
           
    } catch (err) {
        logger.error('Bussiness Auth : ',err.message);
        res.status(404).send("Error MSG : "+err.message);
    }

}
const Customer_auth=async(req,res,next)=>{
    const token=req.cookies.Auth_token;
    if(!token)
    {
        logger.error('Customer Auth : ',`Access Rejected | IP: ${req.socket.remoteAddress}`);
        alert("Access Rejected ...")
    }
    try {
        const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            let user=await User.findOne({_id:id})
            if(user.isNormal==true)
            {
                next();
            }
            else
            {
                logger.error('Customer Auth : ',`You Don't Have Permession ${user.email} | IP: ${req.socket.remoteAddress}`)
                alert("You Don`t Have Permession ...")
                res.render('homePage')
            }
        }
           
    } catch (err) {
        logger.error('Customer Auth : ',err.message);
        res.status(404).send("Error MSG : "+err.message);
    }

}

module.exports={
    signup,
    login,
    all_users,
    upd_user_by_admin,
    upd_user_by_bussines,
    upd_user_by_customer,
    Admin_auth,
    Bussiness_auth,
    Customer_auth
}