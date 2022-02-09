const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const AdsSchema=new schema({
    startDate:{
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true,
        default:1
    },
    endDate:{
        type:Date
    }
    ,
    price:{
        type:Number
    },
    totalPrice:{
        type:Number
    }
    ,
    product:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'product'
    },
    users:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'user'
    }
});

const ads=mongoose.model('ads',AdsSchema);
module.exports=ads;