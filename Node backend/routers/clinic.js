const express = require("express");
const router = express.Router();
const app = require("../app");
const db=require("../models");

app.post('/addClinic', async(req,res)=>{
    try{
        let clinic= await db.Clinic.create(req.body);
        return res.status(200).send(clinic);
    }catch(error){
        return res.status(500).send(error);
    }
});

app.get('/getAllClinics',async(req,res)=>{
    try{
        let allClinics= await db.Clinic.findAll();
        return res.status(200).send(allClinics);
    }catch(error){
        return res.status(500).send(error);
    }
});
module.exports = router;