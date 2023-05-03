const jwt = require("jsonwebtoken")

module.exports = function (req, res, next){
    const token = req.header('Authorization')
    
    if(!token){
        return res.status(200).send("Access Denied! You need to login first")
    }

    try{
        const TokenArray = token.split(" ");
        jwt.verify(TokenArray[1],process.env.AUTH_KEY,async(err, decoded)=>{
            if(decoded){
            req.user = decoded
            return next()
            }
            if(err){
                return res.status(200).send("Invalid Token")
            }
        })
    }
    catch(ex){      
       return res.status(200).send("Invalid Token")
    }
}