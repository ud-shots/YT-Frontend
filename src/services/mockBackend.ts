import { VideoData, DashboardStats } from "../../types";
import { v4 as uuidv4 } from 'uuid';

// Simulating a database using LocalStorage
const STORAGE_KEY = 'tubeflow_db_v1';

const getDb = (): VideoData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveDb = (data: VideoData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const fetchVideos = async (): Promise<VideoData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return getDb().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const fetchStats = async (): Promise<DashboardStats> => {
  const videos = getDb();
  return {
    totalViews: videos.reduce((acc, v) => acc + v.views, 0),
    totalLikes: videos.reduce((acc, v) => acc + v.likes, 0),
    pendingUploads: videos.filter(v => ['uploading', 'processing', 'checking'].includes(v.status)).length,
    scheduledVideos: videos.filter(v => v.status === 'scheduled').length,
  };
};

export const createVideoEntry = async (
  sourceType: 'file' | 'link',
  source: string | File,
  initialSeo: any
): Promise<VideoData> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const id = uuidv4();
  const filename = sourceType === 'file' && source instanceof File ? source.name : source as string;
  
  const newVideo: VideoData = {
    id,
    sourceType,
    sourceUrl: sourceType === 'link' ? source as string : undefined,
    filename,
    thumbnailUrl: `https://picsum.photos/seed/${id}/320/180`,
    seo: {
      title: initialSeo?.title || filename,
      description: initialSeo?.description || '',
      tags: initialSeo?.tags || [],
      keywords: initialSeo?.keywords || [],
      hashtags: initialSeo?.hashtags || [],
    },
    visibility: 'private',
    status: 'draft',
    progress: 0,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };

  const db = getDb();
  saveDb([...db, newVideo]);
  return newVideo;
};

export const updateVideo = async (id: string, updates: Partial<VideoData>) => {
  const db = getDb();
  const index = db.findIndex(v => v.id === id);
  if (index !== -1) {
    db[index] = { ...db[index], ...updates };
    saveDb(db);
  }
};

export const deleteVideo = async (id: string) => {
  const db = getDb();
  saveDb(db.filter(v => v.id !== id));
};

// Simulation of the upload/processing pipeline
export const startProcessingSimulation = async (videoId: string, onUpdate: (v: VideoData) => void) => {
  // 1. Uploading
  await updateVideo(videoId, { status: 'uploading', progress: 0 });
  for (let i = 0; i <= 100; i += 20) {
    await new Promise(r => setTimeout(r, 400));
    await updateVideo(videoId, { progress: i });
    onUpdate((await fetchVideos()).find(v => v.id === videoId)!);
  }

  // 2. Processing
  await updateVideo(videoId, { status: 'processing', progress: 0 });
  await new Promise(r => setTimeout(r, 1500));
  await updateVideo(videoId, { progress: 100 });
  onUpdate((await fetchVideos()).find(v => v.id === videoId)!);

  // 3. Checks (Copyright/Region)
  await updateVideo(videoId, { status: 'checking', progress: 0 });
  await new Promise(r => setTimeout(r, 1500));
  
  // Random chance of block for demo purposes (very low)
  const blocked = Math.random() > 0.95;
  
  if (blocked) {
    await updateVideo(videoId, { 
      status: 'blocked', 
      rejectionReason: 'Copyright content detected in audio track.' 
    });
  } else {
    // Check scheduling
    const video = (await fetchVideos()).find(v => v.id === videoId);
    if (video?.scheduledAt) {
      await updateVideo(videoId, { status: 'scheduled' });
    } else {
      await updateVideo(videoId, { status: 'published', publishedAt: new Date().toISOString() });
    }
  }
  onUpdate((await fetchVideos()).find(v => v.id === videoId)!);
};