import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Check, CheckCheck, X } from 'lucide-react';
import API from '../api';

export default function Notifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? res.data : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-accent-rose fill-accent-rose" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-accent-cyan" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-accent-violet" />;
      default:
        return null;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'like':
        return 'bg-accent-rose/15';
      case 'comment':
        return 'bg-accent-cyan/15';
      case 'follow':
        return 'bg-accent-violet/15';
      default:
        return 'bg-dark-600/30';
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-96 max-h-[520px] glass-card rounded-2xl overflow-hidden animate-fade-in z-50 shadow-2xl shadow-black/40"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-dark-600/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-accent-violet/20 text-accent-violet rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="p-1.5 rounded-lg text-dark-300 hover:text-accent-cyan hover:bg-dark-600/30 transition-all"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-300 hover:text-white hover:bg-dark-600/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[440px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 px-5">
            <div className="w-12 h-12 rounded-full bg-dark-600/30 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-dark-400" />
            </div>
            <p className="text-dark-400 text-sm">No notifications yet</p>
            <p className="text-dark-500 text-xs mt-1">
              When someone likes, comments, or follows you, it will show up here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => !notification.read && markAsRead(notification._id)}
              className={`flex items-start gap-3 px-5 py-3.5 border-b border-dark-600/15 cursor-pointer transition-all hover:bg-dark-600/20 ${
                !notification.read ? 'bg-accent-violet/[0.04]' : ''
              }`}
            >
              {/* Sender avatar */}
              <Link
                to={`/profile/${notification.sender?._id}`}
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white text-sm font-semibold">
                    {notification.sender?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full ${getIconBg(notification.type)} flex items-center justify-center ring-2 ring-dark-800`}>
                    {getIcon(notification.type)}
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-100 leading-snug">
                  {notification.message}
                </p>
                <p className="text-[11px] text-dark-500 mt-1">
                  {timeAgo(notification.createdAt)}
                </p>
              </div>

              {/* Unread dot */}
              {!notification.read && (
                <div className="flex-shrink-0 mt-2">
                  <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
