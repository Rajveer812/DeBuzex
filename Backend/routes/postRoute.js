const express=require('express');
const router = express.Router();
const {protect}=require('../middleware/authMiddleware');
const {createPost, getAllPosts, likePost, addSolution, starSolution, acceptSolution, getUserPosts, getUserSolutions, deletePost} = require('../controllers/postController')
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.get('/',getAllPosts)
router.post('/newpost', protect, upload.array('images', 5), createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/solution', protect, addSolution);
router.put('/:postId/solution/:solutionId/star', protect, starSolution);
router.put('/:postId/solution/:solutionId/accept', protect, acceptSolution);
router.delete('/:id', protect, deletePost);

router.get('/user/:username/posts', protect, getUserPosts);
router.get('/user/:username/solutions', protect, getUserSolutions);

module.exports=router;