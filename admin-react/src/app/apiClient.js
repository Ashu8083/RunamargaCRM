import axios from 'axios'

import {
    clearAuthSession,
    refreshAccessToken,
} from './auth'

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || '',
    withCredentials: true,
})

let refreshRequest = null

const showGlobalLoader = () => {
    if (typeof document !== 'undefined') {
        document.body.classList.add('loading-indicator')
    }
}

const hideGlobalLoader = () => {
    if (typeof document !== 'undefined') {
        document.body.classList.remove('loading-indicator')
    }
}

apiClient.interceptors.request.use(
    (config) => {
        /*
         * Authentication is handled by HttpOnly cookies.
         *
         * We intentionally do NOT read the access token
         * from localStorage or manually create an
         * Authorization header.
         */

        showGlobalLoader()

        return config
    },
    (error) => {
        hideGlobalLoader()
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        hideGlobalLoader()
        return response
    },

    async (error) => {
        hideGlobalLoader()

        const originalRequest = error.config
        const isUnauthorized =
            error.response?.status === 401

        /*
         * If the API says the access token is expired,
         * try to get a new access token using the
         * HttpOnly refresh-token cookie.
         */
        if (
            isUnauthorized &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                refreshRequest =
                    refreshRequest ||
                    refreshAccessToken()

                await refreshRequest

                refreshRequest = null

                /*
                 * The refresh endpoint has already
                 * set a new access_token cookie.
                 *
                 * Retry the original request.
                 */
                return apiClient(originalRequest)

            } catch (refreshError) {
                refreshRequest = null

                clearAuthSession()

                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient