const express=require('express');
const alert=require('alert');
const Department=require('../models/department');
const Logger=require('../logger/logger_controller');
const Audit_Controller=require('../audit/audit_controller');
const auditAction=require('../audit/auditAction');
const util=require('../Utilites/util');
const logger=new Logger('dept');

//Add Department
const add_dept=async (req,res)=>{
    try {
        let token_data=await util.get_token(req);
        let name=req.body.name;
        let Dept_exist=await Department.findOne({dept_name:name});
        if(Dept_exist){
            alert(`${name} Department is exist ...`)
            logger.error('Add Department : ',`Department is exist | IP : ${req.socket.remoteAddress}`)
        }else{
            let Dept=new Department({
                dept_name:name
            });
            let saved=await Dept.save();
            Audit_Controller.prepareAudit(auditAction.auditAction.ADD_DEPT,Dept.dept_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Add Department : ',`${saved.dept_name} is New Department Added | IP: ${req.socket.remoteAddress}`)
            res.status(200).send(`${saved.dept_name} is New Department Added ...`);
        }
        

    }
    catch (err) {
        logger.error('Add Department : ',err.message);
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//All Department
const all_depts=async(req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let all_dept=await Department.find({},{_id:0,dept_name:1});
        if(all_dept){
            Audit_Controller.prepareAudit(auditAction.auditAction.ALL_DEPT,'Get All Departments',200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('All Departments : ',`Get All Departments | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(all_dept);
        
        }
        else{
            alert('Don`t found any Department ...')
            logger.error('All Department : ',`Don't found any department | IP : ${req.socket.remoteAddress}`)
        }
        
    }
    catch (err) {
        logger.error('All Departments : ',err.message);
        res.status(404).send('ERROR MSG: '+err.message);
    }
}
const all_dept_name=async ()=>{
    try {
         dept_name=[];
         let all_dept=await Department.find({},{_id:0,dept_name:1});
         for(let i=0;i<all_dept.length;i++){
             dept_name[i]=all_dept[i].dept_name;
         }
         return dept_name;
    } catch (error) {
        res.status.send(error.message)
    }
}
//Search
const select_dept=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let name=req.params.name;
        let selected_dept=await Department.findOne({dept_name:name},{_id:0,dept_name:1});
        if(select_dept){
            Audit_Controller.prepareAudit(auditAction.auditAction.SELECT_DEPT,select_dept.dept_name,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Search Department : ',`Select Department : ${select_dept.dept_name} | IP: ${req.socket.remoteAddress}`)
        res.status(200).send(selected_dept.dept_name);
        }
        else{
            alert('Department not found ...')
            logger.error('Search of Department : ',`Department not found | IP : ${req.socket.remoteAddress}`)
        }
    } 
    catch (err) {
        logger.error('Search Department : ',err.message)
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//Update Department
const upd_dept=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let name=req.params.name;
        let Dept_exist=await Department.findOne({dept_name:name});
        if(Dept_exist){
            let updated_dept=await Department.findOneAndUpdate({dept_name:name},{$set:
                {
                    dept_name:req.body.name
                }
            });
            Audit_Controller.prepareAudit(auditAction.auditAction.UPD_DEPT,`Updated to ${updated_dept.dept_name}`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
            logger.info('Update Department : ',`Update Department Successfully  | IP: ${req.socket.remoteAddress}`)
            res.status(200).send(`${name} is Updated to ${updated_dept.dept_name} Successfully `);
        }
        else{
            alert('Department not found ...')
            logger.error('pdate Department : ',`epartment not found | IP: ${req.socket.remoteAddress}`)
        }
    } 
    catch (err) {
        logger.error('Update Department : ',err.message);
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//Delete Department
const del_dept=async (req,res)=>{
    try {
        const token_data=await util.get_token(req);
        let name=req.params.name;
        let Dept_exist=await Department.findOne({dept_name:name});
        if(Dept_exist){
            await Department.findOneAndDelete({dept_name:name});
        Audit_Controller.prepareAudit(auditAction.auditAction.DEL_DEPT,`${name} Department is Deleted`,200,null,token_data,req.socket.remoteAddress,util.DateNow());
        logger.info('Delete Department : ',`${name} Department is Deleted Successfully  | IP: ${req.socket.remoteAddress}`)
        alert(`${name} Department is Deleted`);
        res.render('homePage');
        }
        else{
            alert('Department not found ...');
            logger.error('Delete Department : ',`Department not found | IP : ${req.socket.remoteAddress}`)
        }
    } catch (err) {
        logger.error('Delete Department : ',err.message);
        res.status(404).send('ERR MSG: '+err.message);
    }
}

module.exports={
    add_dept,
    all_depts,
    all_dept_name,
    select_dept,
    upd_dept,
    del_dept
}