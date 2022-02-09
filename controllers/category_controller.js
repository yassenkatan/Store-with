const express=require('express');
const Category=require('../models/category');
const Dept=require('../models/department');

//Add Category
const add_category=async(req,res)=>{
    try {
        let name=req.body.cat_name;
        let dept_id=req.body.dept_id;
        let cat=new Category({
            cat_name:name,
            dept_id:dept_id
        });
        let dept=await Category.findOne({dept_id:dept_id},{_id:0,cat_name:0}).populate({
            path:'dept_id',
            select:'dept_name'
        })
        
        let saved=await cat.save();
        res.status(200).send(saved.cat_name+' is New Category Added to '+dept)
    } catch (err) {
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//All Categories
const all_categories=async (req,res)=>{
    try {
        let all=await Category.aggregate([{$lookup:
            {
                from:'departments',
        localField:'dept_id',
        foreignField:'_id',
        as:'cat_details'
        }}]);
            
            res.status(200).send(all);
    } catch (err) {
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//Search
const selected_category_by_name=async(req,res)=>{
try {
    let data=req.params.data;
    let cat=await Category.findOne({cat_name:data},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'});
    res.status(200).send(cat);
} catch (err) {
    res.status(404).send('ERR MSG:'+err.message);
}
}
const selected_category_by_Dept=async(req,res)=>{
    try {
        let data=req.params.data;
        let cat=await Category.find({dept_id:data},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'});
        res.status(200).send(cat);
    } catch (err) {
        res.status(404).send('ERR MSG:'+err.message);
    }
    }

//Update Category
const upd_category=async(req,res)=>{
    try {
        let id=req.params.id;
        let cat_name=req.body.cat_name
        let dept_id=req.body.dept_id
        let old_cat=await Category.findById(id,{_id:0,cat_name:1});
        
        if(old_cat){
            let upd=await Category.findByIdAndUpdate(id,{$set:{
                cat_name:cat_name,
                dept_id:dept_id
            }});
            let new_cat=await Category.findOne({_id:id},{_id:0,cat_name:1}).populate({path:'dept',select:'dept_name'});
            res.status(200).send(old_cat.cat_name+' is Updated to '+new_cat);
        }
        else{
            res.status(400).send('This Category Not Found ...');
        }
        
    } catch (err) {
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//Delete Category
const del_category=async (req,res)=>{
    try {
        let id=req.params.id;
        let cat=await Category.findById(id);
        if(cat){
            let del_cat=await Category.findByIdAndDelete(id);
        res.status(200).send(cat.cat_name+' is Deleted Successfully ...');
        }
        else{
            res.status(400).send('This Category Not Found ...');
        }
        
    } catch (err) {
        res.status(404).send('ERR MSG:'+err.message);
    }
}

module.exports={
    add_category,
    all_categories,
    selected_category_by_name,
    selected_category_by_Dept,
    upd_category,
    del_category
}