const bcrypt = require("bcryptjs");
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const jwtkey = process.env.Jwt_SECRET
const register = async (req,res) =>{
    try{
    const {name,email,password} = req.body;

     const existingUser = await User.findOne({email});
     if(existingUser){
       return res.status(403).json({"message":"User already exist"})
     }
     const hash = await bcrypt.hash(password,10);

     const newUser = new User({
        name,
        email,
        password:hash
     })
     await newUser.save();
     res.status(200).json({"message":"You have successfully registered"});
     console.log("user registered successfully")
    }


    
    catch(err){
        res.status(500).json({"error":err.message});
    }

}


const login = async(req,res)=>{
    try{ 
    const {email,password} = req.body
    const existingUser = await User.findOne({email})

    if(!existingUser){
        return res.status(403).json({"message":"User Doesnt exist"})
    }
   const isMatch = await bcrypt.compare(password,existingUser.password)
   if(!isMatch){
    return res.status(401).json({"message":"Wrong Password"})
   }
    const data = {
        id: existingUser._id,
        email:existingUser.email
    }
    const token = jwt.sign(data,jwtkey,{expiresIn:'1h'});
    res.status(200).json({token})
}catch(err){
    res.status(500).json({"error":err.message})
}
}

module.exports = {login,register}
