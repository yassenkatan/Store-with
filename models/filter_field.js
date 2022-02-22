const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const schema=mongoose.Schema;
const FilterSchema=new schema({
    f1:{
        type:String
    },
    f2:{
        type:String
    },
    f3:{
        type:String
    },
    f4:{
        type:String
    },
    f5:{
        type:String
    },
    f6:{
        type:String
    },
    f7:{
        type:String
    },
    f8:{
        type:String
    },
    f9:{
        type:String
    },
    f10:{
        type:String
    },
    f11:{
        type:String
    },
    f12:{
        type:String
    },
    f13:{
        type:String
    },
    f14:{
        type:String
    },
    f15:{
        type:String
    },
    category:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'category'
    }
});

const filters=mongoose.model('filter_field',FilterSchema);
module.exports=filters;