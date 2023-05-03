const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

exports.Register = async(req,res)=>{
 try{
     let userExist = await User.find({email: req.body.email});
     if(userExist.length<=0){

        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(
                          `${req.body.password}`,
                          salt
                        );
                        req.body.password = hash;

         let saveUser = new User(req.body);
         let userInfo = await saveUser.save();
         const userId = userInfo._id;
        const token = jwt.sign(
          { userId },
          process.env.AUTH_KEY
        );
     
        console.log(userExist)
         return res.status(200).send({user: userInfo,success: true,token: token});
     }else{
         return res.status(200).send({message: `Email had already taken, please try different email address`,success: false})
     }

 }
 catch(error){
     console.log(error)
     return res.status(400).send(error);
 }
}

exports.Login = (req, res) => {
  try{
    let { email, password } = req.body;
    email = req.body.email.toLowerCase()
  
    User.findOne({ email }).then((result) => {
      if (result) {
        let dbPass = result.password;
        const valid = bcrypt.compareSync(`${password}`, dbPass);
  
        if (valid) {
          const userId = result._id;
          const token = jwt.sign(
            { userId },
            process.env.AUTH_KEY
          );

          console.log("userInfo", result)

          return res.send({ error: false, message: "Logged in successfully",token: token, user: result });
        } else {
          return res.send({ error: "Incorrect email or password" });
        }
      } else {
        return res.send({ error: "Incorrect email or password" });
      }
    });
  }
  catch(error){
    console.log(error)
    return res.status(400).send(error)
}
  };

  exports.getUser = async(req,res)=>{
    try{
      let userId = req.user?.userId;
      let info = await User.findOne({_id: mongoose.Types.ObjectId(userId)});    
       return res.status(200).json(info);
    }
    catch(error){
     console.log(error)
     res.status(400).json(error)
    }
  }