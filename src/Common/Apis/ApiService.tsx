// src/api/apiService.ts
import apiClient from './ApiClient';
import ENDPOINTS from '../endpoints';
import { AxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
    status: boolean;
    message: string;
    data?: T;
}

interface ErrorResponse {
    response: {
        data: {
            error: {
                message: string;
            };
        };
    };
    status: number;
}

interface ValidResponseData {
    error?: {
        message: string;
    };
    success?: {
        message: string;
    };
    data?: any;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    is_file?: boolean;
}

const tokens = async (): Promise<string | null> => {
    let token = localStorage.getItem('token')
    return token
}

const errorResponse = (error: ErrorResponse): ApiResponse => {
    if (error.status == 401) {
        localStorage.clear();
        setTimeout(() => window.location.href = '/sign-in', 2000);
    }

    return { status: false, message: error?.response?.data?.error?.message || "Something went wrong!" }
}

const validRespones = async (res: { data: ValidResponseData }): Promise<ApiResponse> => {
    try {
        console.log('valid response ', res)
        if (res.data?.error) {
            console.log('valid errrrr', res.data?.error?.message)
            return { status: false, message: res.data?.error?.message }
        }

        return { status: true, message: res.data?.success?.message || '', data: res?.data?.data }
    } catch (error) {
        return { status: false, message: "Response Error!" }
    }
}

export const signIn = async (payload: any): Promise<ApiResponse> => {
    try {

        const response = await apiClient.post(ENDPOINTS.signIn, payload);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};

export const googleSSO = async (payload: any): Promise<ApiResponse> => {
    try {

        const response = await apiClient.post(ENDPOINTS.googleSSO, payload);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        console.log(error, 'hello  New Error:---------->')
        return errorResponse(error)
    }
};

export const logout = async (payload?: any): Promise<ApiResponse> => {
    try {

        const response = await apiClient.get(ENDPOINTS.logout, payload);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};

export const getYoutubeConsentUrl = async (): Promise<ApiResponse> => {
    try {

        const response = await apiClient.get(ENDPOINTS.getYoutubeConsentUrl);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};

export const uploadVideo = async (payload: FormData): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post(ENDPOINTS.uploadVideo, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const getDashboardStats = async (): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get(ENDPOINTS.getDashboardStats);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const getVideos = async (): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get(ENDPOINTS.getVideos);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const deleteVideo = async (id: string): Promise<ApiResponse> => {
    try {
        const response = await apiClient.delete(`${ENDPOINTS.deleteVideo}${id}`);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const fbAccessToken = async (payload) => {
    try {
        const response = await apiClient.post(ENDPOINTS.fbAccessToken, payload);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const finalConnect = async (payload) => {
  try {
        const response = await apiClient.post(ENDPOINTS.fbFinalConnect, payload);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message };
        }

        return { status: true, message: res.message, data: res.data };

    } catch (error: any) {
        return errorResponse(error);
    }
};

export const getAllYoutubeCredencial = async (): Promise<ApiResponse> => {
    try {

        const response = await apiClient.get(ENDPOINTS.getAllYoutubeCredencial);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};

export const getScheduledVideos = async (queryParams: string): Promise<ApiResponse> => {
    try {

        const response = await apiClient.get(`${ENDPOINTS.getScheduledVideos}${queryParams}`);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};

export const moveToScheduledMedia = async (id: string): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get(`${ENDPOINTS.moveToScheduledMedia}${id}`);
        let res = await validRespones(response)

        if (!res.status) {
            return { status: false, message: res.message }
        }

        return { status: true, message: res.message, data: res.data }

    } catch (error: any) {
        return errorResponse(error)
    }
};