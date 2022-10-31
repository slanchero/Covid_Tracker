const{Router}=require("express");

router=Router();

const Data=require("../models/Data");

router.get("/",async()=>{
    const data=await Data.find();
    res.json(data);
});

router.get("/data/:id",async (req,res)=>{
    const data=await Data.find({iso_code:req.params.id});
    res.json(data);
});
router.get("/countries",async (req,res)=>{
    const data=await Data.aggregate([
        {
            $group:{
                "_id": "$iso_code",
                "location": {
                    $addToSet: "$location"
                 }
            }
         }
    ]   );
    res.json(data);
});
router.get("/muerte/:id",async(req,res)=>{
    const data=await Data.find({iso_code:req.params.id},{location:true,total_deaths:true,new_deaths:true,new_deaths_smoothed:true,population:true,date:true}).sort({date:1});
    res.json(data);
});


module.exports=router;