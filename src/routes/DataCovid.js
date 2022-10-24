const{Router}=require("express");

router=Router();

const Data=require("../models/Data");

router.get("/:iso",async (req,res)=>{
    const data=await Data.find({iso_code:req.params.iso});
    res.json(data);
});

// router.post("/",async(req,res)=>{
//     const {titulo}=req.body;
//     const newData=new Data({titulo});
//     newData.save();
//     res.send("resivido");
// });

module.exports=router;