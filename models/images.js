const mongoose=require('mongoose');

const ImageSchema=new mongoose.Schema({
    name:{
        type:String
    },
    desc:{
        type:String
    },
    img:{
        data:Buffer,
        contentType:String
    }
});

const image=new mongoose.model('images',ImageSchema);

module.exports=image;