import axiosInstance from './axiosInstence';

export const createTag = async (data) => {
    try {
        const response = await axiosInstance.post('/tag', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getTags = async () => {
    try {
        const response = await axiosInstance.get('/tag');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteTag = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tag/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
