import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from './PostCard.jsx';
import { UserPlus, UserCheck, Calendar, FileText } from 'lucide-react';
import API from '../api';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?._id === id;
  const isFollowing = profile?.followers?.includes(currentUser?._id);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    }
  };

  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      const res = await API.put(`/users/${id}/follow`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    } finally {
      setFollowLoading(false);
    }
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

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-dark-300">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-violet via-accent-cyan to-accent-pink p-[3px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
              <span className="text-3xl font-bold gradient-text">
                {profile.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isFollowing
                      ? 'bg-dark-600/50 text-dark-200 hover:bg-accent-rose/20 hover:text-accent-rose border border-dark-500/30'
                      : 'btn-gradient text-white'
                  }`}
                >
                  {followLoading ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                  ) : isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>

            {profile.bio && (
              <p className="text-dark-200 text-sm mb-3">{profile.bio}</p>
            )}

            <div className="flex items-center justify-center sm:justify-start gap-5 text-sm">
              <div className="text-center">
                <span className="font-bold text-white block">{profile.postCount || 0}</span>
                <span className="text-dark-400 text-xs">Posts</span>
              </div>
              <div className="w-px h-8 bg-dark-600/30"></div>
              <div className="text-center">
                <span className="font-bold text-white block">{profile.followersCount || 0}</span>
                <span className="text-dark-400 text-xs">Followers</span>
              </div>
              <div className="w-px h-8 bg-dark-600/30"></div>
              <div className="text-center">
                <span className="font-bold text-white block">{profile.followingCount || 0}</span>
                <span className="text-dark-400 text-xs">Following</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-dark-400 text-xs justify-center sm:justify-start">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-dark-400" />
        <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Posts</h2>
      </div>

      <div className="space-y-5">
        {posts.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <p className="text-dark-400 text-sm">
              {isOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
            </p>
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
