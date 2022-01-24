const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const BrandSchema=new schema({

    brand_name:{
        type:String,
        required:true,
        maxlength:20,
    },
    cat_id:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'category'
    }
});

const brand=mongoose.model('brand',BrandSchema);
module.exports=brand;