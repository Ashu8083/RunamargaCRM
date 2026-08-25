import axios from 'axios'

import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    refreshAccessToken,
} from './auth'

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || '',
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
        const accessToken = getAccessToken()

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

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
        const isUnauthorized = error.response?.status === 401

        if (
            isUnauthorized &&
            originalRequest &&
            !originalRequest._retry &&
            getRefreshToken()
        ) {
            originalRequest._retry = true

            try {
                refreshRequest = refreshRequest || refreshAccessToken()
                const accessToken = await refreshRequest
                refreshRequest = null

                originalRequest.headers.Authorization = `Bearer ${accessToken}`

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
