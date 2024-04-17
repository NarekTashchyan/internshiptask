// postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import the postController module

// Define routes for each operation
router.post('/', postController.createPost);
router.get('/read', postController.readPost);
router.put('/update', postController.updatePost);
router.delete('/delete', postController.deletePost);


module.exports = router;

