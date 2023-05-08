const express = require("express");
const { 
   getUserById,
   updateUser,
   deleteUser,
   getAllUsers
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth,getAllUsers);
router.get("/:id", auth,getUserById);
router.put("/update/:id", auth,updateUser);
router.delete("/delete/:id", auth,deleteUser);

module.exports = router;