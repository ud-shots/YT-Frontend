import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideos } from '../Common/Apis/ApiService';
import { ExternalLink, Calendar, Eye, ThumbsUp, Hash, Tag, ArrowLeft } from 'lucide-react';
import { useAlert } from '../Common/Toasts/AlertProvider';

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alert } = useAlert();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideos();
        if (response.status) {
          const videoData = response.data.videos.find((v: any) => v.id === id);
          if (videoData) {
            setVideo(videoData);
          } else {
            alert('Video not found');
            navigate('/');
          }
        } else {
          alert(response.message || 'Failed to fetch video details');
          navigate('/');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video:', error);
        alert('Failed to fetch video details');
        navigate('/');
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id, navigate, alert]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading video details...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Video not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Video Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{video.title}</h1>
              <p className="text-slate-500 mt-1">{video.filename}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_video_id}`, '_blank')}
                disabled={!video.youtube_video_id}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                View on YouTube
              </button>
            </div>
          </div>
        </div>

        {/* Video Thumbnail */}
        <div className="p-6">
          <div className="bg-slate-100 rounded-lg overflow-hidden">
            <img 
              src={video.thumbnail_url || `https://picsum.photos/seed/${video.id}/800/450`} 
              alt={video.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Video Details */}
        <div className="p-6 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Statistics</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    video.status === 'published' ? 'bg-green-100 text-green-700' :
                    video.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    video.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {video.status?.charAt(0).toUpperCase() + video.status?.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Views</span>
                  <span className="font-medium">{video.views || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Likes</span>
                  <span className="font-medium">{video.likes || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Comments</span>
                  <span className="font-medium">{video.comments || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Visibility</span>
                  <span className="font-medium capitalize">{video.visibility || 'private'}</span>
                </div>
                
                {video.scheduled_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Scheduled</span>
                    <span className="font-medium">{new Date(video.scheduled_at).toLocaleString()}</span>
                  </div>
                )}
                
                {video.published_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Published</span>
                    <span className="font-medium">{new Date(video.published_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* SEO Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <p className="mt-2 text-slate-600 whitespace-pre-wrap">{video.description || 'No description available'}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {video.tags && video.tags.length > 0 ? (
                    video.tags.map((tag: string, index: number) => (
                      <span key={index} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No tags available</span>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Keywords</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {video.keywords && video.keywords.length > 0 ? (
                    video.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        <Hash className="w-3 h-3" />
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No keywords available</span>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hashtags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {video.hashtags && video.hashtags.length > 0 ? (
                    video.hashtags.map((hashtag: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        #{hashtag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No hashtags available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;