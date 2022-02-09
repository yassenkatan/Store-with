const express=require('express');
const Department=require('../models/department');

//Add Department
const add_dept=async (req,res)=>{
    try {
        let Dept=new Department({
            dept_name:req.body.name
        });

        let saved=await Dept.save();
        res.status(200).send(saved.dept_name+' is New Department Added ...');

    } catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//All Department
const all_depts=async(req,res)=>{
    try {
        let all_dept=await Department.find({},{_id:0,dept_name:1});
        res.status(200).send('All Departments: \n'+all_dept);
    } catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//Search
const select_dept=async (req,res)=>{
    try {
        let id=req.params.id;
        let selected_dept=await Department.findById(id,{_id:0,dept_name:1});
        res.status(200).send(selected_dept);
    } catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//Update Department
const upd_dept=async (req,res)=>{
    try {
        let id=req.params.id;
        let updated_dept=await Department.findByIdAndUpdate(id,{$set:
            {
            name:req.body.name
            }
        });
        res.status(200).send(updated_dept);
    } catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }
}

//Delete Department
const del_dept=async (req,res)=>{
    try {
        let id=req.params.id;
        let deleted_dept=await Department.findByIdAndDelete(id);
        res.status(200).send(deleted_dept);
    } catch (err) {
        res.status(404).send('ERR MSG: '+err.message);
    }
}

module.exports={
    add_dept,
    all_depts,
    select_dept,
    upd_dept,
    del_dept
}