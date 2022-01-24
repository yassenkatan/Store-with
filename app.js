const mongoose=require('mongoose');
const express=require('express');
const dotenv=require('dotenv');
const ejs=require('ejs');
const fs=require('fs');
const path=require('path');
const multer=require('multer');
const bodyParser = require('body-parser');
const UserRouter=require('./routes/auth_router');
const DepartmentRouter=require('./routes/dept_router');
const CategoryRouter=require('./routes/category_router');
const Image=require('./models/images');

//Server Config
const port=process.env.PORT || "3600";
const app=express();
dotenv.config();
app.listen(port,()=>{console.log("The Server is listening on URL: http://localhost:"+port)});
app.use(express.json());

//DB Config
db_url=process.env.DB_URL || "mongodb://127.0.0.1:27017";
mongoose.connect(db_url,{dbName:"Store",useNewUrlParser:true})
.then(()=>{console.log("DB is Connected ...")}).catch(err=>console.log("Error MSG:"+err.message))

//Template Config
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set("view engine","ejs");   

//Routes
app.use('/API/auth',UserRouter);
app.use('/API/dept',DepartmentRouter);
app.use('/API/category',CategoryRouter);

//Media 
let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Media')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+ '-' +Date.now())
    }
});
let upload=multer({storage:storage});

app.get('/images',(req,res)=>{
    Image.find({},(err,items)=>{
        if(err){
            res.status(404).send(err);
        }
        else{
            res.render('image',{items:items});
        }
    });
});

app.post ('/',upload.single('image'),(req,res,next)=>{
    let img={
        name:req.body.name,
        desc:req.body.desc,
        img:{
            data:fs.readFileSync(path.join(__dirname+'/Media/'+req.file.filename)),
            contentType:'image/png'
        }
    };
    let saved=Image.create(img)
    res.status(200).redirect('/images');
})


