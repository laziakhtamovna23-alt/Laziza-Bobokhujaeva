import React from "react";
import { useYouTube } from "../context/YouTubeContext";
import { VideoCard } from "./VideoCard";
import { FolderHeart, History, Clock, ThumbsUp, Trash2, Library, CornerRightDown } from "lucide-react";

export const LibraryTab: React.FC = () => {
  const {
    videos,
    watchHistory,
    clearHistory,
    watchLaterVideos,
    likedVideos,
    setActiveTab,
    isDarkMode,
  } = useYouTube();

  // Helper to map checklist IDs back to video objects
  const getVideosFromIds = (ids: string[]) => {
    return ids
      .map((id) => videos.find((v) => v.id === id))
      .filter((v): v is typeof videos[number] => !!v);
  };

  const historyItems = getVideosFromIds(watchHistory);
  const watchLaterItems = getVideosFromIds(watchLaterVideos);
  const likedItems = getVideosFromIds(likedVideos);

  return (
    <div
      id="library-dashboard"
      className={`min-h-[calc(100vh-3.5rem)] w-full p-4 md:p-6 lg:p-8 space-y-10 select-none ${
        isDarkMode ? "bg-[#0f0f0f] text-white" : "bg-neutral-50 text-zinc-900"
      }`}
    >
      {/* Header Summary Dashboard Title */}
      <div className="flex items-center gap-3 border-b pb-4 border-zinc-200 dark:border-zinc-800">
        <Library className="w-6 h-6 text-red-600" />
        <h1 className="font-sans font-bold text-xl md:text-2xl tracking-tight">Your Media Library</h1>
      </div>

      {/* SECTION 1: WATCH CHRONOLOGY HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            <h2 className="font-sans font-bold text-base md:text-lg">Recently Watched History ({watchHistory.length})</h2>
          </div>
          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-full text-xs font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center ${
            isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}>
            <p className="text-xs text-zinc-500 pb-2">You haven't watched any videos yet inside this simulator session.</p>
            <button
              onClick={() => setActiveTab("home")}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Go to Home page and start watching
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {historyItems.slice(0, 4).map((v) => (
              <VideoCard key={`hist-${v.id}`} video={v} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: WATCH LATER LIST */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h2 className="font-sans font-bold text-base md:text-lg">Watch Later Collection ({watchLaterVideos.length})</h2>
        </div>

        {watchLaterItems.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center ${
            isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}>
            <p className="text-xs text-zinc-500 pb-2">Your Watch Later collection is empty. Click the clock icon on any thumbnail hover to save.</p>
            <button
              onClick={() => setActiveTab("home")}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Explore and add videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {watchLaterItems.slice(0, 4).map((v) => (
              <VideoCard key={`wl-${v.id}`} video={v} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: LIKED VIDEOS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-green-500" />
          <h2 className="font-sans font-bold text-base md:text-lg">Liked Videos list ({likedVideos.length})</h2>
        </div>

        {likedItems.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center ${
            isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}>
            <p className="text-xs text-zinc-500 pb-2">No liked videos yet. Like a video while playing to add it here.</p>
            <button
              onClick={() => setActiveTab("home")}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Browse videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {likedItems.slice(0, 4).map((v) => (
              <VideoCard key={`liked-${v.id}`} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
