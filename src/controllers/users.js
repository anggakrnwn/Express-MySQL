const UserModel = require("../models/users");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const data = await UserModel.getAllUsers();

    res.json({
      message: "get all user succes",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error,
    });
  }
};

const createNewUser = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.name || !body.address || !body.password) {
    return res.status(400).json({
      message: "Missing required fields",
      data: null,
    });
  }
  if (body.role_id && req.user.role !== 2) {
    return res.status(403).json({ message: "Only admin can set roles" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    await UserModel.createNewUser({ ...body, password: hashedPassword });
    res.status(201).json({
      message: "create new user success",
      data: { ...body, password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await UserModel.updateUser(body, id);
    res.json({
      message: "update user succes",
      data: {
        id: id,
        ...body,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await UserModel.deleteUser(id);
    res.json({
      message: "delete user succes",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error,
    });
  }
};
module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
