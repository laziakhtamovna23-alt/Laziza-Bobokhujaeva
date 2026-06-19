export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  publishedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // YouTube video ID or full URL
  duration: string;
  views: string;
  viewsCount: number;
  publishedAt: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  channelSubscribers: string;
  subscribersCount: number;
  likes: string;
  likesCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  comments: Comment[];
  category: string;
  isVerified?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  subscribersCount: number;
  isSubscribed?: boolean;
  isVerified?: boolean;
}

export interface Category {
  id: string;
  name: string;
}
