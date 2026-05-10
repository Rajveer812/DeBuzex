const express=require('express');
const router = express.Router();
const {protect}=require('../middleware/authMiddleware');
const {createPost,getAllPosts} =require('../controllers/postController')

router.get('/',getAllPosts)
router.post('/newpost',protect,createPost);

module.exports=router;