// authController.js
const { use } = require('../routes/postRoutes');
const AuthService = require('../service/authService');
const UserService = require('../service/userService');

exports.registerUser = async (req, res) => {
    try {
        console.log("jdgsj");
        console.log(req.body);
        const userData = req.body;
        const newUser = await AuthService.registerUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.loginUser({ email, password });
        res.json({ message: 'Login successful', user });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            res.status(401).json({ message: 'Invalid email or password' });
        } else if (error.message === "User is already logged in") {
            res.status(403).json({ message: 'User is already logged in' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const user = await UserService.findByEmail(req.body.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else if (user.status === "loggedout") {
            throw new Error("User is already logged out");
        }
        user.status = "loggedout";
        await user.save();

        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserService.deleteUser(req.body);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.retrieveUserData = async (req, res) => {
    try {
        const user = await AuthService.retrieve(req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({user});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateUserData = async (req, res) => {
    try{
        const user = await AuthService.update(req.body.data, req.body.updateData)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({user})
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}



