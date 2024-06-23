import axios from 'axios';
import {NotificationInstance} from "antd/lib/notification/interface";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const registerUser = async (userData: any, instance: NotificationInstance) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleError(error, instance);
    }
};

export const loginUser = async (credentials: any, instance: NotificationInstance) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        handleError(error, instance);
    }
};

export const post = async (endpoint: string, instance: NotificationInstance, body?: any, isFileUpload: boolean = false) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
    };

    if (isFileUpload) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    const config = {
        headers
    };
    try {
        const response = await api.post(endpoint, body, config);
        return response.data;
    } catch (error) {
        handleError(error, instance);
    }
}

export const get = async (endpoint: string, instance: NotificationInstance, params?: any) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params
    };
    try {
        const response = await api.get(endpoint, config);
        return response.data;
    } catch (error) {
        handleError(error, instance);
    }
}

const handleError = (error: any, instance: NotificationInstance) => {
    let message = "Something wrong! Please Try again!";
    if (error?.response?.data?.message) {
        message = error.response.data.message;
    }
    const openNotificationWithIcon = (type: NotificationType) => {
        instance[type]({
            message,
        });
    };
    openNotificationWithIcon('error');
};
