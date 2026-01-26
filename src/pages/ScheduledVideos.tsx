import React, { useEffect, useState } from 'react';
import { useAlert } from '../Common/Toasts/AlertProvider';
import { useSuccess } from '../Common/Toasts/SuccessProvider';
import { useLoader } from '../Common/Loader/useLoader';
import { getScheduledVideos, moveToScheduledMedia } from '../Common/Apis/ApiService';

const ScheduledVideos = () => {
  const { alert } = useAlert();
  const { success } = useSuccess();
  const { startLoading, stopLoading } = useLoader();

  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'initiate', label: 'Initiate' },
    { value: 'pending', label: 'Pending' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'uploading', label: 'Uploading' },
  ];

  const fetchCredential = async (status = 'all') => {
    try {
      startLoading();
      const queryParams = status !== 'all' ? `?status=${status.toLowerCase()}` : '';
      const response = await getScheduledVideos(queryParams);
      stopLoading();
      if (response.status && response.data) {
        setData(response.data);
        success(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
      stopLoading();
      alert("Please Try Again!");
    }
  };

  const handleUploadNow = async (id: string) => {
    try {
      startLoading();
      const response = await moveToScheduledMedia(id);
      if (response.status) {
        success(response.message);
        fetchCredential(selectedStatus);
        stopLoading();
      } else {
        alert(response.message);
        stopLoading();
      }
    } catch (error) {
      console.log(error);
      alert("Please Try Again!");
    }
  };

  useEffect(() => {
    fetchCredential(selectedStatus);
  }, [selectedStatus]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'bg-pink-100 text-pink-800 border-pink-300',
      facebook: 'bg-blue-100 text-blue-800 border-blue-300',
      youtube: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[platform?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      initiate: 'bg-blue-100 text-blue-800 border-blue-300',
      uploading: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusCount = (status) => {
    if (status === 'all') return data.length;
    return data.filter(video => video.status?.toLowerCase() === status).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (!url) return 'N/A';
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduled Videos</h1>
          <p className="text-gray-600">Monitor and manage your scheduled video uploads</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filter by Status</h2>
            <span className="text-sm text-gray-500">{data.length} videos</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                  {!isActive && data.length > 0 && (
                    <span className="ml-2 text-xs opacity-70">
                      ({getStatusCount(option.value)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No videos found</h3>
            <p className="text-gray-500">Schedule your first video to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((video, index) => (
              <div key={video.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getPlatformColor(video.platform)}`}>
                        {video.platform?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(video.status)}`}>
                      {video.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>

                  {/* Media Type & File Type */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      <span className="font-medium">Media:</span>
                      <span className="ml-2">{video.media_type} ({video.file_type})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">Visibility:</span>
                      <span className="ml-2 capitalize">{video.visibility}</span>
                    </div>
                  </div>

                  {/* URL or File Name */}
                  {video.type === 'url' && video.url && (
                    <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">URL</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 break-all"
                        title={video.url}
                      >
                        {truncateUrl(video.url)}
                      </a>
                    </div>
                  )}

                  {video.type === 'file' && video.file_name && (
                    <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">File</p>
                      <p className="text-sm text-gray-900 break-all">{video.file_name}</p>
                    </div>
                  )}

                  {/* Upload Status */}
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Upload Status:</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Instagram</span>
                      <span className={`px-2 py-1 rounded ${video.uploaded_insta ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {video.uploaded_insta ? '✓ Uploaded' : '✗ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Facebook</span>
                      <span className={`px-2 py-1 rounded ${video.uploaded_facebook ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {video.uploaded_facebook ? '✓ Uploaded' : '✗ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">YouTube</span>
                      <span className={`px-2 py-1 rounded ${video.uploaded_youtube ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {video.uploaded_youtube ? '✓ Uploaded' : '✗ Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {video.schedule_date && (
                      <div className="flex items-center text-xs text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Scheduled:</span>
                        <span className="ml-2">{formatDate(video.schedule_date)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2">{formatDate(video.createdAt)}</span>
                    </div>
                    <div>
                      <button onClick={() => handleUploadNow(video.id)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Upload Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledVideos;