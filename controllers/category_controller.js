const express=require('express');
const alert=require('alert')
const Category=require('../models/category');
const Filter_Field=require('../models/filter_field');
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
        let category_exist=await Category.findOne({cat_name:name,dept_id:dept_id});
        if(category_exist){
            alert('Category is exist ...')
            logger.error('Add Category : ',`Category is exist | IP : ${req.socket.remoteAddress}`);
        }
        else{
            let cat=new Category({
                cat_name:name,
                dept_id:dept_id
            });
            let deptOfcat=await Category.find({dept_id:dept_id},{_id:0,cat_name:0}).populate({
                path:'dept_id',
                select:'dept_name'
            })
            let dept_name=[];
            deptOfcat.forEach(dept => {
                let dept_id=dept.dept_id;
                dept_id.forEach(name=>{
                    dept_name=name.dept_name;
                })
            })
            let saved=await cat.save();
            Audit_Controller.prepareAudit(auditAction.auditAction.ADD_CATEGORY,saved.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Add Category : ',`${saved.cat_name} is New Category Added | IP: ${req.socket.remoteAddress}`)
            if(saved){
                let filter_field=await new Filter_Field({
                    f1:req.body.f1,
                    f2:req.body.f2,
                    f3:req.body.f3,
                    f4:req.body.f4,
                    f5:req.body.f5,
                    f6:req.body.f6,
                    f7:req.body.f7,
                    f8:req.body.f8,
                    f9:req.body.f9,
                    f10:req.body.f10,
                    f11:req.body.f11,
                    f12:req.body.f12,
                    f13:req.body.f13,
                    f14:req.body.f14,
                    f15:req.body.f15,
                    category:saved._id
                });
                await filter_field.save();
            }
            res.status(200).send(`${saved.cat_name} is New Category Added to ${dept_name} with specifications fields`)
        }
    } 
    catch (err) {
        logger.error('Add Category : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}
const Fields_By_Category=async (category_id)=>{

    let fields=[f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15];
    let filter_field=await Filter_Field.find({category:category_id});
filter_field.forEach(field=>{
    fields.f1=field.f1,
    fields.f2=field.f2,
    fields.f3=field.f3,
    fields.f4=field.f4,
    fields.f5=field.f5,
    fields.f6=field.f6,
    fields.f7=field.f7,
    fields.f8=field.f8,
    fields.f9=field.f9,
    fields.f10=field.f10,
    fields.f11=field.f11,
    fields.f12=field.f2,
    fields.f13=field.f13,
    fields.f14=field.f14,
    fields.f15=field.f15
})
return fields;
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
        if(all){
        Audit_Controller.prepareAudit(auditAction.auditAction.ALL_CATEGORIES,'Get All Categories',200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('All Categories : ',`Get All Categories | IP: ${req.socket.remoteAddress}`)
        
        }
        else{
            alert('Don`t found any category ...')
            logger.error('All Categories : ',`Don't found any category | IP : ${req.socket.remoteAddress}`)
        }
        return all;
        
    } catch (err) {
        logger.error('All Categories : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}

const all_categorie_Names=async(dept,cat_name)=>{
    try {
        let dept_id=await Dept.find({dept_name:dept})
        let categories=await Category.find({dept_id:dept_id});
         cat_name=[];
         for(let i=0;i<categories.length;i++){
             cat_name[i]=categories[i].cat_name;
         }
         return cat_name;

    } catch (err) {
        res.status(404).send(err.message);
    }
}

//Search
const selected_category_by_name=async(req,res)=>{
try {
    let token_data=await util.get_token(req);
    let name=req.params.name;
    let category_exist=await Category.findOne({cat_name:name},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'})
    if(category_exist){
    Audit_Controller.prepareAudit(auditAction.auditAction.SELECTED_CATEGORY_BY_NAME,category_exist.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search Category By Name : ',`${category_exist.cat_name}  | IP: ${req.socket.remoteAddress}`)

    res.status(200).send(category_exist);
    }
    else{
        alert('Category not found ...');
        logger.error('Search Category By Name : ',`Category not found | IP : ${req.socket.remoteAddress}`);
        }
    } 
    catch (err) {
    logger.error('Search Category By Name : ',err.message);
    res.status(404).send('ERROR MSG:'+err.message);
    }
}
const selected_category_by_Dept=async(req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let dept=req.params.dept_id;
        let category_exist=await Category.find({dept_id:dept},{_id:0,cat_name:1}).populate({path:'dept_id',select:'dept_name'});
        if(category_exist){ 
        Audit_Controller.prepareAudit(auditAction.auditAction.selected_category_by_Dept,category_exist.cat_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search Category By Dept : ',`${category_exist.cat_name}  | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(category_exist);
        }
        else{
            alert('Category not found ...');
            logger.error('Search Category By Dept : ',`Category not found | IP : ${req.socket.remoteAddress}`);
        }
    }
    catch (err) {
        logger.error('Search Category By Dept : ',err.message);
        res.status(404).send('ERROR MSG:'+err.message);
    }
    }

//Update Category
const upd_category=async(req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let name=req.params.name;
        let cat_name=req.body.cat_name
        let dept_id=req.body.dept_id
        let category_exist=await Category.findOne({cat_name:name},{_id:0,cat_name:1});
        if(category_exist){
            let upd=await Category.findOneAndUpdate({cat_name:name},{$set:{
                cat_name:cat_name,
                dept_id:dept_id
            }});
            let new_cat=await Category.findOne({_id:id},{_id:0,cat_name:1}).populate({path:'dept',select:'dept_name'});
            Audit_Controller.prepareAudit(auditAction.auditAction.UPD_CATEGORY,`${name} Category Updated to ${new_cat}`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Update Category : ',`${name} Category Updated | IP: ${req.socket.remoteAddress}`)
            res.status(200).send(`${category_exist.cat_name} is Updated `);
        }
        else{
            logger.error('Update Category : ',`Category Not Found | IP : ${req.socket.remoteAddress}`)
            alert('Category Not Found ...');
        }
    } 
    catch (err) {
        logger.error('Update Category : ',err.message);
        res.status(404).send('ERROR MSG:'+err.message);
    }
}

//Delete Category
const del_category=async (req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let name=req.params.name;
        let category_exist=await Category.findOne({cat_name:name});
        if(category_exist){
            let del_cat=await Category.findOneAndDelete({cat_name:name});
            Audit_Controller.prepareAudit(auditAction.auditAction.DEL_CATEGORY,`${category_exist.cat_name} Category Deleted`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Delete Category : ',`${cat.cat_name} Category Deleted | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(category_exist.cat_name+' is Deleted Successfully ...');
        }
        else{
            logger.error('Delete Category : ',`Category Not Found | IP : ${req.socket.remoteAddress}`);
            alert('Category Not Found ...')  
        }  
    } 
    catch (err) {
        logger.error('Delete Category : ',err.message);
        res.status(404).send('ERR MSG:'+err.message);
    }
}

module.exports={
    add_category,
    all_categories,
    all_categorie_Names,
    selected_category_by_name,
    selected_category_by_Dept,
    upd_category,
    del_category,
    Fields_By_Category
}