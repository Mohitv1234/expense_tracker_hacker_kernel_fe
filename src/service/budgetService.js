import axiosInstance from './axiosInstence';

export const createBudget = async (data) => {
    try {
        const response = await axiosInstance.post('/budget', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getBudgets = async () => {
    try {
        const response = await axiosInstance.get('/budget');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getBudgetUsage = async (id) => {
    try {
        const response = await axiosInstance.get(`/budget/usage/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
