const express=require('express');
const multer=require('multer');
const fs=require('fs');
const Brand=require('../models/brand')
const Category=require('../models/category');
const Product=require('../models/product');
const Ads=require('../models/Ads');

//Add Product
const add_product=async (req,res)=>{
    try {
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
        let user=req.body.user;
        let new_product=await new Product({
            prod_name:prod_name,
            image:{
                data:fs.readFileSync('Media/Products/'+req.file.filename),
                contentType:'image/jpeg'
            },
            rate:rate,
            price:price,
            QTY:QTY,
            discount:discount,
            color:color,
            matrial:matrial,
            creationDate:creationDate,
            other:other,
            brand:brand,
            user:user
        });
//Image Uploader 
let saved=await Product.create(new_product);
    res.status(200).send(prod_name+' is New Product Added ...');
    }catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }

}

//All Product
const all_products_by_brand=async(req,res)=>{
    try {
        let brand_name=req.params.brand_name;
        let brand=await Brand.findOne({brand_name:brand_name});
        let brandId=brand._id;
        let products =await Product.find({brand:brandId},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1}).populate('brand','brand_name');
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
        
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}
//Search
const search_by_name=async(req,res)=>{
    try {
        let prod_name=req.params.prod_name;
        const product =await Product.find({prod_name:prod_name},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1,user:1}).populate('brand','brand_name');
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
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}
const search_by_id=async(req,res)=>{
    try {
        let id=req.params.id;
        const product =await Product.find({_id:id},{_id:0,prod_name:1,rate:1,price:1,QTY:1,discount:1,color:1,matrial:1,creationDate:1,other:1,brand:1,user:1}).populate('brand','brand_name');
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
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}

//Update Product
const upd_product=async(req,res)=>{
    try {
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
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}

//Delete Product
const del_product=async(req,res)=>{
    try {
        let id=req.params.id;
        let product=await Product.findByIdAndDelete(id);
        res.status(200).send('Product is Deleted Successfully ...');
    } catch (err) {
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