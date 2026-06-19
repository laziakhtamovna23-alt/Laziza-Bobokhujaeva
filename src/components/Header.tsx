import React, { useState, useEffect, useRef } from "react";
import { useYouTube } from "../context/YouTubeContext";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Settings,
  Flame,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenUploadModal: () => void;
}

interface NotificationItem {
  id: string;
  avatar: string;
  title: string;
  time: string;
  isUnread: boolean;
  videoThumbnail?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenUploadModal }) => {
  const {
    searchQuery,
    setSearchQuery,
    isDarkMode,
    setIsDarkMode,
    setActiveTab,
    setCurrentPlayingVideo,
  } = useYouTube();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Listening...");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  // Mock Notifications list
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      avatar: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=100&auto=format&fit=crop&q=80",
      title: "Lofi Girl uploaded: autumn lofi beats 🍁 - beats to study/chill",
      time: "10 minutes ago",
      isUnread: true,
      videoThumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    },
    {
      id: "n2",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
      title: "Gordon Ramsay loved your comment on steak masterclass!",
      time: "2 hours ago",
      isUnread: true,
    },
    {
      id: "n3",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=80",
      title: "Code Academy launched a new course: Advanced Typescript!",
      time: "1 day ago",
      isUnread: false,
      videoThumbnail: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=800&auto=format&fit=crop&q=80",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  // Handle outside clicks to close profile / notifications dropdowns
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    setActiveTab("home");
    setCurrentPlayingVideo(null);
  };

  const clearSearch = () => {
    setInputVal("");
    setSearchQuery("");
  };

  // Trigger simulated voice search
  const triggerVoiceSearch = () => {
    setShowVoiceSearch(true);
    setVoiceStatus("Listening...");
    
    // Step 1: Simulate hearing a command
    setTimeout(() => {
      setVoiceStatus('Try saying: "Lofi girl study beats"');
    }, 1500);

    // Step 2: Auto search for lofi girl beats to show functional search helper
    setTimeout(() => {
      setVoiceStatus('Recognized: "Lofi Hip Hop Beats"');
    }, 3200);

    setTimeout(() => {
      setInputVal("Lofi Hip Hop");
      setSearchQuery("Lofi Hip Hop");
      setActiveTab("home");
      setCurrentPlayingVideo(null);
      setShowVoiceSearch(false);
    }, 4500);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
    );
    // Find matching topic or just direct to home
    if (item.videoThumbnail) {
      if (item.id === "n1") {
        setSearchQuery("Lofi Girl");
      } else {
        setSearchQuery("TypeScript");
      }
      setActiveTab("home");
      setCurrentPlayingVideo(null);
    }
    setShowNotifications(false);
  };

  const resetLocalData = () => {
    localStorage.removeItem("yt_videos");
    localStorage.removeItem("yt_subscribed");
    localStorage.removeItem("yt_liked");
    localStorage.removeItem("yt_disliked");
    localStorage.removeItem("yt_history");
    localStorage.removeItem("yt_watchlater");
    localStorage.removeItem("yt_comments");
    window.location.reload();
  };

  return (
    <header
      id="yt-header"
      className={`sticky top-0 z-40 flex items-center justify-between px-4 h-14 ${
        isDarkMode ? "bg-[#0f0f0f] text-white border-b border-zinc-800" : "bg-white text-zinc-900 border-b border-zinc-200"
      }`}
    >
      {/* Left section: Hamburger menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          id="hamburger-btn"
          onClick={onToggleSidebar}
          className={`p-2 rounded-full hidden md:inline-flex hover:${
            isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
          } transition-colors`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => {
            setSearchQuery("");
            setInputVal("");
            setActiveTab("home");
            setCurrentPlayingVideo(null);
          }}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <div className="relative flex items-center justify-center p-1 bg-red-600 rounded-lg w-8 h-6 text-white">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white ml-0.5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tighter flex items-center gap-0.5">
            YouTube<span className="text-[10px] text-gray-500 font-normal align-super self-start mt-0.5 pl-0.5">CLONE</span>
          </span>
        </div>
      </div>

      {/* Middle section: Search bar & Voice Search */}
      <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-2xl mx-4 items-center gap-3">
        <div className="flex flex-1 items-center relative">
          <div className="flex flex-1 items-center border rounded-l-full overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 shadow-inner h-9 bg-zinc-500/5 border-zinc-300 dark:border-zinc-700">
            <span className="pl-3 text-zinc-400 hidden group-focus-within:inline">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search videos..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-3 py-1 bg-transparent border-none outline-none text-sm placeholder-zinc-500 dark:placeholder-zinc-400"
            />
            {inputVal && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`px-6 h-9 rounded-r-full border-y border-r border-zinc-300 dark:border-zinc-700 flex items-center justify-center hover:opacity-90 ${
              isDarkMode ? "bg-zinc-800 text-zinc-200" : "bg-neutral-100 text-zinc-700"
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={triggerVoiceSearch}
          className={`p-2.5 rounded-full hover:${
            isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
          } transition-all max-sm:hidden ${
            isDarkMode ? "bg-zinc-900" : "bg-zinc-50"
          }`}
          title="Search with your voice"
        >
          <Mic className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        </button>
      </form>

      {/* Right section: Create, Notifications, Profile Dropdowns */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Dark Mode toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full hover:${
            isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
          } transition-colors`}
          title="Toggle color theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
        </button>

        {/* Create / Upload video Trigger */}
        <button
          onClick={onOpenUploadModal}
          className={`p-2 rounded-full hover:${
            isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
          } transition-colors flex items-center gap-1 cursor-pointer`}
          title="Create or upload video"
        >
          <Video className="w-5 h-5" />
          <span className="text-xs font-semibold hidden lg:inline">Create</span>
        </button>

        {/* Notifications and bell drop-down */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`p-2 rounded-full relative hover:${
              isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
            } transition-colors`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 mt-2 w-80 md:w-96 rounded-xl border shadow-xl overflow-hidden ${
                  isDarkMode
                    ? "bg-[#212121] border-zinc-800 text-white"
                    : "bg-white border-zinc-200 text-zinc-800"
                }`}
              >
                <div className="p-4 border-b border-zinc-250 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button
                    onClick={() =>
                      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })))
                    }
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex gap-3 p-3 cursor-pointer hover:bg-zinc-500/10 transition-colors ${
                        n.isUnread ? (isDarkMode ? "bg-[#2f2f2f]/30" : "bg-blue-500/5") : ""
                      }`}
                    >
                      <img
                        src={n.avatar}
                        alt="ChannelAvatar"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <p className="text-xs line-clamp-2 leading-relaxed text-zinc-800 dark:text-zinc-200">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-zinc-500 mt-1 block">{n.time}</span>
                      </div>
                      {n.videoThumbnail && (
                        <img
                          src={n.videoThumbnail}
                          alt="VideoThumbnail"
                          className="w-16 h-10 object-cover rounded shrink-0 border border-zinc-700/20"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Circle Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-red-500 focus:outline-none"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User profile avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl overflow-hidden ${
                  isDarkMode
                    ? "bg-[#212121] border-zinc-800 text-white"
                    : "bg-white border-zinc-200 text-zinc-800"
                }`}
              >
                <div className="p-4 border-b border-zinc-250 dark:border-zinc-800 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Current profile view"
                    className="w-10 h-10 rounded-full object-cover border border-red-600"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">Guest Viewer</h3>
                    <span className="text-xs text-zinc-500">guest@aistudio.com</span>
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setActiveTab("library");
                      setCurrentPlayingVideo(null);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-500/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Your Channel</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Sun className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-zinc-500" />
                      )}
                      <span>Appearance</span>
                    </div>
                    <span className="text-xs text-zinc-500 pr-1">{isDarkMode ? "Dark" : "Light"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("history");
                      setCurrentPlayingVideo(null);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-500/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-zinc-400" />
                    <span>Watch History</span>
                  </button>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 my-1" />

                  <button
                    onClick={resetLocalData}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Reset Database</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simulated voice speech assistant mic screen */}
      <AnimatePresence>
        {showVoiceSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-8 rounded-2xl border flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl relative ${
                isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-800"
              }`}
            >
              <button
                onClick={() => setShowVoiceSearch(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-zinc-500/10 transition-colors text-zinc-400 hover:text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-bold text-lg mb-2">Voice Search Simulation</h3>
              <p className="text-sm text-zinc-400 text-center mb-8">{voiceStatus}</p>

              {/* Dynamic waveform simulation */}
              <div className="flex items-center justify-center gap-1.5 h-12 mb-8">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [16, 48, 16],
                    }}
                    transition={{
                      duration: 0.8 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 bg-red-600 rounded-full"
                  />
                ))}
              </div>

              <div className="p-4 rounded-full bg-red-600/10 text-red-500 animate-pulse border border-red-500/30">
                <Mic className="w-8 h-8" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
