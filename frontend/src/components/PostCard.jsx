import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import API from '../api';

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const isLiked = post.likes?.includes(user?._id);
  const isAuthor = post.author?._id === user?._id;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);

    try {
      const res = await API.put(`/posts/${post._id}/like`);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error('Failed to like post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const res = await API.post(`/posts/${post._id}/comment`, { text: commentText.trim() });
      if (onUpdate) onUpdate(res.data);
      setCommentText('');
    } catch (err) {
      console.error('Failed to comment:', err);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-slide-up hover-glow transition-all duration-300">
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white font-semibold text-sm group-hover:shadow-lg group-hover:shadow-accent-violet/20 transition-shadow">
              {post.author?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm group-hover:text-accent-violet transition-colors">
                {post.author?.username}
              </p>
              <p className="text-dark-400 text-xs">{timeAgo(post.createdAt)}</p>
            </div>
          </Link>
          {isAuthor && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-dark-400 hover:text-accent-rose hover:bg-dark-600/30 transition-all"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-3">
        <p className="text-dark-100 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-5 pb-3">
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-xl object-cover max-h-[500px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 flex items-center gap-4 border-t border-dark-600/20">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-all ${
            isLiked ? 'text-accent-rose' : 'text-dark-300 hover:text-accent-rose'
          }`}
        >
          <Heart
            className={`w-5 h-5 ${heartAnim ? 'animate-heart' : ''} ${isLiked ? 'fill-current' : ''}`}
          />
          <span className="font-medium">{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-dark-300 hover:text-accent-cyan transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 pb-4 border-t border-dark-600/20 animate-fade-in">
          {/* Comment List */}
          {post.comments?.length > 0 && (
            <div className="py-3 space-y-3 max-h-60 overflow-y-auto">
              {post.comments.map((comment, idx) => (
                <div key={comment._id || idx} className="flex gap-2.5">
                  <Link to={`/profile/${comment.user?._id}`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-pink to-accent-violet flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold">
                      {comment.user?.username?.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <div className="flex-1 bg-dark-700/40 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${comment.user?._id}`}
                        className="text-xs font-semibold text-dark-200 hover:text-accent-violet transition-colors"
                      >
                        {comment.user?.username}
                      </Link>
                      <span className="text-[10px] text-dark-500">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-dark-200 text-sm mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <form onSubmit={handleComment} className="flex gap-2 pt-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-dark-700/40 border border-dark-500/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-accent-violet/40 transition-colors"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isCommenting}
                className="p-2 rounded-xl text-accent-violet hover:bg-accent-violet/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
