//all configuration of passports in this

const localStrategy=require("passport-local");//validating a form then only we move forward
const bcrypt=require("bcrypt")


function initialize(passport,getuserbyemail){//we overrided usernamefield with email 

    const authenticatedUser=async (email,passport,done)=>{//this functions tells how to authenticate the user
        const user=getuserbyemail(email);//retuuns a user object if any
        if(user===null){
            return done(null,false,{message:"NO user with that email fount"})//done tells i have authenticated done(error,isuserauthenticated(boolean),message))
            
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                //send an event user registerd
                done(null,user)//if user is authenticated send the user who is authenticate in place of false
            }
            else{
                return done(null,false,{message:"Password is incorrect"})
            }
        }
        catch(error){
            return done(error)
        }


    };
    passport.use(new localStrategy({usernamefield="email"}),//it has all form data 
    authenticatedUser)
    //{{usernamefield:"username",passwordfield="password"}} default options

   passport.serializeUser((user,done) => done(null,user.id))//to caary forward to other pages authenticate user and make a session
    passport.deserializeUser((user,done) => {//sending cookie to user with every requeest is deserializing(sending additional info)
        return done(null,getuserbyId(id))
    })  
}


module.exports=initialize//to use this function in other js files we export