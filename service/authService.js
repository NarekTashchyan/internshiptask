// authService.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const UserService = require("../service/userService.js");

const AuthService = {
  registerUser: async (data) => {
    try {
      const { username, email, password } = data;
      if (!username) {
        throw new Error("Username is required");
      } else if (!email) {
        throw new Error("Email is required");
      } else if (!password) {
        throw new Error("Password is required");
      }
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: hashedPassword,
        status: "loggedin",
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
      const result = await User.deleteOne({ email: data.email });
      if (result.deletedCount === 0) {
        throw new Error("User not deleted");
      }
      return { success: true, message: "Post has been deleted successfully" };
    } catch (err) {
      console.error("Error", err.message);
      throw err;
    }
  },
  loginUser: async (data) => {
    try {
      const pass = data.password;
      const user = await UserService.findByEmail(data.email);
      const valid = user && (await UserService.checkPassword(user, pass));
      if (!valid) {
        throw new Error("Invalid email or password");
      }
      if (user.status === "loggedin") {
        throw new Error("User is already logged in");
      }
      user.status = "loggedin";
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  logoutUser: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.status = "loggedout";
      await user.save();
      return user;
    } catch (error) {
      console.error("Error logging out user:", error.message);
      throw error;
    }
  },
  retrieve: async (data) => {
    try {
      const pass = data.password;
      const user = await UserService.findByEmail(data.email);
      const valid = await UserService.checkPassword(user, pass);
      if (!user || !valid) {
        throw new Error("Either username or password is not correct");
      }
      return {
        "username": user.username,
        "email":user.email
      };
    } catch (error) {
      console.error("Error while retrieving user data", error.message);
      throw error;
    }
  },
  update: async (data, updateData) => {
    try {
      const pass = data.password;
      const user = await UserService.findByEmail(data.email);
      if (!user) {
        throw new Error("User with the provided email does not exist");
      }
      const valid = await UserService.checkPassword(user, pass);
      if (!valid) {
        throw new Error("Invalid password");
      }
      if (updateData.username) {
        user.username = updateData.username;
      }
      if (updateData.password) {
        user.password = await bcrypt.hash(updateData.password, 10);
      }
      if (updateData.email) {
        user.email = updateData.email;
      }
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AuthService;
