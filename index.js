require("dotenv").config();
const connectDb = require("./utils/db")
connectDb();
const express = require("express");
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
const cors = require("cors");
const auth = require("./middlewares/auth");
app.use(cors({origin: "*"}));

app.get("/", (req,res)=>{
    res.json("Nodejs Template api")
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/user", require("./routes/user.route"))
app.get("/another", auth, (req,res)=> {
    res.json("Another api")
})
const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`)
})