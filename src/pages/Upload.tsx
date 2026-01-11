import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link, Wand2, Calendar, Check, AlertTriangle, PlayCircle } from 'lucide-react';
import { generateVideoSEO } from '../services/geminiService';
import { createVideoEntry, startProcessingSimulation } from '../services/mockBackend';
import { uploadVideo } from '../Common/Apis/ApiService';
import { SeoMetadata } from '../../types';
import { clsx } from 'clsx';

const UploadPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'file' | 'link'>('file');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [metadata, setMetadata] = useState<SeoMetadata>({
    title: '', description: '', tags: [], keywords: [], hashtags: []
  });
  const [scheduleDate, setScheduleDate] = useState('');
  const [visibility, setVisibility] = useState('public');

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // Create FormData payload
    const formData = new FormData();
    
    // Add visibility
    formData.append('visibility', visibility);
    
    // Add file or URL based on active tab
    if (activeTab === 'file' && file) {
      formData.append('file', file);
      formData.append('url', '');
    } else if (activeTab === 'link' && link) {
      formData.append('url', link);
      formData.append('file', '');
    }
    
    // Add schedule if provided
    formData.append('schedule', scheduleDate || '');
    
    try {
      // Send to backend API
      const response = await uploadVideo(formData);
      
      if (response.status) {
        // Navigate to dashboard after successful upload
        navigate('/');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Video</h1>
        <p className="text-slate-500 mt-1">AI-powered ingestion and optimization</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between px-2 md:px-10 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
        {[1, 2].map((s) => (
          <div key={s} className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 bg-white transition-colors",
            step >= s ? "border-blue-600 text-blue-600" : "border-slate-300 text-slate-400"
          )}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">1. Select Source</h2>
            
            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-full md:w-fit">
              <button
                onClick={() => setActiveTab('file')}
                className={clsx("flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'file' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveTab('link')}
                className={clsx("flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'link' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
              >
                Paste Link
              </button>
            </div>

            {activeTab === 'file' ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 md:p-12 text-center hover:bg-slate-50 transition-colors">
                <input type="file" id="video-upload" className="hidden" accept="video/*" onChange={handleFileChange} />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-slate-400 mb-4" />
                  <span className="text-lg font-medium text-slate-700 break-all">
                    {file ? file.name : "Click to select video"}
                  </span>
                  <span className="text-sm text-slate-400 mt-2">MP4, MOV, or AVI (Max 2GB)</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="url" 
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>
                
              </div>
            )}

            {error && <div className="text-red-500 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={isGenerating || (activeTab === 'file' && !file) || (activeTab === 'link' && !link)}
                className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" /> Generating AI SEO...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Next: Finalize & Publish
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">2. Finalize & Publish</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Visibility</label>
                <div className="space-y-2">
                  {['public', 'private', 'unlisted'].map((v) => (
                    <label key={v} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input 
                        type="radio" 
                        name="visibility" 
                        value={v} 
                        checked={visibility === v}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="capitalize text-slate-700 font-medium">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Schedule (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="datetime-local" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <p className="text-xs text-slate-500">Leave blank to publish immediately based on visibility settings.</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
               <Check className="w-5 h-5 flex-shrink-0" />
               <p>
                 System will automatically upload as <strong>PRIVATE</strong>, apply AI metadata, check for copyright/region blocks, and then release.
               </p>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-medium">Back</button>
              <button
                onClick={handleUpload}
                className="w-auto flex items-center gap-2 px-4 md:px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg shadow-green-200"
              >
                <PlayCircle className="w-5 h-5" /> <span className="hidden md:inline">Start Automation</span><span className="md:hidden">Publish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;