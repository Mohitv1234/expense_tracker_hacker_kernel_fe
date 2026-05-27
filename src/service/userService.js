import axiosInstance from './axiosInstence';

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/user/get-all-users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getProfile = async () => {
    try {
        const response = await axiosInstance.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateProfile = async (data) => {
    try {
        const response = await axiosInstance.put('/user/profile', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await axiosInstance.put('/user/change-password', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
