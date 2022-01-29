const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const ProductSchema=new schema({

    prod_name:{
        type:String,
        required:true,
        maxlength:20,
    },
    image:{
        data:Buffer,
        contentType:String
    },
    rate:{
        type:Number,
        default:1
    },
    price:{
        type:Number
    },
    QTY:{
        type:Number,
        required:true,
        default:1,
        min:1
    },
    discount:{
        type:Number,
        default:0
    },
    color:{
        type:String
    },
    matrial:{
        type:String
    },
    creationDate:{
        type:Date
    },
    other:{
        type:String
    },
    brand:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'brand'
    },
    user:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'user'
    }
});

const product=mongoose.model('product',ProductSchema);
module.exports=product;