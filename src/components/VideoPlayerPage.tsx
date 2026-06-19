import React, { useState, useEffect } from "react";
import { useYouTube } from "../context/YouTubeContext";
import { Video, Comment } from "../types";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Scissors,
  CheckCircle,
  MoreHorizontal,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  CornerDownRight,
  Send,
  Trash2,
} from "lucide-react";

export const VideoPlayerPage: React.FC = () => {
  const {
    currentPlayingVideo,
    setCurrentPlayingVideo,
    videos,
    subscribedChannels,
    toggleSubscribe,
    likedVideos,
    dislikedVideos,
    toggleLikeVideo,
    toggleDislikeVideo,
    addVideoToHistory,
    watchLaterVideos,
    toggleWatchLater,
    commentsByVideo,
    addComment,
    deleteComment,
    likeComment,
    isDarkMode,
    showToast,
  } = useYouTube();

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Scroll to top when video loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDescriptionExpanded(false);
    setNewCommentText("");
  }, [currentPlayingVideo?.id]);

  if (!currentPlayingVideo) return null;

  const video = currentPlayingVideo;
  const isSubscribed = subscribedChannels.includes(video.channelId);
  const isLiked = likedVideos.includes(video.id);
  const isDisliked = dislikedVideos.includes(video.id);
  const isWatchLater = watchLaterVideos.includes(video.id);

  const commentsList = commentsByVideo[video.id] || [];

  // Related videos (filter current out, matching category first)
  const relatedVideos = videos
    .filter((v) => v.id !== video.id)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === video.category && b.category !== video.category) return -1;
      if (b.category === video.category && a.category !== video.category) return 1;
      return b.viewsCount - a.viewsCount;
    });

  const handleRelatedVideoClick = (v: Video) => {
    addVideoToHistory(v.id);
    setCurrentPlayingVideo(v);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(video.id, newCommentText);
    setNewCommentText("");
  };

  const handleShareClick = () => {
    const shareUrl = `https://www.youtube.com/watch?v=${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
    }, 2000);
  };

  return (
    <div
      id="video-player-root"
      className={`min-h-[calc(100vh-3.5rem)] w-full px-4 md:px-6 py-6 ${
        isDarkMode ? "bg-[#0f0f0f] text-white" : "bg-neutral-50 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column (Left, 2 cols on lg) */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {/* Responsive Video Embed Screen container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-850">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&showinfo=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          {/* Video Title */}
          <h1 className="font-sans font-bold text-lg md:text-xl leading-snug tracking-tight">
            {video.title}
          </h1>

          {/* Meta engagement strip: Channel + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            {/* Channel Area */}
            <div className="flex items-center gap-3">
              <img
                src={video.channelAvatar}
                alt={video.channelName}
                className="w-10 h-10 rounded-full object-cover border border-zinc-700/20 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-sans font-semibold text-sm truncate">{video.channelName}</span>
                  {video.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400 dark:text-zinc-500 dark:fill-zinc-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{video.channelSubscribers}</p>
              </div>

              {/* Sub Button */}
              <button
                onClick={() => toggleSubscribe(video.channelId, video.channelName, video.channelAvatar)}
                className={`ml-4 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors shrink-0 ${
                  isSubscribed
                    ? isDarkMode
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Social Engagement Actions */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
              {/* Like / Dislike pills */}
              <div
                className={`flex items-center rounded-full overflow-hidden ${
                  isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
                }`}
              >
                <button
                  onClick={() => toggleLikeVideo(video.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 hover:opacity-85 transition-opacity cursor-pointer ${
                    isLiked ? "text-blue-500 dark:text-blue-400" : ""
                  }`}
                  title="Like this video"
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  <span>{video.likes}</span>
                </button>

                <div className="w-[1px] h-4 bg-zinc-400 dark:bg-zinc-700" />

                <button
                  onClick={() => toggleDislikeVideo(video.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 hover:opacity-85 transition-opacity cursor-pointer ${
                    isDisliked ? "text-red-500 dark:text-red-400" : ""
                  }`}
                  title="Dislike this video"
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={handleShareClick}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full hover:opacity-85 transition-opacity cursor-pointer ${
                  shareSuccess ? "bg-green-600 text-white" : isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
                }`}
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareSuccess ? "Copied!" : "Share"}</span>
              </button>

              {/* Watch Later / Save */}
              <button
                onClick={() => toggleWatchLater(video.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full hover:opacity-85 transition-opacity cursor-pointer ${
                  isWatchLater
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : isDarkMode
                    ? "bg-zinc-800"
                    : "bg-zinc-200"
                }`}
                title="Save video"
              >
                <Bookmark className={`w-4 h-4 ${isWatchLater ? "fill-current" : ""}`} />
                <span>{isWatchLater ? "Saved" : "Save"}</span>
              </button>

              {/* More details */}
              <button
                onClick={() => {
                  showToast(`Video ID: ${video.id} • Duration: ${video.duration} • Views: ${video.views}`);
                }}
                className={`p-2 rounded-full hover:opacity-85 transition-opacity cursor-pointer ${
                  isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video description card (Collapsible drawer) */}
          <div
            onClick={() => !descriptionExpanded && setDescriptionExpanded(true)}
            className={`p-4 rounded-xl text-sm leading-relaxed transition-colors select-text ${
              isDarkMode
                ? "bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-800"
                : "bg-zinc-200/50 hover:bg-zinc-200/80 border border-zinc-300/30"
            } ${!descriptionExpanded ? "cursor-pointer" : "cursor-default"}`}
          >
            {/* Views and time */}
            <div className="font-bold flex flex-wrap gap-2 text-xs mb-1.5">
              <span>{video.views}</span>
              <span>·</span>
              <span>{video.publishedAt}</span>
              <span>·</span>
              <span className="text-zinc-500 dark:text-zinc-400">#{video.category}</span>
            </div>

            {/* Description text content */}
            <p className={`whitespace-pre-line text-xs font-sans text-neutral-800 dark:text-zinc-200 ${
              !descriptionExpanded ? "line-clamp-2" : ""
            }`}>
              {video.description}
            </p>

            {/* Expand / Close handle button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDescriptionExpanded(!descriptionExpanded);
              }}
              className="text-xs font-semibold mt-3 flex items-center gap-1 text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              {descriptionExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>...more</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* --- Interactive Comments module --- */}
          <div className="pt-4 space-y-4">
            <h3 className="font-sans font-bold text-base flex items-center gap-2">
              <span>{commentsList.length} Comments</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Your comment avatar"
                className="w-10 h-10 rounded-full object-cover border border-red-500 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Add a public comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className={`w-full bg-transparent border-b outline-none text-sm py-1.5 placeholder-zinc-500 ${
                    isDarkMode ? "border-zinc-800 focus:border-white" : "border-zinc-300 focus:border-zinc-900"
                  }`}
                />
                {newCommentText.trim() && (
                  <div className="flex justify-end gap-2 self-end">
                    <button
                      type="button"
                      onClick={() => setNewCommentText("")}
                      className="px-3.5 py-1.5 text-xs rounded-full hover:bg-zinc-500/10 cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-full font-semibold flex items-center gap-1"
                    >
                      <span>Comment</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* List of comments */}
            <div className="space-y-5 pt-3 divide-y divide-zinc-200/50 dark:divide-zinc-800/40">
              {commentsList.length === 0 ? (
                <p className="text-sm text-zinc-500 py-3 italic">
                  No comments yet. Be the first to express your thoughts!
                </p>
              ) : (
                commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-3 pt-4 items-start group">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-700/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold truncate hover:underline cursor-pointer">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-zinc-500">{comment.publishedAt}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans whitespace-pre-line">
                        {comment.content}
                      </p>

                      {/* Comment interactions: Like & Delete */}
                      <div className="flex items-center gap-3.5 mt-2 text-xs text-zinc-500 font-medium">
                        <button
                          onClick={() => likeComment(video.id, comment.id)}
                          className={`flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors cursor-pointer ${
                            comment.likedByMe ? "text-blue-500 dark:text-blue-400 font-semibold" : ""
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${comment.likedByMe ? "fill-current" : ""}`} />
                          <span>{comment.likes}</span>
                        </button>

                        <button className="hover:text-zinc-700 dark:hover:text-zinc-100 cursor-pointer">
                          Reply
                        </button>

                        {/* Allow guest user to delete comments they authored on this applet */}
                        {comment.id.startsWith("comment_") && (
                          <button
                            onClick={() => deleteComment(video.id, comment.id)}
                            className="hidden group-hover:flex items-center gap-1.5 text-red-500 hover:text-red-600 ml-4 font-normal cursor-pointer text-[11px]"
                            title="Delete this comment"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Recommended list column (Right, 1 col on lg) */}
        <div className="col-span-1 space-y-4">
          <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-500">
            Up Next
          </h2>

          <div className="space-y-4">
            {relatedVideos.map((r) => (
              <div
                key={r.id}
                onClick={() => handleRelatedVideoClick(r)}
                className="flex gap-2.5 cursor-pointer hover:shadow-sm group"
              >
                {/* Related Thumbnail */}
                <div className="relative w-36 h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/10">
                  <img
                    src={r.thumbnailUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-[1px] bg-black/80 text-white text-[10px] font-medium rounded">
                    {r.duration}
                  </span>
                </div>

                {/* Related Info details */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-sans font-semibold text-xs leading-none line-clamp-2 pb-0.5 group-hover:text-blue-500 transition-colors ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-950"
                    }`}
                  >
                    {r.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[11px] text-zinc-500 truncate">{r.channelName}</span>
                    {r.isVerified && (
                      <CheckCircle className="w-2.5 h-2.5 text-zinc-400 fill-zinc-400 dark:text-zinc-500 dark:fill-zinc-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    <span>{r.views}</span>
                    <span className="mx-1">·</span>
                    <span>{r.publishedAt}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
