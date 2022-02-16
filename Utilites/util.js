const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const User=require('../models/user');
dotenv.config();

//Date Now
const DateNow=function (){
    let Datenow=new Date(Date.now()).toLocaleString();
    return Datenow;
}

//Get Token SignedIn
const get_token=async (req,data)=>{
    const token=req.cookies.Auth_token;
    const decoded=jwt.verify(token,process.env.TOKEN_KEY,{expiresIn:process.env.EXPIRES_IN_KEY});
        req.user_signedIn=decoded;
        if(req.user_signedIn=decoded)
        {
            let id=req.user_signedIn.id;
            let user=await User.findOne({_id:id})
            data=user.email;
            
        }
       return data;
}
module.exports={
    DateNow,
    get_token
}