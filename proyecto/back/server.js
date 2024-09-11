const express = require("express")
const app = express ();
const port = 3000;
app.get('/',(req,res)=>{
    res.send("servidor de prueva")
})
app.listen(port,()=>{
    console.log("servidor corriendo")
})