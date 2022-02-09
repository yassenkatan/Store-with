const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const DeptSchema=new schema({
    dept_name:{
        type:String,
        required:true,
        maxlength:20,
    }
});

const dept=mongoose.model('department',DeptSchema);
module.exports=dept;