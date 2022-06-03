const express = require("express");
const request= require("request");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const items =["Meeting with client1","Meeting with client 2","Meeting 3"];
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  res.sendFile(__dirname +"/signup.html");
});
app.post("/failed",(req,res)=>{
  res.redirect("/");
})
app.post("/",(req,res)=>{
  const firstname=req.body.fname;
  const lastname=req.body.middle;
  const email =req.body.email;
    // res.send("<h1>Hello Mr."+req.body.fname+"signup successful")
 console.log( firstname);
 console.log(lastname);
 console.log(email);
 const data ={
   members:[
      {email_address: email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstname,
          LNAME:lastname
        }
      }
   ]
 };
 const jsonData=JSON.stringify(data);
 const url="https://us12.api.mailchimp.com/3.0/lists/8ffb1b7c83";
 const options ={
   method:"POST",
   auth:"vikash:b113153fd8dba7ee3d82c0671095d024-us12"
 }
 const request = https.request(url,options,function(response){
   if(response.statusCode==200){
    //  res.sendFile(__dirname + "/success.html")
    res.redirect("/ToDoList");
   }
   else{
    res.sendFile(__dirname + "/failure.html")
   }
response.on("data",function(data){
  console.log(JSON.parse(data));
})
 })
 request.write(jsonData);
 request.end();


});
app.get("/ToDoList",function(req,res){
  
  const day =date.getDate();
  res.render("list",{kindOfDay:day,newListItems:items});
  });
  app.post("/ToDoList",function(req,res){
  var item=req.body.newItem;
  
  items.push(item);
  res.redirect("/ToDoList");
  });
app.listen(process.env.PORT||3000,()=>{
    console.log("server running at 3000 port")
});
// 8988030e0e
// b113153fd8dba7ee3d82c0671095d024-us12 8ffb1b7c83