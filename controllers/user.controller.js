const userService = require("../services/user.service");

exports.getAllUsers = async (req, res) => {
    try{
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    }catch(error) {
        return res.status(500).json(error);
    }
};
exports.getUserById = async (req, res) => {
    try{
      const user = await userService.getUserById(req.params.id);
      return res.status(200).json(user);

    }catch(error) {
       return res.status(500).json(error);
    }
};

exports.updateUser = async (req, res) => {
    try{
        const user = await userService.updateUser(req.params.id,req.body);
        return res.status(200).json(user);
    }catch(error) {
        return res.status(500).json(error);
    }
};

exports.deleteUser = async (req, res) => {
    try{
        const user = await userService.deleteUser(req.params.id);
        return res.status(200).json(user);
    }catch(error) {
        return res.status(500).json(error);
    }
}