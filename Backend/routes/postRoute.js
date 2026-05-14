const express=require('express');
const router = express.Router();
const {protect}=require('../middleware/authMiddleware');
const {createPost, getAllPosts, likePost, addSolution} = require('../controllers/postController')

router.get('/',getAllPosts)
router.post('/newpost',protect,createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/solution', protect, addSolution);

module.exports=router;