// userService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { deleteUser } = require("../controllers/userController");

const UserService = {
  async findById(id) {
    try {
      return await User.findOne({ _id: id });
    } catch (error) {
      console.error("Error finding user by id:", error.message);
      throw error;
    }
  },
  async findByEmail(email) {
    try {
      return await User.findOne({ email: email });
    } catch (error) {
      console.error("Error finding user by email:", error.message);
      throw error;
    }
  },
  async findByUsername(username) {
    return User.findOne({ username: username }).lean();
  },
  async checkPassword(user, password) {
    return bcrypt.compare(password, user.password);
  },
  async addUser(data) {
    try {
      const { fullName, email, password } = data;
      const existingUser = await this.findByEmail(email);
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
  async deleteUser(data) {
    try {
      const pass = data.password;
      const user = await UserService.findByEmail(data.email);
      if (!user) {
        throw new Error("User not found");
      }
      const valid = await this.checkPassword(user, pass);
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
