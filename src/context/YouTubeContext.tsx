import React, { createContext, useContext, useState, useEffect } from "react";
import { Video, Comment, Channel } from "../types";
import { INITIAL_VIDEOS } from "../data/videos";

interface YouTubeContextType {
  videos: Video[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeTab: string; // "home" | "shorts" | "subscriptions" | "library" | "history" | "liked" | "watch-later"
  setActiveTab: (tab: string) => void;
  currentPlayingVideo: Video | null;
  setCurrentPlayingVideo: (video: Video | null) => void;
  subscribedChannels: string[]; // list of channelIds
  toggleSubscribe: (channelId: string, channelName: string, channelAvatar: string) => void;
  likedVideos: string[]; // list of videoIds
  dislikedVideos: string[]; // list of videoIds
  toggleLikeVideo: (videoId: string) => void;
  toggleDislikeVideo: (videoId: string) => void;
  watchHistory: string[]; // list of videoIds
  addVideoToHistory: (videoId: string) => void;
  clearHistory: () => void;
  watchLaterVideos: string[]; // list of videoIds
  toggleWatchLater: (videoId: string) => void;
  commentsByVideo: Record<string, Comment[]>;
  addComment: (videoId: string, content: string) => void;
  deleteComment: (videoId: string, commentId: string) => void;
  likeComment: (videoId: string, commentId: string) => void;
  uploadVideo: (video: Omit<Video, "comments" | "views" | "viewsCount" | "likes" | "likesCount" | "publishedAt">) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined);

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem("yt_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("home");
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>(null);

  const [subscribedChannels, setSubscribedChannels] = useState<string[]>(() => {
    const saved = localStorage.getItem("yt_subscribed");
    return saved ? JSON.parse(saved) : ["lofigirl", "rickastley"]; // Pre-subscribe to a couple for visual fidelity
  });

  const [likedVideos, setLikedVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("yt_liked");
    return saved ? JSON.parse(saved) : [];
  });

  const [dislikedVideos, setDislikedVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("yt_disliked");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchHistory, setWatchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("yt_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchLaterVideos, setWatchLaterVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("yt_watchlater");
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("yt_theme");
    return saved ? JSON.parse(saved) : true; // Default dark because YouTube's dark theme looks amazing
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Keep track of edited comments lists by video
  const [commentsByVideo, setCommentsByVideo] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem("yt_comments");
    if (saved) return JSON.parse(saved);
    
    // Build initial mapping from mock videos
    const initialMapping: Record<string, Comment[]> = {};
    INITIAL_VIDEOS.forEach((v) => {
      initialMapping[v.id] = v.comments || [];
    });
    return initialMapping;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("yt_videos", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("yt_subscribed", JSON.stringify(subscribedChannels));
  }, [subscribedChannels]);

  useEffect(() => {
    localStorage.setItem("yt_liked", JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem("yt_disliked", JSON.stringify(dislikedVideos));
  }, [dislikedVideos]);

  useEffect(() => {
    localStorage.setItem("yt_history", JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem("yt_watchlater", JSON.stringify(watchLaterVideos));
  }, [watchLaterVideos]);

  useEffect(() => {
    localStorage.setItem("yt_comments", JSON.stringify(commentsByVideo));
  }, [commentsByVideo]);

  useEffect(() => {
    localStorage.setItem("yt_theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleSubscribe = (channelId: string, channelName: string, channelAvatar: string) => {
    setSubscribedChannels((prev) => {
      const isSub = prev.includes(channelId);
      if (isSub) {
        return prev.filter((id) => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });

    // Optionally update user feed status or subscribers count in matching videos locally
    setVideos((prev) =>
      prev.map((v) => {
        if (v.channelId === channelId) {
          const isCurrentlySub = subscribedChannels.includes(channelId);
          const currentCount = v.subscribersCount;
          const nextCount = isCurrentlySub ? Math.max(0, currentCount - 1) : currentCount + 1;
          return {
            ...v,
            channelSubscribers: formatSubscribersCount(nextCount),
            subscribersCount: nextCount,
          };
        }
        return v;
      })
    );
  };

  const formatSubscribersCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M subscribers";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(0) + "K subscribers";
    }
    return count + " subscribers";
  };

  const toggleLikeVideo = (videoId: string) => {
    const isLiked = likedVideos.includes(videoId);
    const isDisliked = dislikedVideos.includes(videoId);

    setLikedVideos((prev) =>
      isLiked ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );

    if (isDisliked) {
      setDislikedVideos((prev) => prev.filter((id) => id !== videoId));
    }

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          let updatedLikes = v.likesCount;
          if (isLiked) {
            updatedLikes = Math.max(0, updatedLikes - 1);
          } else {
            updatedLikes += 1;
          }
          return {
            ...v,
            isLiked: !isLiked,
            isDisliked: false,
            likesCount: updatedLikes,
            likes: formatLikesCount(updatedLikes),
          };
        }
        return v;
      })
    );
  };

  const toggleDislikeVideo = (videoId: string) => {
    const isDisliked = dislikedVideos.includes(videoId);
    const isLiked = likedVideos.includes(videoId);

    setDislikedVideos((prev) =>
      isDisliked ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );

    if (isLiked) {
      setLikedVideos((prev) => prev.filter((id) => id !== videoId));
      setVideos((prev) =>
        prev.map((v) => {
          if (v.id === videoId) {
            return {
              ...v,
              isLiked: false,
              likesCount: Math.max(0, v.likesCount - 1),
              likes: formatLikesCount(Math.max(0, v.likesCount - 1)),
            };
          }
          return v;
        })
      );
    }

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            isDisliked: !isDisliked,
          };
        }
        return v;
      })
    );
  };

  const formatLikesCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  const addVideoToHistory = (videoId: string) => {
    setWatchHistory((prev) => {
      // Remove to push to top of history
      const filtered = prev.filter((id) => id !== videoId);
      return [videoId, ...filtered];
    });

    // Increment view count dynamically on local state
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const nextViewsCount = v.viewsCount + 1;
          let nextViewsStr = "";
          if (nextViewsCount >= 1000000000) {
            nextViewsStr = (nextViewsCount / 1000000000).toFixed(1) + "B views";
          } else if (nextViewsCount >= 1000000) {
            nextViewsStr = (nextViewsCount / 1000000).toFixed(1) + "M views";
          } else if (nextViewsCount >= 1000) {
            nextViewsStr = (nextViewsCount / 1000).toFixed(0) + "K views";
          } else {
            nextViewsStr = nextViewsCount + " views";
          }
          return {
            ...v,
            viewsCount: nextViewsCount,
            views: nextViewsStr,
          };
        }
        return v;
      })
    );
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  const toggleWatchLater = (videoId: string) => {
    setWatchLaterVideos((prev) => {
      const exists = prev.includes(videoId);
      if (exists) {
        return prev.filter((id) => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const addComment = (videoId: string, content: string) => {
    const newComment: Comment = {
      id: "comment_" + Date.now(),
      authorName: "Guest Viewer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      content,
      likes: 0,
      publishedAt: "Just now",
    };

    setCommentsByVideo((prev) => {
      const currentComments = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: [newComment, ...currentComments],
      };
    });
  };

  const deleteComment = (videoId: string, commentId: string) => {
    setCommentsByVideo((prev) => {
      const currentComments = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: currentComments.filter((c) => c.id !== commentId),
      };
    });
  };

  const likeComment = (videoId: string, commentId: string) => {
    setCommentsByVideo((prev) => {
      const currentComments = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: currentComments.map((c) => {
          if (c.id === commentId) {
            const isLiked = c.likedByMe;
            return {
              ...c,
              likedByMe: !isLiked,
              likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            };
          }
          return c;
        }),
      };
    });
  };

  const uploadVideo = (video: Omit<Video, "comments" | "views" | "viewsCount" | "likes" | "likesCount" | "publishedAt">) => {
    const fullVideo: Video = {
      ...video,
      views: "0 views",
      viewsCount: 0,
      likes: "0",
      likesCount: 0,
      publishedAt: "Just now",
      comments: [],
    };

    setVideos((prev) => [fullVideo, ...prev]);

    // Initial comments list for this new video
    setCommentsByVideo((prev) => ({
      ...prev,
      [fullVideo.id]: [],
    }));
  };

  return (
    <YouTubeContext.Provider
      value={{
        videos,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeTab,
        setActiveTab,
        currentPlayingVideo,
        setCurrentPlayingVideo,
        subscribedChannels,
        toggleSubscribe,
        likedVideos,
        dislikedVideos,
        toggleLikeVideo,
        toggleDislikeVideo,
        watchHistory,
        addVideoToHistory,
        clearHistory,
        watchLaterVideos,
        toggleWatchLater,
        commentsByVideo,
        addComment,
        deleteComment,
        likeComment,
        uploadVideo,
        isDarkMode,
        setIsDarkMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => {
  const context = useContext(YouTubeContext);
  if (context === undefined) {
    throw new Error("useYouTube must be used within a YouTubeProvider");
  }
  return context;
};
