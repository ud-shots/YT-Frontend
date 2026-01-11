import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getVideos, deleteVideo as apiDeleteVideo } from '../Common/Apis/ApiService';
import { DashboardStats, VideoData } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Eye, ThumbsUp, Calendar, CheckCircle2, AlertCircle, Clock, MoreVertical, Trash2, ExternalLink, ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAlert } from '../Common/Toasts/AlertProvider';
import { useSuccess } from '../Common/Toasts/SuccessProvider';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</h3>
    </div>
    <div className={clsx("p-3 rounded-full bg-opacity-10", color)}>
      <Icon className={clsx("w-6 h-6", color.replace('bg-', 'text-'))} />
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    published: "bg-green-100 text-green-700 border-green-200",
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
    uploading: "bg-yellow-100 text-yellow-700 border-yellow-200",
    checking: "bg-purple-100 text-purple-700 border-purple-200",
    blocked: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const icons: Record<string, any> = {
    published: CheckCircle2,
    scheduled: Calendar,
    processing: Clock,
    uploading: Clock,
    checking: Eye,
    blocked: AlertCircle,
    draft: MoreVertical
  };

  const Icon = icons[status] || MoreVertical;

  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", styles[status])}>
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { alert } = useAlert();
  const { success } = useSuccess();

  const loadData = async () => {
    try {
      const [statsResponse, videosResponse] = await Promise.all([
        getDashboardStats(),
        getVideos()
      ]);

      if (statsResponse.status) {
        setStats(statsResponse.data);
      }

      if (videosResponse.status) {
        setVideos(videosResponse.data.videos);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      alert('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Poll for status updates
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await apiDeleteVideo(id);
        if (response.status) {
          success('Video deleted successfully');
          loadData();
        } else {
          alert(response.message || 'Failed to delete video');
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video');
      }
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400">Loading dashboard...</div>;

  // Mock data for chart
  const chartData = videos.slice(0, 7).reverse().map(v => ({
    name: v.filename?.substring(0, 10) + '...',
    views: v.views || 0,
    likes: v.likes || 0
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Channel performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={stats?.totalViews || 0} icon={Eye} color="bg-blue-500 text-blue-600" />
        <StatCard label="Total Likes" value={stats?.totalLikes || 0} icon={ThumbsUp} color="bg-emerald-500 text-emerald-600" />
        <StatCard label="Scheduled" value={stats?.scheduledVideos || 0} icon={Calendar} color="bg-violet-500 text-violet-600" />
        <StatCard label="Pending" value={stats?.pendingUploads || 0} icon={Clock} color="bg-amber-500 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Videos List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900">Recent Videos</h2>
            <button onClick={loadData} className="text-sm text-blue-600 hover:underline">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Video</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Metrics</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No videos found. Start by uploading one!
                    </td>
                  </tr>
                ) : (
                  videos.map((video) => (
                    <tr key={video.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={video.thumbnail_url || `https://picsum.photos/seed/${video.id}/320/180`} alt="" className="w-16 h-9 object-cover rounded bg-slate-200" />
                          <div className="max-w-[150px] md:max-w-[200px]">
                            <p className="font-medium text-slate-900 truncate cursor-pointer hover:underline" title={video.title} onClick={() => navigate(`/video/${video.id}`)}>{video.title}</p>
                            <p className="text-xs text-slate-500 truncate">{video.filename}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={video.status} />
                        {video.status === 'uploading' || video.status === 'processing' ? (
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${video.progress || 0}%` }}></div>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views || 0}</span>
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {video.likes || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_video_id}`, '_blank')}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-500" 
                            title="View on YouTube"
                            disabled={!video.youtube_video_id}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(video.id)}
                            className="p-2 hover:bg-red-50 rounded-full text-red-500" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <h2 className="font-semibold text-slate-900 mb-6">Performance Trend</h2>
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" hide />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="likes" fill="#10b981" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;