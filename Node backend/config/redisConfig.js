const {createClient} = require("redis");

var client = "";

 const connect=async ()=>{
    client=createClient({url:"redis://127.0.0.1:6379"});
    client.on("error", (err)=>console.log("error"));
    await client.connect();
 }

 connect();

module.exports=client;
