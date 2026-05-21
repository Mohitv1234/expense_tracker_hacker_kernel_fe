import axiosInstance from './axiosInstence'

export const registerUser = async payload => {
    try {
        const response = await axiosInstance.post(
            '/auth/register',
            payload
        )

        return response.data
    } catch (error) {
        throw error.response?.data || error
    }
}


export const loginUser = async payload => {
    try {
        const response = await axiosInstance.post(
            '/auth/login',
            payload
        )

        return response.data
    } catch (error) {
        throw error.response?.data || error
    }
}


/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/
export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get(
            '/auth/me'
        )

        return response.data
    } catch (error) {
        throw error.response?.data || error
    }
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/
export const updateProfile = async payload => {
    try {
        const response = await axiosInstance.put(
            '/auth/update-profile',
            payload
        )

        // Update local user
        if (response.data?.user) {
            localStorage.setItem(
                'user',
                JSON.stringify(response.data.user)
            )
        }

        return response.data
    } catch (error) {
        throw error.response?.data || error
    }
}
