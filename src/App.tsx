import React, { useState } from "react";
import { YouTubeProvider, useYouTube } from "./context/YouTubeContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { CategoryChips } from "./components/CategoryChips";
import { VideoCard } from "./components/VideoCard";
import { VideoPlayerPage } from "./components/VideoPlayerPage";
import { UploadModal } from "./components/UploadModal";
import { ShortsTab } from "./components/ShortsTab";
import { LibraryTab } from "./components/LibraryTab";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  PlayCircle,
  ThumbsUp,
  History as HistoryIcon,
} from "lucide-react";

const AppContent: React.FC = () => {
  const {
    videos,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    activeTab,
    setActiveTab,
    currentPlayingVideo,
    setCurrentPlayingVideo,
    subscribedChannels,
    toggleSubscribe,
    likedVideos,
    watchLaterVideos,
    watchHistory,
    clearHistory,
    isDarkMode,
    toastMessage,
  } = useYouTube();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Toggle Sidebar Collapse
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Filter video list based on current selection: category, search query
  const getFilteredVideos = () => {
    return videos.filter((video) => {
      // 1. Filter Category
      const matchCategory =
        selectedCategory.toLowerCase() === "all" ||
        video.category.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Filter Search Query
      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        video.title.toLowerCase().includes(searchLower) ||
        video.channelName.toLowerCase().includes(searchLower) ||
        video.category.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower);

      return matchCategory && matchSearch;
    });
  };

  const filteredVideos = getFilteredVideos();

  // Helper to resolve specific listings
  const getVideosFromIds = (ids: string[]) => {
    return ids
      .map((id) => videos.find((v) => v.id === id))
      .filter((v): v is typeof videos[number] => !!v);
  };

  // Rendering Helper for list pages
  const renderListTitleHeader = (title: string, icon: React.ReactNode, extraAction?: React.ReactNode) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-zinc-200 dark:border-zinc-800 mb-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2.5 bg-red-650/10 rounded-xl text-red-600">{icon}</div>
        <h1 className="font-sans font-bold text-xl md:text-2xl tracking-tight">{title}</h1>
      </div>
      {extraAction}
    </div>
  );

  const renderRecommendedSubscriptions = () => (
    <div className="mt-8">
      <h3 className="font-sans font-semibold text-sm text-zinc-500 mb-4 uppercase tracking-wider">
        Recommended Creators To Follow
      </h3>
      <div className="flex flex-wrap gap-4">
        {[
          {
            id: "lofigirl",
            name: "Lofi Girl",
            avatar: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=150&auto=format&fit=crop&q=80",
            subs: "14.3M subscribers",
          },
          {
            id: "rickastley",
            name: "Rick Astley",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            subs: "4.1M subscribers",
          },
          {
            id: "codeacademy",
            name: "Code Academy",
            avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80",
            subs: "1.8M subscribers",
          },
          {
            id: "gordonramsay",
            name: "Gordon Ramsay",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
            subs: "20.4M subscribers",
          },
        ]
          .filter((ch) => !subscribedChannels.includes(ch.id))
          .map((ch) => (
            <div
              key={ch.id}
              className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border"
                referrerPolicy="no-referrer"
              />
              <div className="text-left font-sans">
                <span className="text-xs font-bold block">{ch.name}</span>
                <span className="text-[10px] text-zinc-500 block">{ch.subs}</span>
                <button
                  onClick={() => toggleSubscribe(ch.id, ch.name, ch.avatar)}
                  className="mt-2 text-[10px] font-bold text-red-500 hover:underline"
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? "bg-[#0f0f0f] text-white" : "bg-neutral-50 text-zinc-900"
    }`}>
      {/* 1. Header Navigation Bar */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main Core Columns: Sidebar Drawer + Stage Content container */}
      <div className="flex flex-1 relative items-start">
        {/* 2. Collapsible Left Nav Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* 3. Stage content container */}
        <main className="flex-1 min-w-0 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Active View Router Selector */}
          {currentPlayingVideo ? (
            /* (A) VIDEO PLAYER DETAILED THEATRE SCREEN */
            <VideoPlayerPage />
          ) : activeTab === "shorts" ? (
            /* (B) PORTRAIT SHORTS TAB REEL FEED */
            <ShortsTab />
          ) : activeTab === "library" ? (
            /* (C) PERSONALIZED DASHBOARD TAB */
            <LibraryTab />
          ) : activeTab === "subscriptions" ? (
            /* (D) SUBSCRIBED FEED CHANNEL PAGE */
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {renderListTitleHeader(
                `Your Subscribed Feed (${subscribedChannels.length})`,
                <PlayCircle className="w-5 h-5" />
              )}
              {subscribedChannels.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-805" : "bg-white border-zinc-200"
                }`}>
                  <p className="text-sm text-zinc-500 pb-2">
                    You haven't subscribed to any content channels yet!
                  </p>
                  <p className="text-xs text-zinc-400">
                    Browse home videos and follow matching creators to build your subscribed feed page.
                  </p>
                  {renderRecommendedSubscriptions()}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                    {videos
                      .filter((v) => subscribedChannels.includes(v.channelId))
                      .map((video) => (
                        <VideoCard key={`sub-${video.id}`} video={video} />
                      ))}
                  </div>
                  {renderRecommendedSubscriptions()}
                </>
              )}
            </div>
          ) : activeTab === "liked" ? (
            /* (E) COHESIVE LIKED LIST PAGE */
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {renderListTitleHeader(`Liked Video Recordings`, <ThumbsUp className="w-5 h-5" />)}
              {likedVideos.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-805" : "bg-white border-zinc-200"
                }`}>
                  <p className="text-sm text-zinc-500 pb-2">
                    Your liked collection is currently empty.
                  </p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="text-xs text-red-500 hover:underline font-semibold"
                  >
                    Go back to home and explore content
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                  {getVideosFromIds(likedVideos).map((video) => (
                    <VideoCard key={`liked-page-${video.id}`} video={video} />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "watch-later" ? (
            /* (F) WATCH LATER COMPILING LIST */
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {renderListTitleHeader(`Saved - Watch Later list`, <Clock className="w-5 h-5" />)}
              {watchLaterVideos.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-805" : "bg-white border-zinc-200"
                }`}>
                  <p className="text-sm text-zinc-500 pb-2">
                    You don't have any videos saved for later.
                  </p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="text-xs text-red-500 hover:underline font-semibold"
                  >
                    Explore videos to save
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                  {getVideosFromIds(watchLaterVideos).map((video) => (
                    <VideoCard key={`wl-page-${video.id}`} video={video} />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "history" ? (
            /* (G) DETAILED CHRONOLOGICAL HISTORY PAGE */
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {renderListTitleHeader(
                `Your Watch Chronology History`,
                <HistoryIcon className="w-5 h-5" />,
                watchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-4 py-2 bg-red-600/15 hover:bg-red-600/25 text-red-500 text-xs font-semibold rounded-full cursor-pointer transition-all shrink-0"
                  >
                    Clear Full Chronology
                  </button>
                )
              )}
              {watchHistory.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-805" : "bg-white border-zinc-200"
                }`}>
                  <p className="text-sm text-zinc-500 pb-2">
                    Your viewing history is currently empty as no videos have been clicked in this session.
                  </p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="text-xs text-red-500 hover:underline font-bold"
                  >
                    Go back to home and watch some clips
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                  {getVideosFromIds(watchHistory).map((video) => (
                    <VideoCard key={`hist-page-${video.id}`} video={video} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* (H) MAIN FEED (Home tab state) */
            <div className="flex flex-col">
              {/* Category Chips sliding segment */}
              <CategoryChips />

              {/* Feed lists Stage */}
              <div className="px-4 md:px-6 lg:px-8 pb-12 max-w-7xl mx-auto w-full space-y-6 mt-2">
                {/* Search status header */}
                {searchQuery && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 border-b pb-3 border-zinc-200 dark:border-zinc-800">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <span>Search results filtering for:</span>
                    <span className="px-2 py-0.5 bg-red-600/10 border border-red-500/20 text-red-500 rounded font-bold font-mono">
                      "{searchQuery}"
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-500 hover:underline hover:text-blue-600 text-[11px] font-normal pl-2"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}

                {/* No matching search/category empty warning */}
                {filteredVideos.length === 0 ? (
                  <div className={`p-12 text-center rounded-2xl border max-w-md mx-auto ${
                    isDarkMode ? "bg-zinc-900/50 border-zinc-805 text-white" : "bg-white border-zinc-200 text-zinc-800"
                  }`}>
                    <Search className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                    <h3 className="font-sans font-bold text-base mb-1">No matching videos found</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                      We couldn't locate any videos checking that filter context. Let's reset your filters to find content.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        window.location.reload();
                      }}
                      className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* responsive grid matching exactly YouTube guidelines (1col on max-sm, 2col on sm, 3col on lg, 4col on xl) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                    {filteredVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Overlaid creator upload panels */}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

      {/* Dynamic Native Glass Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-900 shadow-2xl rounded-2xl border border-zinc-800 dark:border-white/20 backdrop-blur-md max-w-sm w-full md:w-auto"
          >
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold tracking-wide flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <YouTubeProvider>
      <AppContent />
    </YouTubeProvider>
  );
}

/*
<!--
  === CLONE REPLICAS COMPLETE CHECKLIST ===
  [✓] 1-to-1 Responsive YouTube Visual layout mapping
  [✓] Fully collapsible sidebar drawer and hamburger menu toggle 
  [✓] Dynamic Category Chips tags horizontal scroll navigation container
  [✓] Custom High-Fidelity header bar with input search, voice animated mic simulation modal
  [✓] Interactive YouTube video player theater module with custom Iframe streaming feed
  [✓] Social triggers: Like, Dislike, Subscribed toggle, and Copy Shareable links
  [✓] Commenting Module: Add, view and delete comments live, hear comments, heart sub-reactions
  [✓] Creator Studio Studio: Mock upload custom Youtube videos with metadata parameters
  [✓] Swipeable YouTube portrait Shorts vertical reels with loop streaming controls
  [✓] Chronological history listing with custom dynamic viewing history tracks
  [✓] Full Watch Later compilation lists & custom Liked history pages
  [✓] Media Library Dashboard summarizing history, watch later clips, and likes
  [✓] Clean CSS theme toggles supporting exquisite dark Mode styles
-->
*/
