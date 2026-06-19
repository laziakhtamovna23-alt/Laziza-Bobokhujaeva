import React, { useState } from "react";
import { useYouTube } from "../context/YouTubeContext";
import { X, Video, Sparkles, AlertCircle } from "lucide-react";
import { CATEGORIES } from "../data/videos";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadVideo, isDarkMode } = useYouTube();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Music");
  const [duration, setDuration] = useState("10:24");
  const [videoUrl, setVideoUrl] = useState("dQw4w9WgXcQ"); // Default rickroll so there's a real working fallback!
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [channelName, setChannelName] = useState("My Creator Studio");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a video title");
      return;
    }
    setError("");

    // Automatically assign suitable mock high-quality Unsplash image if blank
    let finalThumb = thumbnailUrl.trim();
    if (!finalThumb) {
      if (category === "Music") {
        finalThumb = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80";
      } else if (category === "Coding") {
        finalThumb = "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=80";
      } else if (category === "Tech") {
        finalThumb = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80";
      } else {
        finalThumb = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80";
      }
    }

    uploadVideo({
      id: videoUrl.trim() || "dQw4w9WgXcQ",
      title,
      description: description || "Uploaded via YouTube AI Studio Creator Panel.\nEnjoy this mock playback stream!",
      thumbnailUrl: finalThumb,
      videoUrl: videoUrl.trim() || "dQw4w9WgXcQ",
      duration: duration || "12:00",
      channelId: "creator_studio",
      channelName: channelName || "My Creator Studio",
      channelAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      channelSubscribers: "1 subscriber",
      subscribersCount: 1,
      isVerified: false,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle("");
      setDescription("");
      onClose();
    }, 1800);
  };

  // Pre-populate with random cool dummy information so they can click "Upload" immediately
  const populateWithTemplate = () => {
    const randomID = Math.random();
    if (randomID > 0.6) {
      setTitle("Cooking Michelin Star Scrambled Eggs under 5 mins 🍳");
      setDescription("The secret recipe: Keep moving off and on the burner, fold carefully, throw in butter and chives!");
      setCategory("Cooking");
      setDuration("04:32");
      setVideoUrl("mKbeInT8cQY");
      setThumbnailUrl("https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80");
    } else if (randomID > 0.3) {
      setTitle("Coding an epic Flappy Bird game using only HTML and CSS!");
      setDescription("No frameworks, no canvas libraries, purely HTML flexbox and CSS @keyframes animation!");
      setCategory("Coding");
      setDuration("18:14");
      setVideoUrl("Ke90Tje7VS0");
      setThumbnailUrl("https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80");
    } else {
      setTitle("Lofi Girl Live Beats - Rainy Cozy Winter edition ❄️");
      setDescription("Sip some mocha, cuddle with your cat, and enjoy these chill winter jazz chill beats.");
      setCategory("Music");
      setDuration("3:24:12");
      setVideoUrl("95be5DOnrAI");
      setThumbnailUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden relative ${
          isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-800"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            <h2 className="font-sans font-bold text-base">Creator Studio - Upload Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-500/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Splash */}
        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-green-600">Video Uploaded Successfully!</h3>
            <p className="text-xs text-zinc-400">Your video is now live on the YouTube main feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Quick Fill Tool Button */}
            <div className="flex justify-between items-center bg-red-600/10 border border-red-500/20 p-3 rounded-lg">
              <div className="text-xs">
                <span className="font-bold text-red-500">Need some ideas?</span> Click quick fill to write a random high-quality mock creative draft automatically!
              </div>
              <button
                type="button"
                onClick={populateWithTemplate}
                className="px-2.5 py-1 text-[11px] bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shrink-0 transition-colors"
              >
                Quick Fill Draft
              </button>
            </div>

            {error && (
              <div className="flex gap-2 items-center p-3 bg-red-500/10 text-red-500 text-xs border border-red-500/25 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500">Video Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass React tutorial 101"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                    isDarkMode
                      ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                  }`}
                  required
                />
              </div>

              {/* YouTube Video ID / code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500" title="Actual video playable inside YouTube iframe">
                    YouTube Video ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. dQw4w9WgXcQ (Rick Astley)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                        : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Duration (Min/Sec)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15:42"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                        : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                        : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-850"
                    }`}
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Creator Channel Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Code Studio"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                        : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                    }`}
                  />
                </div>
              </div>

              {/* Thumbnail URL embed keyword */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500">Thumbnail Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Unsplash URL, or leave blank for custom thematic photo"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-lg border outline-none ${
                    isDarkMode
                      ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                  }`}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500">Video Description</label>
                <textarea
                  placeholder="Tell your viewers about your video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`px-3 py-2 text-sm rounded-lg border outline-none resize-none ${
                    isDarkMode
                      ? "bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      : "bg-zinc-50 border-zinc-300 focus:border-zinc-900 text-zinc-800"
                  }`}
                />
              </div>
            </div>

            {/* Cancel/Publish Buttons */}
            <div className="flex gap-2 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-full hover:bg-zinc-500/10 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
              >
                Publish Video
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
