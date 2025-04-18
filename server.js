import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'));

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) return res.status(400).json({ error: 'All fields required' });
  const blog = new Blog({ title, content, author });
  await blog.save();
  res.status(201).json(blog);
});

app.put('/api/blogs/:id', async (req, res) => {
  const { title, content, author } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  if (blog.author !== author) return res.status(403).json({ error: 'Unauthorized' });
  blog.title = title;
  blog.content = content;
  await blog.save();
  res.json(blog);
});

app.delete('/api/blogs/:id', async (req, res) => {
    const { author } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Not found' });
    if (blog.author !== author) return res.status(403).json({ error: 'Unauthorized' });
  
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
