import { useState, useEffect } from 'react';
import CreatePost from './CreatePost.jsx';
import PostCard from './PostCard.jsx';
import { Zap } from 'lucide-react';
import API from '../api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CreatePost onPostCreated={handlePostCreated} />

      <div className="space-y-5">
        {posts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <Zap className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-300 mb-1">No vibes yet</h3>
            <p className="text-dark-400 text-sm">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
