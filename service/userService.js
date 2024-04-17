// userService.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { deleteUser } = require("../controllers/userController");

const UserService = {
  findById: async (id) => {
    try {
      return await User.findOne({ _id: id });
    } catch (error) {
      console.error("Error finding user by id:", error.message);
      throw error;
    }
  },
  findByEmail: async (email) => {
    try {
      return await User.findOne({ email: email });
    } catch (error) {
      console.error("Error finding user by email:", error.message);
      throw error;
    }
  },
  findByUsername: async (username) => {
    return User.findOne({ username: username }).lean();
  },
  checkPassword: async (user, password) => {
    return bcrypt.compare(password, user.password);
  },
  addUser: async (data) => {
    try {
      const { fullName, email, password } = data;
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
      };

      const user = new User(newUser);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error adding user:", error.message);
      throw error;
    }
  },
  deleteUser: async (data) => {
    try {
      const pass = data.password;
      const user = await UserService.findByEmail(data.email);
      if (!user) {
        throw new Error("User not found");
      }
      const valid = await UserService.checkPassword(user, pass);
      if (!valid) {
        throw new Error("Password is incorrect");
      }
      const result = await User.deleteOne({ email: data.email });
      if (result.deletedCount === 0) {
        throw new Error("User not deleted");
      }
      return { success: true, message: "Post has been deleted successfully" };
    } catch (err) {
      console.error("Error", err.message);
      throw err;
    }
  }
};


module.exports = UserService;
