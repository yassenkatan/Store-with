const express=require('express');
const Brand=require('../models/brand')
const Category=require('../models/category');
const Product=require('../models/product');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

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
                contentType:'image/png  '
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
//Image Uploader '../Media/Products'+req.file.filename),
let saved=await Product.create(new_product);
    res.status(200).send(prod_name+' is New Product Added ...');
    }catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }

}

//All Product
const all_product=async(req,res)=>{
    try {
        
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}
//Search
const search_by_name=async(req,res)=>{
    try {
        
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}
const search_by_id=async(req,res)=>{
    try {
        
    } catch (err) {
        res.status(404).send('ERR MSG : '+err.message);
    }
}

//Update Product
const upd_product=async(req,res)=>{
    try {
        
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
    all_product,
    search_by_name,
    search_by_id,
    upd_product,
    del_product
}