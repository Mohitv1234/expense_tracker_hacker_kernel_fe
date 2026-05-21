import axiosInstance from './axiosInstence';

export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get('/dashboard/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getMonthlyExpenseAnalytics = async () => {
    try {
        const response = await axiosInstance.get('/dashboard/monthly-expense');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
