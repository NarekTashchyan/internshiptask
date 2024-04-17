// postService.js

const Post = require('../models/post');
const UserService = require('../services/userService');

const PostService = {
    async createPost(postData, userId) {
        try {
            const user = await UserService.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.status === "loggedout") {
                throw new Error("User is logged out");
            }
            
            const post = await Post.create(postData);
            return post;
        } catch (error) {
            console.error('Error creating post:', error.message);
            throw error;
        }
    },

    async getPostById(postId) {
        try {
            return await Post.findById(postId);
        } catch (error) {
            console.error("Error finding post by id:", error.message);
            throw error;
        }
    },

    async deletePost(postId, userId) {
        try {
            const user = await UserService.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.status === "loggedout") {
                throw new Error("User is logged out");
            }
            
            const result = await Post.deleteOne({ _id: postId });
            if (result.deletedCount === 0) {
                throw new Error("Post not found");
            }
            return { success: true, message: "Post deleted successfully" };
        } catch (error) {
            console.error('Error deleting post:', error.message);
            throw error;
        }
    },

    async updatePost(postId, postData, userId) {
        try {
            const user = await UserService.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.status === "loggedout") {
                throw new Error("User is logged out");
            }
            const result = await Post.updateOne({ _id: postId }, postData);
            if (result.nModified === 0) {
                throw new Error("Post not found or no changes were made");
            }
            return { success: true, message: "Post updated successfully" };
        } catch (error) {
            console.error('Error updating post:', error.message);
            throw error;
        }
    }
};

module.exports = PostService;
