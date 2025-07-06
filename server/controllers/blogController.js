import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
  try {
    const blogData = JSON.parse(req.body.blog);
    const { title, subTitle, description, category, isPublished } = blogData;
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    const optimizedImageUrl = imagekit.url({
      src: response.url, // ✅ use 'src' not 'path'
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished
    });

    fs.unlinkSync(imageFile.path);

    res.json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


export const getAllBlogs = async (req, res)=>{
    try {
        const blogs = await Blog.find({isPublished: true})
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogById = async (req, res)=>{
    try {
        const {blogId} =req.params;
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({ success: true, blog });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteBlogById = async (req, res)=>{
    try {
        const { id } =req.body;
        await Blog.findByIdAndDelete(id);


        //delete all comments associated with the blog
        await Comment.deleteMany({blog: id});



        res.json({ success: true,message:'Blog deleted successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const togglePublish =async (req, res) =>{
    try {
        const { id } =req.body;
        const blog = await Blog.findById(id);
        blog.isPublished =!blog.isPublished;
        await blog.save();
        res.json({ success: true,message:'Blog status updated' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const addComment = async(req, res) =>{
        try {
            const {blog, name, content} = req.body;
            await Comment.create({blog, name, content});
            res.json({ success: true, message: 'comment added for review' });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
}

export const getBlogComments = async(req, res) =>{
    try {
        const {blogId} = req.body;
        const comments =await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const generateContent = async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.json({ success: false, message: 'A valid prompt is required' });
      }
      console.log('Processing prompt for AI:', prompt); // Log input prompt
      const fullPrompt = `${prompt}. Please provide a detailed blog post in simple text format with an introduction, main body, and conclusion, written for a general audience.`; // Enhanced prompt
      console.log('Sending to main function with prompt:', fullPrompt); // Log full prompt
      const content = await main(fullPrompt);
      console.log('Received from main function:', content); // Log raw response
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid or empty content received from AI service');
      }
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error in generateContent:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : 'No response data',
        details: error.cause || 'No additional details',
      }); // Detailed error log
      let errorMessage = `Failed to generate content: ${error.message}. Please check the prompt or API configuration.`;
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.error && parsedError.error.message) {
          errorMessage = `Failed to generate content: ${parsedError.error.message}`;
        }
      } catch (parseError) {
        console.error('Failed to parse error message:', parseError);
      }
      res.json({ success: false, message: errorMessage });
    }
  };