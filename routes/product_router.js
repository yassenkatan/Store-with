const express=require('express');
const multer=require('multer');
const Product_Controller=require('../controllers/product_controller');
const router=express.Router();

//Add Product
let storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'Media/Products')
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+ '-' +Date.now())
        }
    });
    let upload=multer({storage:storage});
router.post('/add_product',upload.single('Products'),Product_Controller.add_product);



module.exports=router;