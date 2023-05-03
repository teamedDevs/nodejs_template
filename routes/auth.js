const express = require("express");
const { Register, Login, getUser } = require("../controllers/auth");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", Register)
router.post("/login", Login)
router.get("/user", auth,getUser);

module.exports = router;