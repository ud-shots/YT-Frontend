import React, { useEffect, useState } from 'react';
import { useAlert } from '../Common/Toasts/AlertProvider';
import { useSuccess } from '../Common/Toasts/SuccessProvider';
import { useLoader } from '../Common/Loader/useLoader';
import { getAllYoutubeCredencial } from '../Common/Apis/ApiService';

const TokenExpiry = () => {
  const { alert } = useAlert();
  const { success } = useSuccess();
  const { startLoading, stopLoading } = useLoader();
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes

  const [channels, setChannels] = useState([]);

  const fetchCredential = async () => {
    try {
      startLoading();
      const response = await getAllYoutubeCredencial();
      stopLoading();

      if (response.status && response.data) {
        setChannels(response.data);
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

  useEffect(() => {
    fetchCredential();
  }, []);

  const getStatusColor = (token_expiry) => {
    const timeRemaining = getTimeRemaining(token_expiry);
    if (timeRemaining.total < 0) return 'bg-red-100 text-red-800 border-red-200';
    if (timeRemaining.days <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const parseExpiry = (expiry: any): number => {
    if (!expiry) return 0;

    let expiryUtcMs: number;

    if (expiry instanceof Date) {
      expiryUtcMs = expiry.getTime();
    } else {
      const parsed = Date.parse(expiry);
      if (isNaN(parsed)) {
        console.warn("⚠️ Invalid token_expiry format:", expiry);
        return 0; // force refresh
      }
      expiryUtcMs = parsed;
    }

    return expiryUtcMs;
  };

  const getTimeRemaining = (token_expiry: any) => {
    if (!token_expiry) {
      return { total: 0, days: 0, hours: 0, minutes: 0 };
    }

    const expiryUtcMs = parseExpiry(token_expiry);
    if (!expiryUtcMs) {
      return { total: 0, days: 0, hours: 0, minutes: 0 };
    }

    // Convert NOW to IST
    const nowIstMs = Date.now() + IST_OFFSET_MS;

    // Convert EXPIRY to IST
    const expiryIstMs = expiryUtcMs + IST_OFFSET_MS;

    const diffTime = Math.max(0, expiryIstMs - nowIstMs);

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (diffTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      total: diffTime,
      days,
      hours,
      minutes,
    };
  };


  const getStatusText = (token_expiry) => {
    const timeRemaining = getTimeRemaining(token_expiry);
    if (timeRemaining.total < 0) return 'Expired';
    if (timeRemaining.days <= 7) return 'Expiring Soon';
    return 'Active';
  };

  const formatTimeRemaining = (token_expiry) => {
    const time = getTimeRemaining(token_expiry);

    if (time.total < 0) {
      const absDays = Math.abs(time.days);
      const absHours = Math.abs(time.hours);
      const absMinutes = Math.abs(time.minutes);
      return `Expired ${absDays}d ${absHours}h ${absMinutes}m ago`;
    }

    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m remaining`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m remaining`;
    } else {
      return `${time.minutes}m remaining`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Token Expiry Manager</h1>
          <p className="text-gray-600 mb-8">Monitor your subscription expiration dates</p>

          {channels.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">No channels found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {channels.map((channel, index) => {
                const timeRemaining = getTimeRemaining(channel.token_expiry);

                return (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {channel.channel_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Token Expires: {new Date(channel.token_expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className={`font-medium ${timeRemaining.total < 0 ? 'text-red-600' : timeRemaining.days <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                            ({formatTimeRemaining(channel.token_expiry)})
                          </span>
                        </div>
                      </div>

                      <div className={`px-4 py-2 rounded-lg border-2 font-medium text-sm ${getStatusColor(channel.token_expiry)}`}>
                        {getStatusText(channel.token_expiry)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenExpiry;