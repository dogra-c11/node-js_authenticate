var express=require("express")
var app=express()
var bodyparser=require("body-parser")
var bcrypt=require("bcrypt")
var users=[];
const session=require("express-session")
const flash=require("express-flash")//shows errors instead of writing in div in ejs files

var initializePassport=require("./passport-config")

var passport=require("passport")

initializePassport(passport,(email)=>{
    return users.find((user)=>user.email===email)//return the whole user object whose email is that
})//setting up a passport

app.use(bodyparser())

app.set("view-engine","ejs")

app.use(flash())

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
app.get("/",checkAuthenticated,(req,res)=>{
    res.render("index.ejs",{name:"Chirag"})
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/login",(req,res)=>{
    let {email,password}=req.body;
    // find the email in error of found compare passwords entered and entered while signinig up 
    //show u r not registered
    let foundemail=users.find((user)=>{
    return user.email===email
    })
    console.log("Fount email is",foundemail)

})

app.post("/login",passport.authenticate("local",{//(strategyused,what to do ) args of authenticate
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}))

app.post("/register",async (req,res)=>{//return promise so async
    try{
    let hashpassword= await bcrypt.hash(req.body.password,10); 
    let{name,email}=req.body;
    //check if user exists
    let foundemail=users.find((user)=>{
        return user.email===email
        })
        if(foundemail){
            res.redirect("/register",{error:"You are already registered"})
        }
        //insert into database
    users.push({
         name,email,password:hashpassword
    })
    res.redirect("/login")
    console.log(users)
}
catch(error){
    res.redirect("/register")
}
})

app.listen(3000,()=>{
    console.log("Server started")
})