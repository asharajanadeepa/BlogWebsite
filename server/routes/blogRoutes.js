import express from 'express';
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from '../controllers/blogController.js';
import upload from '../middleware/multer.js'; 
import auth from '../middleware/auth.js';

const blogRouter = express.Router();

// Specific routes first
blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.post('/generate', auth, generateContent); // Move this BEFORE /:blogId
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);

// General routes
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById); // Move this AFTER /generate

export default blogRouter;