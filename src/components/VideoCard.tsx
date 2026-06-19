import React from "react";
import { Video } from "../types";
import { useYouTube } from "../context/YouTubeContext";
import { CheckCircle, Clock, Share2, Play } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    setCurrentPlayingVideo,
    addVideoToHistory,
    toggleWatchLater,
    watchLaterVideos,
    isDarkMode,
    showToast,
  } = useYouTube();

  const isStoredWatchLater = watchLaterVideos.includes(video.id);

  const handlePlayClick = () => {
    addVideoToHistory(video.id);
    setCurrentPlayingVideo(video);
  };

  const handleWatchLaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchLater(video.id);
    showToast(isStoredWatchLater ? "Removed from Watch Later" : "Saved to Watch Later");
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    navigator.clipboard.writeText(url);
    showToast("Copied link to clipboard!");
  };

  return (
    <div
      onClick={handlePlayClick}
      className="group flex flex-col gap-2 cursor-pointer relative transition-transform duration-200"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/10">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Play Icon Overlay On Hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="p-3 bg-red-600 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-200 shadow-lg">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-white text-[11px] font-medium rounded-md tracking-wider">
          {video.duration}
        </span>

        {/* Hover quick action buttons (YouTube style!) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
          <button
            onClick={handleWatchLaterClick}
            className={`p-1.5 rounded-md text-white shadow-lg backdrop-blur-md transition-colors ${
              isStoredWatchLater ? "bg-red-600 text-white" : "bg-black/60 hover:bg-black/85"
            }`}
            title={isStoredWatchLater ? "Remove from Watch Later" : "Watch Later"}
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-md bg-black/60 hover:bg-black/85 text-white shadow-lg backdrop-blur-md transition-colors"
            title="Copy Video Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Details Row */}
      <div className="flex gap-3 px-1 pt-1">
        {/* Channel Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            showToast(`${video.channelName} • ${video.channelSubscribers}`);
          }}
          className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-zinc-700 border border-zinc-700/20"
        >
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Meta text content */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <h3
            className={`font-sans font-medium text-sm line-clamp-2 leading-snug tracking-tight group-hover:text-blue-500 transition-colors ${
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {video.title}
          </h3>

          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-zinc-500 dark:text-zinc-400 text-xs truncate hover:text-zinc-800 dark:hover:text-zinc-200">
              {video.channelName}
            </span>
            {video.isVerified && (
              <CheckCircle className="w-3 h-3 text-zinc-400 fill-zinc-400 dark:text-zinc-500 dark:fill-zinc-500 shrink-0" />
            )}
          </div>

          <p className="text-[11px] text-zinc-500 mt-0.5 font-sans">
            <span>{video.views}</span>
            <span className="mx-1.5">·</span>
            <span>{video.publishedAt}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
