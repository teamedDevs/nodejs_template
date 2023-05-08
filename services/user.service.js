const User = require("../models/User.js");

//get all users

exports.getAllUsers = async() => {
  try{
    const users = await User.find({});
    return users;
  }catch(error) {
    throw error;
  }
};
//get user by id

exports.getUserById = async(userId)=>{
  try{
    const user = await User.findById(userId);
    if(!user) throw new Error('User not found');
    return user;
  }catch(error) {
    throw error;
  }
};

exports.updateUser = async(userId,userData) => {
     try{
      const user = await User.findByIdAndUpdate(userId,userData,{new:true});
      if(!user) throw new Error('User not found');
      return user;
     }catch(error) {
      throw error;
     }
};

exports.deleteUser = async(userId) => {
  try{
    const user = await User.findByIdAndDelete(userId);
    if(!user) throw new Error('User not found');
    return user;
  }catch(error) {
    throw error;
  }
};