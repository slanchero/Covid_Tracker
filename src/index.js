require("dotenv").config();

const express=require("express");
const morgan=require("morgan");
const path=require("path");


//Inicialization
const app=express();
require("./database");

//Server settings
app.set("port",process.env.PORT||3000);

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Routes
app.use("/api/covid",require("./routes/DataCovid"));

//Static files
app.use(express.static(path.join(__dirname,"public")));

//Start server
app.listen(app.get("port"),()=>console.log("Server on port:",app.get("port")));