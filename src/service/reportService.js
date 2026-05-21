import axiosInstance from './axiosInstence';

export const getMonthlyReport = async (filters) => {
    try {
        const response = await axiosInstance.get(
            '/report/monthly',
            {
                params: {
                    ...filters
                },
            }
        )
        return response.data
    } catch (error) {
        throw error.response?.data || error
    }
}

export const getCategoryReport = async (filters) => {
    try {
        const response = await axiosInstance.get(
            '/report/category',
            {
                params: {
                    ...filters
                },
            }
        )
        return response.data
    } catch (error) {
        throw error.response?.data || error
    }

}
