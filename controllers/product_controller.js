const express=require('express');
const multer=require('multer');
const alert=require('alert');
const fs=require('fs');
const Brand=require('../models/brand')
const Category=require('../models/category');
const Filter_Field=require('../models/filter_field');
const Product=require('../models/product');
const Ads=require('../models/Ads');
const auditAction=require('../audit/auditAction');
const Audit_Controller=require('../audit/audit_controller');
const Logger=require('../logger/logger_controller');
const logger=new Logger('product');
const util=require('../Utilites/util');

//Add Product
const add_product=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        const token_ID=await util.get_token_ID(req);
        let prod_name=req.body.prod_name;
        let rate=req.body.rate;
        let price=req.body.price;
        let QTY=req.body.QTY;
        let discount=req.body.discount;
        let color=req.body.color;
        let matrial=req.body.matrial;
        let creationDate=req.body.creationDate;
        let key1=req.body.key1;
        let key2=req.body.key2;
        let key3=req.body.key3;
        let key4=req.body.key4;
        let key5=req.body.key5;
        let key6=req.body.key6;
        let key7=req.body.key7;
        let key8=req.body.key8;
        let key9=req.body.key9;
        let key10=req.body.key10;
        let other=req.body.other;
        let warrantly=req.body.warrantly;
        let brand=req.body.brand;
        let user=token_ID;
        let new_product=await new Product({
            prod_name:prod_name.toUpperCase(),
            image:{
                data:fs.readFileSync('Media/Products/'+req.file.filename),
                contentType:'image/jpeg'
            },
            rate:rate.toUpperCase(),
            price:price,
            QTY:QTY,
            discount:discount,
            color:color.toUpperCase(),
            matrial:matrial.toUpperCase(),
            creationDate:creationDate,
            specs:{
                key1:key1.toUpperCase(),
                key2:key2.toUpperCase(),
                key3:key3.toUpperCase(),
                key4:key4.toUpperCase(),
                key5:key5.toUpperCase(),
                key6:key6.toUpperCase(),
                key7:key7.toUpperCase(),
                key8:key8.toUpperCase(),
                key9:key9.toUpperCase(),
                key10:key10.toUpperCase(),
            },
            other:other,
            warrantly:warrantly,
            brand:brand,
            user:user
        });
        let product_exist=await Product.findOne({prod_name:prod_name})
        if(product_exist){
            alert('Product is Exist ...')
            logger.error('Add Product : ',`Product is Exist | IP : ${req.socket.remoteAddress}`)
        }
        else{
//Image Uploader 

    let saved=await Product.create(new_product);
    res.status(200).send(saved.prod_name+' is New Product Added ...');
    Audit_Controller.prepareAudit(auditAction.auditAction.ADD_PRODUCT,saved.prod_name,200,null,token_data,req.socket.remoteAddress,util.DateNow())
    logger.info('Add Product : ',`${saved.prod_name} Product is Added | IP : ${req.socket.remoteAddress}`)

        }
    }
    catch (err) {
        logger.error('Add Product : ',err.message);
        res.status(404).send('ERROR MSG: '+err.message);
    }
}

//All Product
const all_products_by_brand=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let brand_name=req.params.brand_name;
        let brand=await Brand.findOne({brand_name:brand_name});
        let brandId=brand._id;
        let products =await Product.find({brand:brandId},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1}).populate('brand','brand_name');
        if(products!=null && products.QTY!=0 ){
        let brand_id=[];
        products.forEach(brand =>{
            let brands=brand.brand;
            brands.forEach(brand=>{
                brand_id=brand._id;
            })
        })
        let category=await Brand.find({_id:brand_id},{_id:0,category:1}).populate({path:'category',select:'cat_name'});
        let category_id=[];
        let category_name=[];
        category.forEach(category=>{
            let categories=category.category;
            categories.forEach(category=>{
                category_id=category._id;
                category_name=category.cat_name;
            })
        })
        let dept = await Category.find({_id:category_id},{_id:0,dept_id:1}).populate({path:'dept_id',select:'dept_name'});
        let dept_name=[];
        dept.forEach(dept=>{
            let depts=dept.dept_id;
            depts.forEach(dept=>{
                dept_name=dept.dept_name;
            })
        })
        res.status(200).send(products+'\n Brand : '+brand_name+'\nCategory : '+category_name+'\n Department : '+dept_name);
        Audit_Controller.prepareAudit(auditAction.auditAction.ALL_PRODUCTS_BY_BRAND,'Get All Products',200,null,token_data,req.socket.remoteAddress,util.DateNow())
        logger.info('All Products : ',`Get All Products | IP : ${req.socket.remoteAddress}`)
    }
    else{
        alert('Don`t found any product')
        logger('All Products : ',`Don't found and product | IP : ${req.socket.remoteAddress}`)
    }   
    }
    catch (err) {
        logger.error('All Products : ',err.message);
        res.status(404).send('ERROR MSG : '+err.message);
    }
}
//Search
const search_by_name=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let prod_name=req.params.prod_name;
        const product =await Product.find({prod_name:prod_name},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1,user:1}).populate('brand','brand_name');
        if(product!=null && product.QTY!=0){
        let brand_id=[];
        product.forEach(brand =>{
            let brands=brand.brand;
            brands.forEach(brand=>{
                brand_id=brand._id;
            })
        })
        const category=await Brand.find({_id:brand_id},{_id:0,category:1}).populate({path:'category',select:'cat_name'});
        let category_id=[];
        category.forEach(category=>{
            let categories=category.category;
            categories.forEach(category=>{
                category_id=category._id;
            })
        })
        const dept = await Category.find({_id:category_id},{_id:0,dept_id:1}).populate({path:'dept_id',select:'dept_name'});
        res.status(200).send([product,category,dept]);
        Audit_Controller.prepareAudit(auditAction.auditAction.SEARCH_PRODUCT_BY_NAME,product.prod_name,200,null,token_data,req.socket.remoteAddress,util.DateNow())
        logger.info('Search of product by name : ',`${product.prod_name} Product | IP : ${req.socket.remoteAddress}`)
    }
        else{
            alert('Product not found ...')
            logger.error('Search of product by name : ',`Procuct not found | IP : ${req.socket.remoteAddress}`)
        }
    } catch (err) {
        logger.error('Search of product by name : ',err.message);
        res.status(404).send('ERROR MSG : '+err.message);
    }
}
const search_by_id=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let id=req.params.id;
        const product =await Product.find({_id:id},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1,user:1}).populate('brand','brand_name');
        if(product!=null && product.QTY!=0){
        let brand_id=[];
        product.forEach(brand =>{
            let brands=brand.brand;
            brands.forEach(brand=>{
                brand_id=brand._id;
            })
        })
        const category=await Brand.find({_id:brand_id},{_id:0,category:1}).populate({path:'category',select:'cat_name'});
        let category_id=[];
        category.forEach(category=>{
            let categories=category.category;
            categories.forEach(category=>{
                category_id=category._id;
            })
        })
        const dept = await Category.find({_id:category_id},{_id:0,dept_id:1}).populate({path:'dept_id',select:'dept_name'});
        res.status(200).send([product,category,dept]);
        Audit_Controller.prepareAudit(auditAction.auditAction.SEARCH_PRODUCT_BY_ID,product.prod_name,200,null,token_data,req.socket.remoteAddress,util.DateNow())
        logger.info('Search of product by ID : ',`${product.prod_name} Product | IP : ${req.socket.remoteAddress}`)
    }else{
        alert('Product not found ...')
            logger.error('Search of product by ID : ',`Procuct not found | IP : ${req.socket.remoteAddress}`)
    }
    } catch (err) {
        logger.error('Search of product by ID : ',err.message);
        res.status(404).send('ERROR MSG : '+err.message);
    }
}

//Update Product
const upd_product=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let id=req.params.id;
        let prod_name=req.body.prod_name;
        let rate=req.body.rate;
        let price=req.body.price;
        let QTY=req.body.QTY;
        let discount=req.body.discount;
        let color=req.body.color;
        let matrial=req.body.matrial;
        let creationDate=req.body.creationDate;
        let other=req.body.other;
        let brand=req.body.brand;

        let product_exist=await Product.findOne({_id:id});

        if(product_exist){
        let product=await Product.findByIdAndUpdate({id},{$set:{
            prod_name:prod_name,
            image:{
                data:fs.readFileSync('Media/Products/'+req.file.filename),
                contentType:'image/png'
            },
            rate:rate,
            price:price,
            QTY:QTY,
            discount:discount,
            color:color,
            matrial:matrial,
            creationDate:creationDate,
            other:other,
            brand:brand
        }});
        res.status(200).send('Product is Updated Successfully ...');
        Audit_Controller.prepareAudit(auditAction.auditAction.UPD_PRODUCT,product.prod_name,200,null,token_data,req.socket.remoteAddress,util.DateNow())
        logger.info('Update Product : ',`${product.prod_name} Product is Updated | IP : ${req.socket.remoteAddress}`)
    }
    else{
        alert('Product not found ...')
        logger.error('Update Product : ',`Product not found | IP : ${req.socket.remoteAddress}`)
    }
    }
    catch (err) {
        logger.error('Update Product : ',err.message);
        res.status(404).send('ERROR MSG : '+err.message);
    }
}

//Delete Product
const del_product=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let id=req.params.id;
        let product_exist=await Product.findOne({_id:id});
        if(product_exist){
        let product=await Product.findByIdAndDelete(id);
        res.status(200).send('Product is Deleted Successfully ...');
        udit_Controller.prepareAudit(auditAction.auditAction.UPD_PRODUCT,product_exist.prod_name,200,null,token_data,req.socket.remoteAddress,util.DateNow())
        logger.info('Delete Product : ',`${product_exist.prod_name} Product is Deleted | IP : ${req.socket.remoteAddress}`)
    }
    else{
        lert('Product not found ...')
        logger.error('Delete Product : ',`Product not found | IP : ${req.socket.remoteAddress}`)
    }
    } 
    catch (err) {
        logger.error('Delete Product : ',err.message);
        res.status(404).send('ERR MSG : '+err.message);
    }
}

module.exports={
    add_product,
    all_products_by_brand,
    search_by_name,
    search_by_id,
    upd_product,
    del_product
}