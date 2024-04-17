// postController.js

const PostService = require("../service/postService");

exports.createPost = async (req, res) => {
  try {
    const post = await PostService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await PostService.getPostById(postId);
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await PostService.updatePost(postId, req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await PostService.deletePost(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
    try {
        // Extract the post ID and updated data from the request body
        const post = await PostService.getPostById(req.body._id);
        const updatedData = req.body;

        // Call the service method to update the post
        const updatedPost = await PostService.updatePost(updatedData);

        // Send a success response with the updated post
        res.status(200).json({message: 'Post updated successfully'});
    } catch (error) {
        // Handle errors
        console.error('Error updating post:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update post', error: error.message });
    }
};

exports.readPost = async (req, res) => {
    try{
        const post = await PostService.readPost(req.body.id);
        if (!post) {
            res.json({
                message: "Post not found",
            });
        }
        res.status(200).json({
            author: post.author,
            title: post.title,
            content: post.body,
        });
    }
    catch(err){
        return res.status(404).json("Post not Found")
    }
};
