const express = require("express");
const router = express.Router();

const app = require("../app");
const db=require("../models");

app.post('/addDisease', async(req,res)=>{
    try{
        let disease= await db.Disease.create(req.body);
        return res.status(200).send(disease);
    }catch(error){
        return res.status(500).send(error);
    }
});

app.get('/diseases', async(req,res)=>{
    try{
        let disease= await db.Disease.findAll();
        return res.status(200).send(disease);
    }catch(error){
        return res.status(500).send(error);
    }
});

module.exports = router;