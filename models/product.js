const mongoose=require('mongoose');
const autoIncrementModelID = require('./counter');
const dotenv=require('dotenv');
dotenv.config();
let connection=mongoose.createConnection(process.env.DB_URL,{dbName:'Store',useNewUrlParser:true});
autoincrement.initialize(connection);

const schema=mongoose.Schema;
const ProductSchema=new schema({

    prod_name:{
        type:String,
        required:true,
        maxlength:20,
    },
    image:{
        type:String
    },
    rate:{
        type:Number,
        default:1
    },
    price:{
        type:Number
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
    brand_id:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'brand'
    }
});

const product=mongoose.model('product',ProductSchema);
module.exports=product;