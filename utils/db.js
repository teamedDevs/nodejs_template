const mongoose = require("mongoose");

const connection = process.env.DB_URL;

const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(`${connection}`,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })

        console.log(`Connected To DB`);
    }
    catch(error){
        console.log("mongoose error..."+error)
    }
}


module.exports = connectDb;