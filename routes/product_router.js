const express=require('express');
const multer=require('multer');
const Product_Controller=require('../controllers/product_controller');
const Auth=require('../controllers/auth_controller');
const router=express.Router();
const util=require('../Utilites/util');

//Add Product
    let DateNow=new Date(Date.now());
        let storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'Media/Products')
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+ '-' +DateNow.toDateString());
        }
    });
    let upload=multer({storage:storage});
router.post('/add_product',Auth.Admin_auth,upload.single('Product_image'),Product_Controller.add_product);
router.post('/add_product',Auth.Bussiness_auth,upload.single('Product_image'),Product_Controller.add_product);

//Search
//All Products
router.get('/brand/:brand_name',Product_Controller.all_products_by_brand);
//Product By Name
router.get('/:prod_name',Product_Controller.search_by_name);
//Product By Id
router.get('/:id',Product_Controller.search_by_id);

//Update Product
router.put('/:id',Auth.Admin_auth,upload.single('Product_image'),Product_Controller.upd_product);
router.put('/:id',Auth.Bussiness_auth,upload.single('Product_image'),Product_Controller.upd_product);

//Delete Product
router.delete('/:id',Auth.Admin_auth,Product_Controller.del_product);

module.exports=router;