import React, { useRef } from "react";
import { useYouTube } from "../context/YouTubeContext";
import { CATEGORIES } from "../data/videos";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CategoryChips: React.FC = () => {
  const { selectedCategory, setSelectedCategory, isDarkMode } = useYouTube();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center w-full px-4 py-3 select-none">
      {/* Scroll Left Button */}
      <button
        onClick={() => handleScroll("left")}
        className={`absolute left-1 z-10 p-1.5 rounded-full shadow-md border ${
          isDarkMode
            ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
            : "bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100"
        } transition-colors`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Category Chips container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full px-4 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                isSelected
                  ? isDarkMode
                    ? "bg-white text-zinc-900 font-semibold"
                    : "bg-zinc-950 text-white font-semibold"
                  : isDarkMode
                  ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "bg-zinc-100 text-zinc-850 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => handleScroll("right")}
        className={`absolute right-1 z-10 p-1.5 rounded-full shadow-md border ${
          isDarkMode
            ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
            : "bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100"
        } transition-colors`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
