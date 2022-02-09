const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const CategorySchema=new schema({
    cat_name:{
        type:String,
        required:true,
        maxlength:20,
    },
    dept_id:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'department'
    }
});

const category=mongoose.model('category',CategorySchema);
module.exports=category;