import axiosInstance from './axiosInstence'

// ========================================
// ACCOUNTS
// ========================================

export const getAccounts = async () => {
    const response =
        await axiosInstance.get('/accounts')

    return response.data
}

export const createAccount = async (
    payload
) => {
    const response =
        await axiosInstance.post(
            '/accounts',
            payload
        )

    return response.data
}

export const updateAccount = async (
    id,
    payload
) => {
    const response =
        await axiosInstance.put(
            `/accounts/${id}`,
            payload
        )

    return response.data
}

export const deleteAccount = async id => {
    const response =
        await axiosInstance.delete(
            `/accounts/${id}`
        )

    return response.data
}

// ========================================
// CATEGORIES
// ========================================

export const getCategories =
    async () => {
        const response =
            await axiosInstance.get(
                '/categories'
            )

        return response.data
    }

export const createCategory =
    async payload => {
        const response =
            await axiosInstance.post(
                '/categories',
                payload
            )

        return response.data
    }

export const updateCategory =
    async (id, payload) => {
        const response =
            await axiosInstance.put(
                `/categories/${id}`,
                payload
            )

        return response.data
    }

export const deleteCategory =
    async id => {
        const response =
            await axiosInstance.delete(
                `/categories/${id}`
            )

        return response.data
    }

// ========================================
// TRANSACTION TYPES
// ========================================

export const getTransactionTypes =
    async () => {
        const response =
            await axiosInstance.get(
                '/transaction-type'
            )

        return response.data
    }

export const createTransactionType =
    async (payload) => {
        const response =
            await axiosInstance.post(
                '/transaction-type',
                payload
            )

        return response.data
    }