const express = require("express");
const router = new express.Router();
const multer = require("multer");
const cloudinary = require("../helper/cloudinaryconfig");
const moment = require("moment");
const users = require("../model/userSchema");

// img storage path
const imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
});

// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(new Error("only images is allow"))
    }
}

const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})


// user register
router.post("/register",upload.single("photo"),async(req,res)=>{

    const upload = await cloudinary.uploader.upload(req.file.path);
    
    const {name} = req.body;
    
    try {
        const date = moment(new Date()).format("YYYY-MM-DD");
        
        const userdata = new users({
            name:name,
            imgpath:upload.secure_url,
            date:date
        });
        console.log(userdata)

        await userdata.save();
        res.status(200).json(userdata);
    } catch (error) {
        res.status(400).json(error)
    }
});



// user data get
router.get("/getdata",async(req,res)=>{
    try {
        const getUser = await users.find();
        res.status(200).json(getUser);

    } catch (error) {
        res.status(400).json(error)
        
    }
});


//Delete user data
router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;
    // console.log(userId);

    try {
        // Find the user by ID and remove it
        const deletedUser = await users.findByIdAndDelete(userId);

        if (!deletedUser) { 
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports = router;


