import React from "react";
import { useYouTube } from "../context/YouTubeContext";
import {
  Home,
  Compass,
  PlaySquare,
  History,
  Clock,
  ThumbsUp,
  FolderHeart,
  Flame,
  Music4,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Radio,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const {
    activeTab,
    setActiveTab,
    subscribedChannels,
    currentPlayingVideo,
    setCurrentPlayingVideo,
    setSearchQuery,
    isDarkMode,
  } = useYouTube();

  // All channel avatars for standard reference
  const CHANNEL_DETAILS: Record<string, { name: string; avatar: string }> = {
    lofigirl: {
      name: "Lofi Girl",
      avatar: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=150&auto=format&fit=crop&q=80",
    },
    rickastley: {
      name: "Rick Astley",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    codeacademy: {
      name: "Code Academy",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80",
    },
    sciencecosmos: {
      name: "Cosmos & Science Agency",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    tastybakes: {
      name: "Bake-O-Rama",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
    techminimalist: {
      name: "The Tech Minimalist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    naturesounds: {
      name: "Nature & Beyond",
      avatar: "https://images.unsplash.com/photo-1473116763269-255415c9ff6f?w=150&auto=format&fit=crop&q=80",
    },
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPlayingVideo(null); // Return to standard lists
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shorts", label: "Shorts", icon: Flame },
    { id: "subscriptions", label: "Subscriptions", icon: PlaySquare },
  ];

  const personalItems = [
    { id: "library", label: "Library", icon: FolderHeart },
    { id: "history", label: "History", icon: History },
    { id: "watch-later", label: "Watch Later", icon: Clock },
    { id: "liked", label: "Liked Videos", icon: ThumbsUp },
  ];

  const exploreCategories = [
    { label: "Trending", icon: Flame, query: "" },
    { label: "Music", icon: Music4, query: "Music" },
    { label: "Gaming", icon: Gamepad2, query: "Gaming" },
    { label: "News", icon: Newspaper, query: "News" },
    { label: "Sports", icon: Trophy, query: "Sports" },
    { label: "Learning", icon: Lightbulb, query: "Science" },
  ];

  const sidebarClasses = `h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto select-none transition-all duration-300 ${
    isOpen ? "w-64 px-3 py-3" : "w-18 px-1.5 py-3 hidden md:block"
  } ${
    isDarkMode
      ? "bg-[#0f0f0f] border-r border-zinc-800 scrollbar-zinc"
      : "bg-white border-r border-zinc-200 scrollbar-zinc-light"
  }`;

  const itemHoverClass = isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100";

  if (!isOpen) {
    // Collapsed Mini-sidebar view (Standard YouTube style)
    return (
      <aside className={sidebarClasses}>
        <div className="flex flex-col gap-5 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl w-14 hover:shadow cursor-pointer transition-all duration-150 ${
                  isSel
                    ? isDarkMode
                      ? "bg-zinc-800 text-white font-semibold"
                      : "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-500 dark:text-zinc-400"
                } ${itemHoverClass}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handleTabClick("library")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-14 cursor-pointer transition-all duration-150 ${
              activeTab === "library"
                ? isDarkMode
                  ? "bg-zinc-800 text-white font-semibold"
                  : "bg-zinc-100 text-zinc-900 font-semibold"
                : "text-zinc-500 dark:text-zinc-400"
            } ${itemHoverClass}`}
          >
            <FolderHeart className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">Library</span>
          </button>

          <button
            onClick={() => handleTabClick("history")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-14 cursor-pointer transition-all duration-150 ${
              activeTab === "history"
                ? isDarkMode
                  ? "bg-zinc-800 text-white font-semibold"
                  : "bg-zinc-100 text-zinc-900 font-semibold"
                : "text-zinc-500 dark:text-zinc-400"
            } ${itemHoverClass}`}
          >
            <History className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">History</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={sidebarClasses}>
      {/* Prime Navigation */}
      <div className="space-y-1 mb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSel = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-5 w-full px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                isSel
                  ? isDarkMode
                    ? "bg-zinc-800 text-white font-semibold"
                    : "bg-zinc-100 text-zinc-900 font-semibold"
                  : "text-zinc-700 dark:text-zinc-300 font-normal " + itemHoverClass
              }`}
            >
              <Icon className={`w-5 h-5 ${isSel ? "text-red-500" : ""}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />

      {/* Library/Personal info */}
      <div className="space-y-1 mb-4">
        <h4 className="px-4 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Library & Collection
        </h4>
        {personalItems.map((item) => {
          const Icon = item.icon;
          const isSel = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-5 w-full px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                isSel
                  ? isDarkMode
                    ? "bg-zinc-800 text-white font-semibold"
                    : "bg-zinc-100 text-zinc-900 font-semibold"
                  : "text-zinc-700 dark:text-zinc-300 font-normal " + itemHoverClass
              }`}
            >
              <Icon className="w-5 h-5 text-zinc-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />

      {/* Dynamic Subscriptions list */}
      <div className="space-y-1 mb-4">
        <h4 className="px-4 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Subscriptions ({subscribedChannels.length})
        </h4>

        {subscribedChannels.length === 0 ? (
          <p className="px-4 text-xs text-zinc-500 py-1 leading-relaxed">
            Channels you subscribe to will show up here.
          </p>
        ) : (
          subscribedChannels.map((channelId) => {
            const channel = CHANNEL_DETAILS[channelId] || {
              name: channelId,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80",
            };
            return (
              <button
                key={channelId}
                onClick={() => {
                  setSearchQuery(channel.name);
                  setActiveTab("home");
                  setCurrentPlayingVideo(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 transition-colors text-left cursor-pointer ${itemHoverClass}`}
              >
                <img
                  src={channel.avatar}
                  alt={`${channel.name} avatar`}
                  className="w-6 h-6 rounded-full object-cover border border-zinc-700/20"
                  referrerPolicy="no-referrer"
                />
                <span className="truncate pr-2 flex-1">{channel.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 my-3" />

      {/* Explore section */}
      <div className="space-y-1 mb-4">
        <h4 className="px-4 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Explore Section
        </h4>
        {exploreCategories.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(item.query);
                setActiveTab("home");
                setCurrentPlayingVideo(null);
              }}
              className={`flex items-center gap-5 w-full px-4 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 transition-colors text-left cursor-pointer ${itemHoverClass}`}
            >
              <Icon className="w-5 h-5 text-zinc-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Copyright Footer info */}
      <div className="mt-8 px-4 text-[11px] text-zinc-500 space-y-3 leading-relaxed">
        <div className="flex flex-wrap gap-1.5">
          <span>About</span>
          <span>Press</span>
          <span>Copyright</span>
          <span>Contact</span>
          <span>Creator</span>
          <span>Advertise</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Policy & Safety</span>
          <span>How YouTube works</span>
        </div>
        <p className="pt-2 font-mono text-[10px] text-zinc-600">
          © 2026 Google LLC - AI Studio Replica
        </p>
      </div>
    </aside>
  );
};
