const express=require('express');
const alert=require('alert')
const Category=require('../models/category');
const Dept=require('../models/department');
const auditAction=require('../audit/auditAction');
const Audit_Controller=require('../audit/audit_controller');
const Logger=require('../logger/logger_controller');
const logger=new Logger('category');
const util=require('../Utilites/util');

//Add Category
const add_category=async(req,res)=>{
    try {
        let token_data=await util.get_token(req);
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
        Audit_Controller.prepareAudit(auditAction.auditAction.ADD_CATEGORY,saved.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Add Category : ',`${saved.cat_name} is New Category Added | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(`${saved.cat_name} is New Category Added to ${dept}`)
    } catch (err) {
        logger.error('Add Category : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//All Categories
const all_categories=async (req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let all=await Category.aggregate([{$lookup:
        {
            from:'departments',
            localField:'dept_id',
            foreignField:'_id',
            as:'cat_details'
        }}]);
        res.status(200).send(all);
        Audit_Controller.prepareAudit(auditAction.auditAction.ALL_CATEGORIES,'Get All Categories',200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('All Categories : ',`Get All Categories | IP: ${req.socket.remoteAddress}`)
    } catch (err) {
        logger.error('All Categories : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//Search
const selected_category_by_name=async(req,res)=>{
try {
    let token_data=await util.get_token(req);
    let data=req.params.data;
    let cat=await Category.findOne({cat_name:data},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'})
    Audit_Controller.prepareAudit(auditAction.auditAction.SELECTED_CATEGORY_BY_NAME,cat.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search Category By Name : ',`${cat}  | IP: ${req.socket.remoteAddress}`)
    res.status(200).send(cat);
} catch (err) {
    logger.error('Search Category By Name : ',err.message);
    res.status(404).send('ERR MSG:'+err.message);
}
}
const selected_category_by_Dept=async(req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let data=req.params.data;
        let cat=await Category.find({dept_id:data},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'});
        Audit_Controller.prepareAudit(auditAction.auditAction.selected_category_by_Dept,cat.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search Category By Dept : ',`${cat}  | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(cat);
    } catch (err) {
        logger.error('Search Category By Dept : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
    }

//Update Category
const upd_category=async(req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let name=req.params.name;
        let cat_name=req.body.cat_name
        let dept_id=req.body.dept_id
        let old_cat=await Category.findOne({cat_name:name},{_id:0,cat_name:1});
        
        if(old_cat){
            let upd=await Category.findOneAndUpdate({cat_name:name},{$set:{
                cat_name:cat_name,
                dept_id:dept_id
            }});
            let new_cat=await Category.findOne({_id:id},{_id:0,cat_name:1}).populate({path:'dept',select:'dept_name'});
            Audit_Controller.prepareAudit(auditAction.auditAction.UPD_CATEGORY,`${name} Category Updated to ${new_cat}`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Update Category : ',`${name} Category Updated to ${new_cat} | IP: ${req.socket.remoteAddress}`)
            res.status(200).send(`${old_cat.cat_name} is Updated to ${new_cat}`);
        }
        else{
            logger.error('Update Category : ','Category Not Found')
            alert('Category Not Found ...');

        }
        
    } catch (err) {
        logger.error('Update Category : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}

//Delete Category
const del_category=async (req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let name=req.params.name;
        let cat=await Category.findOne({cat_name:name});
        if(cat){
            let del_cat=await Category.findOneAndDelete({cat_name:name});
            Audit_Controller.prepareAudit(auditAction.auditAction.DEL_CATEGORY,`${cat.cat_name} Category Deleted`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Delete Category : ',`${cat.cat_name} Category Deleted | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(cat.cat_name+' is Deleted Successfully ...');
        }
        else{
            logger.error('Delete Category : ','Category Not Found');
            alert('Category Not Found ...')
           
        }
        
    } catch (err) {
        logger.error('Delete Category : ',err.message);
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