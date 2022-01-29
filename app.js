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
const BrandRouter=require('./routes/brand_router');
const ProductRouter=require('./routes/product_router');


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
app.use('/API/brand',BrandRouter);
app.use('/API/product',ProductRouter);
app.get('/',(req,res)=>{
    res.render('image');
});


