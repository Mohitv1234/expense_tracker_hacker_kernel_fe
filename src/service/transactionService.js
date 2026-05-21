import axiosInstance from './axiosInstence'

// =====================================
// GET ALL TRANSACTIONS
// =====================================

export const getTransactions = async (
    page = 1,
    limit = 10
) => {
    const response =
        await axiosInstance.get(
            `/transaction?page=${page}&limit=${limit}`
        )

    return response.data
}

// =====================================
// GET SINGLE TRANSACTION
// =====================================

export const getTransactionById =
    async id => {
        const response =
            await axiosInstance.get(
                `/transaction/${id}`
            )

        return response.data
    }

// =====================================
// CREATE TRANSACTION
// =====================================

export const createTransaction =
    async payload => {
        const response =
            await axiosInstance.post(
                '/transaction',
                payload
            )

        return response.data
    }

// =====================================
// UPDATE TRANSACTION
// =====================================

export const updateTransaction =
    async (id, payload) => {
        const response =
            await axiosInstance.put(
                `/transaction/${id}`,
                payload
            )

        return response.data
    }

// =====================================
// DELETE TRANSACTION
// =====================================

export const deleteTransaction =
    async id => {
        const response =
            await axiosInstance.delete(
                `/transaction/${id}`
            )

        return response.data
    }

// =====================================
// SEARCH TRANSACTIONS
// =====================================

export const searchTransactions =
    async search => {
        const response =
            await axiosInstance.get(
                `/transaction/search?search=${search}`
            )

        return response.data
    }