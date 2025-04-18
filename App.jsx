import React, { useEffect, useState } from 'react';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const currentUser = 'user';

  const fetchBlogs = async () => {
    const res = await fetch('http://localhost:5000/api/blogs');
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('Fields required');

    const payload = { title, content, author: currentUser };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/blogs/${editingId}`
      : 'http://localhost:5000/api/blogs';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setTitle('');
    setContent('');
    setEditingId(null);
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser }),
    });
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditingId(blog._id);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Blog CMS</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
          style={{ display: 'block', width: '100%', height: 100, marginBottom: 8 }}
        />
        <button type="submit">{editingId ? 'Update' : 'Create'} Blog</button>
      </form>
      <hr />
      {blogs.map((b) => (
        <div key={b._id} style={{ borderBottom: '1px solid #ddd', marginBottom: 10 }}>
          <h3>{b.title}</h3>
          <p>{b.content}</p>
          <small>Author: {b.author}</small><br />
          {b.author === currentUser && (
            <>
              <button onClick={() => handleEdit(b)}>Edit</button>
              <button onClick={() => handleDelete(b._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
