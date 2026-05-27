import axiosInstance from './axiosInstence';

export const createLoan = async (data) => {
    try {
        const response = await axiosInstance.post('/loan', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getLoans = async () => {
    try {
        const response = await axiosInstance.get('/loan');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getLoanById = async (id) => {
    try {
        const response = await axiosInstance.get(`/loan/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const payLoanInstallment = async (data) => {
    try {
        const response = await axiosInstance.post('/loan/pay', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteLoan = async (id) => {
    try {
        const response = await axiosInstance.delete(`/loan/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const sendReminder = async (formData)=>{
    try {
        const response = await axiosInstance.get(`/loan/payment-reminder`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}