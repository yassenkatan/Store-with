const express =require( 'express');
const mongoose=require('mongoose');
const { findOne } = require('../models/user');
const User =require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotenv=require('dotenv');
const fs=require('fs');
dotenv.config();
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
            res.send('This Email Already Exist ...');
        }
        else{
            //Check password is same confirm password 
            if(user.password==user.passwordConfirm)
            {
                const token=await (await SignedToken(newUser._id)).toString();
                newUser.token=token;
                newUser.save();
                res.send('New User Added ...');
            }
            else if(user.password!=user.passwordConfirm)
            {
                res.send('Password not confirmed ...');
            }
        }          
    }
    catch(err){
        console.log('Error Msg:'+err.message);
    }  
}

//All Users Function
const all_users=async(req,res)=>{
    try{
        //select all users from DB
        let users=await User.find({},{_id:0,id:1,fullname:1,email:1,country:1,state:1,address:1,phoneNumber:1,mobileNumber:1,photo:1,isAdmin:1});
        res.send(users)
    }
    catch(err){
        console.log('Error MSG:'+err.message);
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
                const token=await SignedToken(user_signedIn._id);
                //check user priv
                if(user_signedIn.isAdmin==true){
                    res.header('Auth-token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Administrator Roles ..');
                }
                else if(user_signedIn.isBussines==true)
                {
                    res.header('Auth-token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Bussines Roles ..');
                }
                else if(user_signedIn.isNormal==true)
                {
                    res.header('Auth-token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Customer Roles ..');
                }
        }
        else{
            res.status(404).send('Invalid Username or Password ...');
        }
    }
        else{
            res.status(404).send('Invalid Username or Password ...');
        }
    }
    catch(err){
        res.status(404).send('Error Message : '+err.message)
    }
    }

const Admin_auth=async(req,res,next)=>{
    const token=req.header('Auth-token');
    if(!token)
    {
        res.status(401).send('Access Rejected ...');
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
                res.status(401).send('You Don`t Have Permession ...')
            }
        }
           
    } catch (err) {
        res.status(404).send("Error MSG : "+err.message);
    }

}

const Bussiness_auth=async(req,res,next)=>{
    const token=req.header('Auth-token');
    if(!token)
    {
        res.status(401).send('Access Rejected ...');
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
                res.status(401).send('You Don`t Have Permession ...')
            }
        }
           
    } catch (err) {
        res.status(404).send("Error MSG : "+err.message);
    }

}
const Normal_auth=async(req,res,next)=>{
    const token=req.header('Auth-token');
    if(!token)
    {
        res.status(401).send('Access Rejected ...');
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
                res.status(401).send('You Don`t Have Permession ...')
            }
        }
           
    } catch (err) {
        res.status(404).send("Error MSG : "+err.message);
    }

}
module.exports={
    signup,
    login,
    all_users,
    Admin_auth,
    Bussiness_auth,
    Normal_auth
}