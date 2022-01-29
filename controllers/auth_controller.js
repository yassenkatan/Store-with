const express =require( 'express');
const mongoose=require('mongoose');
const { findOne } = require('../models/user');
const User =require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotenv=require('dotenv');
const fs=require('fs');

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
            isAdmin:req.body.isAdmin    
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
            photo:req.body.photo,
            isAdmin:user.isAdmin
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
                const token=await (await SignedToken(newUser.usr_id)).toString();
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
    try {
        let email=req.body.email;
        let password=req.body.password;
        let user_signedIn=await User.findOne({
            email:email
        });
        //Decrypte Password
        let passwordEncrypted=user_signedIn.password;
        const passwordDecrypted=await bcrypt.compare(password,passwordEncrypted);
        //Check if user true
        if(user_signedIn){
        const token=await SignedToken(user_signedIn.usr_id);
                
                //check user priv
                if(user_signedIn.isAdmin==true){
                    res.header('Auth-token',token).status(200).send('Welcome '+user_signedIn.fullname+' with Administrator Roles ..');
                    //res.status(200).send('Welcome '+user_signedIn.fullname+' with Administrator Roles ..');
                }
                else if(user_signedIn.isAdmin==false)
                {
                    res.header('Auth-token',token).status(200).send('Welcome '+user_signedIn.fullname+' with User Roles ..');
                    //res.status(200).send('Welcome '+user_signedIn.fullname+' with User Roles ..');
                }
        }
        else{
            res.send('Invalid Username or Password ...');
        }
    } catch (err) {
        console.log(err.message)
    }
}

const auth=async(req,res,next)=>{
    const token=req.header('Auth-token');
    if(!token)
    {
        res.status(401).send('Access Rejected ...');
    }
    try {
        jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY},(err,decoded)=>{
            if(err){res.status(400).send('Error MSG :'+err)}
            else
            {
                req.usr_id=decoded._id;
                next();
            }
        });
    } catch (err) {
        res.status(404).send("Error MSG : "+err.message);
    }

}

module.exports={
    signup,
    login,
    all_users,
    auth
}