const express=require('express');
const multer=require('multer');
const Product_Controller=require('../controllers/product_controller');
const router=express.Router();

//Add Product
        let now=Date.now();
        let DateNow=new Date(now);
        let storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'Media/Products')
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+ '-' +DateNow.toDateString());
        }
    });
    let upload=multer({storage:storage});
router.post('/add_product',upload.single('Products'),Product_Controller.add_product);

//Search
//All Products
router.get('/brand/:brand_name',Product_Controller.all_products_by_brand);
//Product By Name
router.get('/:prod_name',Product_Controller.search_by_name);
//Product By Id
router.get('/:id',Product_Controller.search_by_id);

//Update Product
router.put('/:id',upload.single('Products'),Product_Controller.upd_product);

//Delete Product
router.delete('/:id',Product_Controller.del_product);


module.exports=router;