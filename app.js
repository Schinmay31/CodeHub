const express = require("express");
const bodyParser = require("body-parser");
var compiler = require("compilex");

const { dirname } = require("path");

var options = {stats : true}; 
compiler.init(options);

const app = express();

let codeOutput = "";
let codeInput="";
let userCodeInput="";
let userLang = "";

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use("/public",express.static(__dirname+"/public"));

app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
    res.render("main.ejs");
});

app.get("/home",function(req,res){
    res.render("main.ejs");
});

app.get("/code",function(req,res){
    compiler.flush(function(){
        console.log('All temporary files flushed !'); 
        });
    
    res.render("code.ejs",{
       code : codeOutput,
       input : codeInput,
       userCodeInput : userCodeInput,
    //    userLang : userLang,
    });
    codeInput="";
    codeOutput="";
    userCodeInput="";
    // userLang="";
 });

app.post("/code",function(req,res){

    let lang = req.body.lang;
    let code= req.body.code;
    let customInput = req.body.input;

    codeInput = code;
    userCodeInput = customInput;
    userLang = lang;

    console.log(lang);
    console.log(code);
    console.log(customInput);


    if(lang === "Java"){               // for java     //working
    
        if(userCodeInput === ""){
            let envData =   { OS : "windows" , cmd : "g++" };
            compiler.compileJava( envData , code , function(data){
             if(data.error){
                 codeOutput= data.error;
             }
             else{
                 codeOutput = data.output;
             }
             console.log(data.output);
             res.redirect("/code");
         });
        }
        else{
            let envData =   { OS : "windows" , cmd : "g++" };
            compiler.compileJavaWithInput( envData , code ,customInput, function(data){
             if(data.error){
                 codeOutput= data.error;
             }
             else{
                 codeOutput = data.output;
             }
             console.log(data.output);
             res.redirect("/code");
         });
        }
         
       }

    
   if(lang === "C"){         // for C and C++   // working
    
    if(userCodeInput === ""){
    var envData = { OS : "windows" , cmd : "g++",options : {setTimeout : 10}}; 
    compiler.compileCPP(envData , code , function (data) {
        if(data.error){
            codeOutput= data.error;
        }
        else{
            codeOutput = data.output;
        }
        res.redirect("/code");
     });
    }
    else{
        var envData = { OS : "windows" , cmd : "g++",options : {setTimeout : 10}}; 
    compiler.compileCPPWithInput(envData , code,customInput , function (data) {
        if(data.error){
            codeOutput= data.error;
        }
        else{
            codeOutput = data.output;
        }
        res.redirect("/code");
     });
    }
  }

if(lang === "Python"){         // for python   // Working

    if(userCodeInput === ""){
    var envData = { OS : "windows" }; 
    compiler.compilePython(envData , code , function (data) {
        if(data.error){
            codeOutput= data.error;
        }
        else{
            codeOutput = data.output;
        }
        res.redirect("/code");
});
    }
    else{
        compiler.compilePythonWithInput(envData , code,customInput , function (data) {
            if(data.error){
                codeOutput= data.error;
            }
            else{
                codeOutput = data.output;
            }
            res.redirect("/code");
    });
    }
}

});

app.get("/about",function(req,res){
    res.render("about.ejs");
});
app.listen(5000,function(){
    console.log("Server started on port 5000");
});





