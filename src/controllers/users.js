const UserModel = require('../models/users')

const getAllUsers = async (req, res) => {
    try {
        const [data] = await UserModel.getAllUsers();
    
        res.json({
            message: 'get all user succes',
            data: data
    })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            serverMessage: error,
        })
    }

}

const createNewUser = async (req, res) => {
    const {body} = req;

    if(!body.email || !body.name || !body.address) {
        return res.status(400).json({
            message: 'kamu mengirimkan data yang salah',
            data: null
        })
    }
    try {
        await UserModel.createNewUser(body)
        res.status(201).json({
            message: 'create new user succes',
            data: req.body
        })
    } catch (error) {
         res.status(500).json({
            message: 'server error',
            serverMessage: error,
        })
    }
}

const updateUser = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    try {
        await UserModel.updateUser(body, id)
        res.json({
            message: 'update user succes',
            data: {
                id: id,
                ...body
            },
        })
    } catch (error) {
         res.status(500).json({
            message: 'server error',
            serverMessage: error,
        })
    }

}

const deleteUser = async (req, res) => {
    const {id} = req.params

    try {
        await UserModel.deleteUser(id)
        res.json({
            message: 'delete user succes',
            data: null
        })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            serverMessage: error,
        })
    }
}
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}