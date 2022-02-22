const express=require('express');
const alert=require('alert');
const Brand=require('../models/brand');
const Category=require('../models/category');
const Audit_Controller=require('../audit/audit_controller');
const auditAction=require('../audit/auditAction');
const Logger=require('../logger/logger_controller');
const logger=new Logger('brand');
const util=require('../Utilites/util');
const brand = require('../models/brand');

//Add Brand
const add_brand=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let brand_name=req.body.brand_name;
        let category_id=req.body.category_id;
        let brand_exist=await Brand.findOne({brand_name:brand_name,category:category_id});
        if(brand_exist){
            alert('Brand is exist in this category ...');
            logger.error('Add Brand : ',`Brand is Exist | IP : ${req.socket.remoteAddress}`);
        }
        else{
            let new_Brand=await new Brand({
                brand_name:brand_name,
                category:category_id
            });
            let saved=await new_Brand.save();
            let BrandOfCat=await Brand.find({brand_name:saved.brand_name},{_id:0,brand_name:0,__v:0}).populate({path:'category',select:'cat_name'});
            let cat_name=[];
            BrandOfCat.forEach(cat => {
                let cat_id=cat.category;
                cat_id.forEach(name=>{
                    cat_name=name.cat_name;
                })
            })
            let BrandOfDept=await Category.find({cat_name:cat_name},{_id:0,cat_name:0,__v:0}).populate({path:'dept_id',select:'dept_name'});
            let dept_name=[];
            BrandOfDept.forEach(dept => {
                let dept_id=dept.dept_id;
                dept_id.forEach(name=>{
                    dept_name=name.dept_name;
                })
            })
            
            Audit_Controller.prepareAudit(auditAction.auditAction.ADD_BRAND,saved.brand_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Add Brand : ',`${saved.brand_name} Brand is Added | IP : ${req.socket.remoteAddress}`)
            res.status(200).send(`${saved.brand_name} is New Brand Added to ${cat_name}  and to ${dept_name}`);
        }
        
    } catch (err) {
        logger.error('Add Brand : ',err.message);
        res.status(404).send('Error MSG: '+err.message);
    }
}

//All Brands
const all_brands=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let brands=await Brand.find({},{_id:0,brand_name:1,category:1}).populate({path:'category',select:'cat_name'});
        if(brands){
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
        Audit_Controller.prepareAudit(auditAction.auditAction.ALL_BRANDS,'Get All Brands',200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('All Brands : ',`Get All Brands | IP : ${req.socket.remoteAddress}`)
        
        }
        else{
            alert('Don`t Found Any Brand ...');
            logger.error('All Brands : ',`Don't Found Any Brand | IP : ${req.socket.remoteAddress}`);
        }
        return brands;
    } catch (err) {
        logger.error('All Brands : ',err.message);
        res.status(404).send('Error MSG: '+err.message);
    }
}
const all_brand_names=async(brand_name)=>{
    try {
        let brands=await Brand.find();
        brand_name=[];
        for(let i=0;i<brands.length;i++){
            brand_name[i]=brands[i].brand_name;
        }
        return brand_name;
    } catch (err) {
        res.status(404).send(err.message)
    }
}

//Search
const Serach_By_name=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let brand_name=req.params.brand_name;
        let brand=await Brand.find({brand_name:brand_name},{_id:0,brand_name:1,category:1}).populate({path:'category',select:'cat_name'});
        if(brand){
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
        res.status(200).send(brand+'\n'+dept);
        Audit_Controller.prepareAudit(auditAction.auditAction.SEARCH_BRAND_BY_NAME,brand_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search of Brand By Name : ',`Search of ${brand_name} brand | IP : ${req.socket.remoteAddress}`)
        }
        else{
            alert('Brand not found ...');
            logger.error('Search of Brand By Name : ',`Brand not found | IP : ${req.socket.remoteAddress}`);;
        }
    }
    catch (err) {
        logger.error('Search of Brand By Name : ',err.message);
        res.status(404).send('Error MSG: '+err.message);
    }
}

//Update Brand
const upd_brand=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let id=req.params.id;
        let brand_name=req.body.brand_name;
        let brand_exist=await Brand.findOne({_id:id});
        if(brand_exist){
            let new_brand=await Brand.findOneAndUpdate({_id:id},{$set:{
                brand_name:brand_name,
                category:req.body.cat_id
            }});
            Audit_Controller.prepareAudit(auditAction.auditAction.DEL_BRAND,brand_exist.brand_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Update Brand : ',`${brand_exist.brand_name} brand is Deleted | IP : ${req.socket.remoteAddress}`)
            res.status(200).send('Brand is Updated Successfully ...');
        }
        else{
            alert('Brand not found ...')
            logger.error('Update Brand : ',`Brand Not Found | IP : ${req.socket.remoteAddress}`)
        }
    } 
    catch (err) {
        logger.error('Update Brand : ',err.message)
        res.status(404).send('Error MSG: '+err.message);
    }
}

//Delete Brand
const del_brand=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let id=req.params.id;
        let brand_exist=await Brand.findOne({_id:id});
        if(brand_exist){
            let del_brand=await Brand.findByIdAndDelete(id);
        res.status(200).send('Brand is Deleted Successfully ...');
        Audit_Controller.prepareAudit(auditAction.auditAction.DEL_BRAND,brand_exist.brand_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Del Brand : ',`${brand_exist.brand_name} brand is Deleted | IP : ${req.socket.remoteAddress}`)
        }
        else{
            alert('Brand Not Found')
            logger.error('Del Brand : ',`Brand Not Found | IP : ${req.socket.remoteAddress}`)
        } 
    } 
    catch (err) {
        logger.error('Del Brand : ',err.message)
        res.status(404).send('Error MSG: '+err.message);
    }
}


module.exports={
    add_brand,
    all_brands,
    all_brand_names,
    Serach_By_name,
    upd_brand,
    del_brand
}