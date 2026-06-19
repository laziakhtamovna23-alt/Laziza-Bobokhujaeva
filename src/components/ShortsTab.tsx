import React, { useState } from "react";
import { useYouTube } from "../context/YouTubeContext";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Music,
  CheckCircle,
  MoreVertical,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShortItem {
  id: string;
  youtubeId: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  channelId: string;
  subscribers: string;
  likes: number;
  commentsCount: number;
  audioTrack: string;
  isSubscribed?: boolean;
}

export const ShortsTab: React.FC = () => {
  const { isDarkMode, subscribedChannels, toggleSubscribe } = useYouTube();

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likesState, setLikesState] = useState<Record<string, { count: number; status: "liked" | "disliked" | "none" }>>({
    short1: { count: 245000, status: "none" },
    short2: { count: 85002, status: "none" },
    short3: { count: 124000, status: "none" },
  });

  const [showComments, setShowComments] = useState(false);
  const [shortComments, setShortComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    short1: [
      { author: "ChillVibes", text: "The cat is so cute, I watched this on repeat for 2 hours!", time: "1 day ago" },
      { author: "CodingGuru", text: "Wait, is she actually writing rust?! Pure respect.", time: "4 hours ago" },
    ],
    short2: [
      { author: "KeybFan", text: "Those keycaps are custom retro dye-sublimated, pure aesthetic!", time: "2 days ago" },
      { author: "SoundNerd", text: "The acoustic click sounds so deep and thobby. Excellent lube job.", time: "18 hours ago" },
    ],
    short3: [
      { author: "SpaceLover", text: "Imagine looking at the Earth from that high up. Total goosebumps.", time: "3 days ago" },
    ],
  });

  const [newComment, setNewComment] = useState("");

  const SHORTS_DATA: ShortItem[] = [
    {
      id: "short1",
      youtubeId: "jfKfPfyJRdk", // Lofi Beats stream slice
      title: "Coding late at night with lo-fi beats and cozy warm fireplace rain ⛈️💻",
      creator: "Lofi Girl",
      creatorAvatar: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=150&auto=format&fit=crop&q=80",
      channelId: "lofigirl",
      subscribers: "14.3M",
      likes: 245000,
      commentsCount: 220,
      audioTrack: "Original Audio - Lofi Girl Beats",
    },
    {
      id: "short2",
      youtubeId: "u4g69-T67-Y", // Tech keyboard ASMR slice
      title: "Satisfying custom mechanical keyboard build ASMR typing! Linear creams. ⌨️✨",
      creator: "The Tech Minimalist",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      channelId: "techminimalist",
      subscribers: "1.2M",
      likes: 85002,
      commentsCount: 412,
      audioTrack: "Keyboard ASMR - Tactile Cream switches",
    },
    {
      id: "short3",
      youtubeId: "libKVRa01Lg", // Outer space visual slice
      title: "Real video of the Earth spinning filmed from the International Space Station! 🌌🌎",
      creator: "Cosmos & Science Agency",
      creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      channelId: "sciencecosmos",
      subscribers: "850K",
      likes: 124000,
      commentsCount: 89,
      audioTrack: "NASA Ambient Synth Theme Score",
    },
  ];

  const currentShort = SHORTS_DATA[activeIndex];
  const isSubscribedInstance = subscribedChannels.includes(currentShort.channelId);

  const handleLike = (id: string) => {
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, status: "none" };
      if (current.status === "liked") {
        return { ...prev, [id]: { count: current.count - 1, status: "none" } };
      } else {
        const adjustment = current.status === "disliked" ? 1 : 0;
        return { ...prev, [id]: { count: current.count + 1, status: "liked" } };
      }
    });
  };

  const handleDislike = (id: string) => {
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, status: "none" };
      if (current.status === "disliked") {
        return { ...prev, [id]: { status: "none", count: current.count } };
      } else {
        const countDiff = current.status === "liked" ? -1 : 0;
        return { ...prev, [id]: { status: "disliked", count: current.count + countDiff } };
      }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setShortComments((prev) => ({
      ...prev,
      [currentShort.id]: [
        { author: "Guest Viewer", text: newComment, time: "Just now" },
        ...(prev[currentShort.id] || []),
      ],
    }));
    setNewComment("");
  };

  const formatShortLikes = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div
      id="shorts-reel-container"
      className={`min-h-[calc(100vh-3.5rem)] w-full py-4 px-2 md:py-8 flex flex-col items-center ${
        isDarkMode ? "bg-[#0f0f0f] text-white" : "bg-neutral-55 text-zinc-900"
      }`}
    >
      {/* Scroll instruction bubble */}
      <div className="flex gap-2 items-center mb-4 select-none bg-red-600/10 text-red-500 px-3.5 py-1.5 rounded-full border border-red-500/20 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>YouTube Shorts: Click Next Short or Swipe down to navigate!</span>
      </div>

      {/* Reel Shell Grid */}
      <div className="flex flex-row gap-6 max-w-lg w-full items-end justify-center relative">
        {/* Core Video Player Frame (9:16 portrait ratio) */}
        <div className="relative aspect-[9/16] w-full max-w-[360px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center">
          {/* Loop Embed via customized query parameter */}
          <iframe
            src={`https://www.youtube.com/embed/${currentShort.youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${currentShort.youtubeId}&controls=0&modestbranding=1`}
            title={currentShort.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full pointer-events-none scale-120"
          ></iframe>

          {/* Sound toggle overlay button top-right */}
          <button
            onClick={() => setMuted(!muted)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-opacity"
            title={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Portrait Cover Text Overlays (At bottom) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/99 via-black/60 to-transparent p-4 flex flex-col gap-3 justify-end text-white select-text">
            {/* Creator Channel Row */}
            <div className="flex items-center gap-2">
              <img
                src={currentShort.creatorAvatar}
                alt="Short creator avatar"
                className="w-8 h-8 rounded-full object-cover border border-zinc-500 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold truncate flex items-center gap-0.5">
                  @{currentShort.creator.toLowerCase().replace(/ /g, "")}
                  <CheckCircle className="w-3 h-3 text-blue-400 fill-blue-400" />
                </span>
                <span className="text-[10px] text-zinc-400">{currentShort.subscribers} sub</span>
              </div>

              <button
                onClick={() =>
                  toggleSubscribe(currentShort.channelId, currentShort.creator, currentShort.creatorAvatar)
                }
                className={`ml-2 px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                  isSubscribedInstance
                    ? "bg-zinc-805/70 text-zinc-350 hover:bg-zinc-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isSubscribedInstance ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Shorts Description */}
            <p className="text-xs leading-normal font-sans line-clamp-3">
              {currentShort.title}
            </p>

            {/* Spinning Music Track animation */}
            <div className="flex items-center gap-1.5 pt-1 overflow-hidden select-none">
              <Music className="w-3 h-3 text-red-500 shrink-0" />
              <div className="w-full overflow-hidden relative">
                <p className="text-[10px] tracking-wide text-zinc-300 font-medium whitespace-nowrap animate-pulse">
                  {currentShort.audioTrack}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Side Utility Controls bar on RHS */}
        <div className="flex flex-col gap-5 items-center select-none shrink-0 mb-4 z-10 text-center">
          {/* Like */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => handleLike(currentShort.id)}
              className={`p-3.5 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                likesState[currentShort.id]?.status === "liked"
                  ? "bg-red-600 text-white"
                  : isDarkMode
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-white text-zinc-800"
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold">
              {formatShortLikes(likesState[currentShort.id]?.count || currentShort.likes)}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => handleDislike(currentShort.id)}
              className={`p-3.5 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                likesState[currentShort.id]?.status === "disliked"
                  ? "bg-red-600 text-white"
                  : isDarkMode
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-white text-zinc-800"
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold">Dislike</span>
          </div>

          {/* Comments Panel Toggle */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setShowComments(true)}
              className={`p-3.5 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-white text-zinc-800"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold">
              {(shortComments[currentShort.id] || []).length || currentShort.commentsCount}
            </span>
          </div>

          {/* Fast Switch: Next Short */}
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev + 1) % SHORTS_DATA.length);
              setShowComments(false);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-full shadow-md mt-4 transition-transform hover:scale-102 flex items-center gap-1"
          >
            <span>Next Short</span>
          </button>
        </div>
      </div>

      {/* Slide-out Comments drawers for active short */}
      <AnimatePresence>
        {showComments && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={`max-w-md w-full rounded-t-2xl p-4 flex flex-col h-[55%] relative select-text border-t ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white"
                  : "bg-white border-zinc-200 text-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm tracking-tight">Short Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-1 rounded-full hover:bg-zinc-500/10 text-zinc-400 hover:text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comments scroll pane */}
              <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
                {(shortComments[currentShort.id] || []).map((c, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-zinc-600 overflow-hidden shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        alt="Generic avatar profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{c.author}</span>
                        <span className="text-[10px] text-zinc-500">{c.time}</span>
                      </div>
                      <p className="text-xs text-zinc-800 dark:text-zinc-300 mt-1 font-sans">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments input box */}
              <form onSubmit={handleAddComment} className="flex gap-2.5 pt-3 border-t border-zinc-250 dark:border-zinc-800 items-center">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-full border outline-none ${
                    isDarkMode
                      ? "bg-zinc-800 border-zinc-700 text-white focus:border-white"
                      : "bg-zinc-100 border-zinc-300 text-zinc-800 focus:border-zinc-900"
                  }`}
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
