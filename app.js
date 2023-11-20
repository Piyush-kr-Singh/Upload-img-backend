require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");

const cors = require("cors");
const router = require("./routes/router");
const port = 4004;




const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  

app.use(express.json());
// app.use(cors()); 
app.use(router);


app.get('/',(req,res)=>
{
    res.send("How to upload image in project of MERN Stack...!!");
})

app.listen(port,()=>{
    console.log(`server start at port no ${port}`)
});

