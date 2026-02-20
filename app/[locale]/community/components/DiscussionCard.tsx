'use client';

import { Discussion } from '@/app/lib/data';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface DiscussionCardProps {
  discussion: Discussion;
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  const t = useTranslations('Community.card');
  // Likes
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(discussion.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return; // Prevent double-clicks

    setIsLiking(true);

    // Optimistic UI update
    const previousLiked = liked;
    const previousLikes = likes;

    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      const res = await fetch(`http://localhost:8000/api/discussions/${discussion._id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to update like');

      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setIsLiking(false);
    }
  };

  // Comments
  const [comments, setComments] = useState(discussion.comments);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const handleAddComment = async () => {
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);

    // Optimistic UI update
    const previousComments = comments;
    setComments(comments + 1);

    try {
      const res = await fetch(`http://localhost:8000/api/discussions/${discussion._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      });

      if (!res.ok) throw new Error('Failed to add comment');

      const data = await res.json();
      setComments(data.comments);
      setCommentText('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert on error
      setComments(previousComments);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={discussion.user.avatar}
          alt={discussion.user.name}
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
        <div>
          <h4 className="font-semibold text-gray-900 leading-tight">
            {discussion.user.name}
          </h4>
          <span className="text-xs text-gray-500">{discussion.time}</span>
        </div>
        <span className="ml-auto px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg">
          {discussion.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
        {discussion.title}
      </h3>
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {discussion.excerpt}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex items-center gap-4">

          {/* Like */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-all ${liked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
              } ${isLiking ? 'cursor-wait opacity-70' : ''}`}
          >
            <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i>
            <span className="text-sm font-medium">{likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowCommentInput(prev => !prev)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-all"
          >
            <i className="far fa-comment"></i>
            <span className="text-sm font-medium">{comments}</span>
          </button>
        </div>

        <button className="text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition">
          {t('viewThread')}
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('writeComment')}
            className="flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={isCommenting}
            className={`px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition ${isCommenting ? 'cursor-wait opacity-70' : ''}`}
          >
            {isCommenting ? t('posting') : t('post')}
          </button>
        </div>
      )}
    </div>
  );
}
