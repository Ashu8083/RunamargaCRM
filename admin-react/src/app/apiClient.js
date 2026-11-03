// admin-react/src/app/apiClient.js

import axios from 'axios'

import {
    clearAuthSession,
    refreshAccessToken,
} from './auth'

import { API_BASE_URL } from '../config/url'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
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
         */

        /*
         * Attach the currently selected EmployeeContext ID.
         */
        if (typeof localStorage !== 'undefined') {
            const contextId = localStorage.getItem(
                'active_context_id'
            )

            if (contextId && Number(contextId) > 0) {
                config.headers = config.headers || {}

                config.headers['X-Employee-Context-ID'] =
                    String(contextId)
            }
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

        const isUnauthorized =
            error.response?.status === 401

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

                const retryRequest = {
                    ...originalRequest,
                    headers: undefined,
                }

                if (typeof retryRequest.data === 'string') {
                    try {
                        retryRequest.data = JSON.parse(
                            retryRequest.data
                        )
                    } catch (parseError) {
                        console.error(
                            'Failed to restore retry request body:',
                            parseError
                        )
                    }
                }

                return apiClient(retryRequest)

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