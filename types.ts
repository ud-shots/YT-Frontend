export type VideoStatus = 
  | 'draft' 
  | 'uploading' 
  | 'processing' 
  | 'checking' 
  | 'scheduled' 
  | 'published' 
  | 'rejected' 
  | 'blocked';

export interface SeoMetadata {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  hashtags: string[];
}

export interface VideoData {
  id: string;
  sourceType: 'file' | 'link';
  sourceUrl?: string;
  filename?: string;
  thumbnailUrl?: string;
  
  // Metadata
  seo: SeoMetadata;
  
  // Scheduling
  visibility: 'private' | 'public' | 'unlisted';
  scheduledAt?: string; // ISO string
  publishedAt?: string; // ISO string
  
  // Status & Validation
  status: VideoStatus;
  progress: number; // 0-100
  rejectionReason?: string;
  
  // Metrics
  views: number;
  likes: number;
  comments: number;
  
  createdAt: string;
}

export interface DashboardStats {
  totalViews: number;
  totalLikes: number;
  pendingUploads: number;
  scheduledVideos: number;
}