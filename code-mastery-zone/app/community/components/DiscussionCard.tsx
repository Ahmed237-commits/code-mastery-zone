'use client';

import { Discussion } from '@/app/lib/data';
import { useState } from 'react';

interface DiscussionCardProps {
  discussion: Discussion;
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  // Likes
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(discussion.likes);

  const handleLike = () => {
    if (liked) {
      setLikes(l => l - 1);
    } else {
      setLikes(l => l + 1);
    }
    setLiked(!liked);
  };

  // Comments
  const [comments, setComments] = useState(discussion.comments);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    setComments(c => c + 1);
    setCommentText('');
    setShowCommentInput(false);
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
            className={`flex items-center gap-1.5 transition-all ${
              liked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
            }`}
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
          View Thread
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
