import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CommunityFeed = ({ token, user }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/community/posts');
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/community/posts', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setContent('');
      setImage(null);
      fetchPosts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating post';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/community/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error liking post';
      alert(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/community/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error deleting post';
      alert(errorMsg);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex gap-4">
            <input 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Share your progress, a win, or a tip..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all">
              📷
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])} 
              />
            </label>
          </div >
          
          {image && (
            <div className="relative w-32 h-32">
              <img 
                src={URL.createObjectURL(image)} 
                className="w-full h-full object-cover rounded-xl border border-slate-600" 
                alt="Preview" 
              />
              <button 
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div >
          )}

          <button 
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all active:scale-95"
          >
            {loading ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      </motion.div>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div 
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                  {post.user?.name?.[0] || 'U'}
                </div >
                <div>
                  <h4 className="font-bold text-white">{post.user?.name}</h4>
                  <span className="text-slate-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div >
              </div >
              { (user?.id === post.user?._id || user?._id === post.user?._id) && (
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="text-slate-500 hover:text-red-500 transition-all p-2 opacity-0 group-hover:opacity-100"
                  title="Delete Post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 10V5a2 2 0 012-2h8a2 2 0 012 2v5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6M//M9 10l1 1m0-1l-1 1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6" />
                  </svg>
                </button>
              )}
            </div >
            
            {post.image && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-slate-700">
                <img 
                  src={`http://localhost:5000${post.image}`} 
                  className="w-full max-h-96 object-cover" 
                  alt="Post" 
                />
              </div >
            )}

            <p className="text-slate-300 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm"
              >
                <span className="text-lg">❤️</span>
                <span>{post.likes?.length || 0} likes</span>
              </button>
            </div >
          </motion.div>
        ))}
      </div >
    </div >
  );
};

export default CommunityFeed;
