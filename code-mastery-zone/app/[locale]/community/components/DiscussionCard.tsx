'use client';

import { Discussion } from '@/app/lib/data';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

interface DiscussionCardProps {
  discussion: Discussion;
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {

  const t = useTranslations('Community.card');
  const { data: session } = useSession();

  const [likes, setLikes] = useState(discussion.likes || 0);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState(
    discussion.comments?.length || 0
  );

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);


  // =========================
  // Like Discussion (Backend)
  // =========================
  const handleLike = async () => {

    if (!session?.accessToken) {
      alert("Login required");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    try {

      const res = await fetch(
        `http://localhost:8000/api/discussions/${discussion._id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setLikes(data.likes);
      setLiked(data.liked);

    } catch (error) {

      console.error("Like error:", error);

    } finally {

      setIsLiking(false);

    }

  };


  // =========================
  // Add Comment
  // =========================
  const handleAddComment = async () => {

    if (!session?.accessToken) {
      alert('You must be logged in to comment.');
      return;
    }

    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);

    try {

      const res = await fetch(
        `http://localhost:8000/api/discussions/${discussion._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`
          },
          body: JSON.stringify({
            content: commentText
          })
        }
      );

      if (!res.ok) throw new Error("Failed to comment");

      const data = await res.json();

      setComments(data.comments);
      setCommentText('');
      setShowCommentInput(false);

    } catch (error) {

      console.error("Comment error:", error);

    } finally {

      setIsCommenting(false);

    }

  };


  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl transition-all">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={discussion.theuser?.avatar || '/default-avatar.png'}
          alt={discussion.theuser?.name || 'User'}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {discussion.theuser?.name}
          </h4>

          <span className="text-xs text-gray-500">
            {discussion.time}
          </span>
        </div>

        <span className="ml-auto text-xs bg-indigo-100 px-2 py-1 rounded">
          {discussion.category}
        </span>
      </div>


      {/* Content */}
      <h3 className="text-lg font-bold mb-2">
        {discussion.title}
      </h3>

      <p className="text-gray-600 text-sm mb-6">
        {discussion.excerpt}
      </p>


      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-4">

        <div className="flex items-center gap-4">

          {/* Like */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 ${
              liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            <i className={`${liked ? "fas" : "far"} fa-heart`} />
            <span>{likes}</span>
          </button>


          {/* Comment */}
          <button
            onClick={() => {

              if (!session?.accessToken) {
                alert("Login required");
                return;
              }

              setShowCommentInput(!showCommentInput);

            }}
            className="flex items-center gap-1 text-gray-500"
          >
            <i className="far fa-comment" />
            <span>{comments}</span>
          </button>

        </div>

      </div>


      {/* Comment Input */}
      {showCommentInput && (

        <div className="mt-4 flex gap-2">

          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t("writeComment")}
            className="flex-1 border px-3 py-2 rounded"
          />

          <button
            onClick={handleAddComment}
            disabled={isCommenting}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {isCommenting ? "Posting..." : "Post"}
          </button>

        </div>

      )}

    </div>
  );
}