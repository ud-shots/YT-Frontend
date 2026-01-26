interface URLConfig {
    baseUrl: string;
}


const URL: URLConfig = {
    // API 
    baseUrl : 'https://yt-backend-rvma.onrender.com/'
    // baseUrl: 'http://localhost:4061/'
};

const ENDPOINTS: any = {
    // API Endpoints
    baseUrl: URL.baseUrl,
    signIn: URL.baseUrl + 'api/auth/sign-in',
    googleSSO: URL.baseUrl + 'api/auth/google-sign-in',
    logout: URL.baseUrl + 'api/auth/logout',
    getYoutubeConsentUrl: URL.baseUrl + 'api/youtube/url',
    uploadVideo: URL.baseUrl + 'api/youtube/upload-video',
    getDashboardStats: URL.baseUrl + 'api/dashboard/stats',
    getVideos: URL.baseUrl + 'api/dashboard/videos',
    deleteVideo: URL.baseUrl + 'api/dashboard/videos/',
    fbAccessToken: URL.baseUrl + `api/facebook/get-access-token`,
    fbFinalConnect: URL.baseUrl + `api/facebook/final-connect`,
    getAllYoutubeCredencial: URL.baseUrl + `api/youtube/get-all-credential`,
    getScheduledVideos: URL.baseUrl + `api/dashboard/scheduled-videos`,
    moveToScheduledMedia: URL.baseUrl + `api/dashboard/movet-to-scheduled-media/`
};

export default ENDPOINTS;