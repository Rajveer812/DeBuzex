const express=require('express');
const router = express.Router();
const {protect}=require('../middleware/authMiddleware');
const {createPost, getAllPosts, likePost, addSolution, starSolution, acceptSolution} = require('../controllers/postController')

router.get('/',getAllPosts)
router.post('/newpost',protect,createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/solution', protect, addSolution);
router.put('/:postId/solution/:solutionId/star', protect, starSolution);
router.put('/:postId/solution/:solutionId/accept', protect, acceptSolution);

module.exports=router;