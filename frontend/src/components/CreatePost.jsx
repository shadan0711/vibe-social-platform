import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ImagePlus, Send, X } from 'lucide-react';
import API from '../api';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (image) formData.append('image', image);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setContent('');
      removeImage();
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-none resize-none text-white placeholder-dark-400 focus:outline-none text-[15px] leading-relaxed min-h-[60px]"
              rows={2}
              maxLength={2000}
            />

            {preview && (
              <div className="relative mt-3 rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-dark-900/80 rounded-full flex items-center justify-center text-white hover:bg-accent-rose/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-600/30">
              <div className="flex gap-1">
                <input
                  type="file"
                  ref={fileRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="p-2 rounded-lg text-dark-300 hover:text-accent-cyan hover:bg-dark-600/30 transition-all"
                  title="Add image"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!content.trim() && !image)}
                className="px-5 py-2 rounded-xl btn-gradient text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Post
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
