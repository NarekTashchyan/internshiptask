// postService.js
const Post = require("../models/post");
const UserService = require("../service/userService");
const AuthService = require("../service/authService");
const mongoose = require("mongoose");
const PostService = {
    getPostById : async (id)  =>{
    try {
      return await Post.findOne({ _id: id });
    } catch (error) {
      console.error("Error finding post by id:", error.message);
      throw error;
    }
  },
  createPost: async (postData) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(postData.authorId)) {
        throw new Error("Invalid user");
      }
      const user = await UserService.findById(postData.authorId);
      if (!user) {
        throw new Error("User doesnt exist");
      }
      if (user.status == "loggedout") {
        throw new Error("User is logged out");
      }
      const post = await Post.create(postData);
      return post;
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  },
  getPostById: async (postId) => {
    try {
      const post = await Post.findById(postId);
      return post;
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  },
  deletePost: async (id) => {
    try {
      const result = await Post.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error("Post not found");
      }
      return { success: true, message: "Post deleted successfully" };
    } catch (err) {
      console.error("Error deleting post:", err.message);
      throw err;
    }
  },
  updatePost :async (data)  => {
    try {
      const result = await Post.findOneAndUpdate({ _id: data._id }, data);
      if (result.nModified == 0) {
        throw new Error("Nothing changed");
      }
      return { success: true, message: "Post updated successfully" };
    } catch (err) {
      console.error("Error updating post:", err.message);
      throw err;
    }
  },

  readPost: async (id) => {
    try {
      const post = PostService.getPostById(id);
      if (!post) {
        throw new Error("post not found");
      }
      return post;
    } catch (err) {
      console.error("Post not found:", err.message);
      throw err;
    }
  },
};

module.exports = PostService;
