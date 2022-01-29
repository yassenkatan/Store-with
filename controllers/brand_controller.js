const express=require('express');
const Brand=require('../models/brand');
const category = require('../models/category');
const Category=require('../models/category');

//Add Brand
const add_brand=async (req,res)=>{
    try {
        let brand_name=req.body.brand_name;
        let category_id=req.body.category_id;
            let new_Brand=await new Brand({
                brand_name:brand_name,
                category:category_id
            });
            let saved=await new_Brand.save();
            let category=await Brand.findOne({brand_name:saved.brand_name},{_id:0,brand_name:0,__v:0}).populate({path:'category',select:'cat_name'});
            let dept=await Category.findOne({_id:saved.category_id},{_id:0,cat_name:0,__v:0}).populate({path:'dept_id',select:'dept_name'});
            
            res.status(200).send(new_Brand.brand_name+' is New Brand Added to '+category+ ' and to '+dept);
        
    } catch (err) {
        res.status(404).send('Err MSG: '+err.message);
    }
}

//All Brands
const all_brands=async (req,res)=>{
    try {
        let brands=await Brand.find({},{_id:0,brand_name:1,category:1}).populate({path:'category',select:'cat_name'});
        let cat_id=[];
        for(let i=0;i<brands.length;i++)
        {
            let category=[];
            category=brands[i].category;
            for(let j=0;j<category.length;j++){
                cat_id[i]=category[j]._id;
            }
        }
        let dept= await Category.find({_id:cat_id},{_id:0,cat_name:1,dept_id:1}).populate({path:'dept_id',select:'dept_name'})

        res.send('All Brands:\n'+brands+'\n All Departments:\n'+dept);
    } catch (err) {
        res.status(404).send('Err MSG: '+err.message);
    }
}

//Search
const Serach_By_name=async(req,res)=>{
    try {
        let brand_name=req.params.brand_name;
        let brand=await Brand.find({brand_name:brand_name},{_id:0,brand_name:1,category:1}).populate({path:'category',select:'cat_name'});
        let cat_id=[];
        for(let i=0;i<brand.length;i++)
        {
            let category=[];
            category=brand[i].category;
            for(let j=0;j<category.length;j++){
                cat_id[i]=category[j]._id;
            }
        }
        let dept=await Category.find({_id:cat_id},{_id:0,cat_name:1,dept_id:1}).populate({path:'dept_id',select:'dept_name'});
        res.send(brand+'\n'+dept);
    } catch (err) {
        res.status(404).send('Err MSG: '+err.message);
    }
}

//Update Brand
const upd_brand=async (req,res)=>{
    try {
        let id=req.params.id;
        let brand_name=req.body.brand_name;
        let new_brand=await Brand.findOneAndUpdate({_id:id},{$set:{
            brand_name:brand_name,
            category:req.body.cat_id
        }});
        res.status(200).send('Brand is Updated Successfully ...');
    } catch (err) {
        res.status(404).send('Err MSG: '+err.message);
    }
}

//Delete Brand
const del_brand=async (req,res)=>{
    try {
        
        let id=req.params.id;
        let del_brand=await Brand.findByIdAndDelete(id);
        res.status(200).send('Brand is Deleted Successfully ...');
    } catch (err) {
        res.status(404).send('Err MSG: '+err.message);
    }
}


module.exports={
    add_brand,
    all_brands,
    Serach_By_name,
    upd_brand,
    del_brand
}