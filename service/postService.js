
const Post = require('../models/post');
const UserService = require('../service/userService')
const AuthService = require('../service/authService')
const mongoose = require('mongoose')
const PostService = {   
    async getPostById(id) {
        try {
            const post = await Post.findById(id);
            return post;
        } catch (error) {
            console.error("Error finding post by id:", error.message);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            
            if (!mongoose.Types.ObjectId.isValid(postData.authorId)) {
                throw new Error('Invalid user');
            }
            const user = await UserService.findById(postData.authorId)
            if (!user){
                throw new Error("User doesnt exist")
            }
            postData.author = user.username
            if (user.status == "loggedout"){
                throw new Error("User is logged out")
            }
            const post = await Post.create(postData);
            return post;
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    },
    async deletePost(id) {
        try {
            const result = await Post.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new Error('Post not found');
            }
            return { success: true, message: 'Post deleted successfully' };
        } catch (err) {
            console.error('Error deleting post:', err.message);
            throw err;
        }
    },    
    async updatePost(data) {
        try {
            const post = await PostService.getPostById(data.postId);
            console.log(post)
            if (!post) {
                throw new Error("Post not found");
            }
            if (data.hasOwnProperty('title')) {
                post.title = data.title;
            }
            if (data.hasOwnProperty('content')) {
                post.content = data.content;
            }
            await post.save();
            return post;
        } catch (error) {
            console.error('Error updating post:', error.message);
            throw new Error('Failed to update post. ' + error.message);
        }
    },
    
    
    async readPost(id) {
        try {
            const post = PostService.getPostById(id);
            if (!post) {
                throw new Error("post not found")
            }
            return post;
        } catch (err) {
            console.error('Post not found:', err.message);
            throw err;
        }
    },
};

module.exports = PostService;
