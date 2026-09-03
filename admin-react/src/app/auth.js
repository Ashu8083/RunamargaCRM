// src/app/auth.js
import axios from 'axios'

import { API_BASE_URL } from '../config/url'

const authClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

const AUTH_ENDPOINTS = Object.freeze({
    login: '/auth/login',
    requestOtp: '/auth/request-otp',
    verifyOtp: '/auth/verify-otp',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
})

const AUTH_USER_KEY = 'auth_user'

const notifyAuthChanged = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:changed'))
    }
}

const readJson = (value) => {
    if (!value) return null

    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

const normalizeStatusResponse = (response, fallbackMessage) => {
    const body = response?.data ?? response ?? {}
    const data = body?.data ?? body
    const source =
        typeof data === 'object' && data !== null
            ? data
            : {}

    return {
        ...source,
        success:
            body?.success ??
            source?.success ??
            true,
        message:
            body?.message ||
            source?.message ||
            fallbackMessage,
    }
}

export const getCurrentUser = () => {
    return readJson(
        localStorage.getItem(AUTH_USER_KEY)
    )
}

export const getActiveContext = (
    user = getCurrentUser()
) => {
    if (!user) return null

    const contexts = Array.isArray(user.contexts)
        ? user.contexts
        : []

    if (contexts.length === 0) {
        return null
    }

    const storedContextId =
        localStorage.getItem('active_context_id')

    if (storedContextId) {
        const storedContext = contexts.find(
            (context) =>
                String(context.id) ===
                String(storedContextId)
        )

        if (storedContext) {
            return storedContext
        }
    }

    return (
        contexts.find(
            (context) => context.is_default
        ) || contexts[0]
    )
}

export const setActiveContext = (context) => {
    if (!context?.id) return

    localStorage.setItem(
        'active_context_id',
        String(context.id)
    )

    notifyAuthChanged()
}

export const clearAuthSession = () => {
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem('active_context_id')

    notifyAuthChanged()
}

export const isAuthenticated = () => {
    return Boolean(getCurrentUser())
}

export const requestLoginOtp = async (payload) => {
    const response = await authClient.post(
        AUTH_ENDPOINTS.requestOtp,
        payload
    )

    return normalizeStatusResponse(
        response,
        'OTP sent successfully.'
    )
}

export const verifyLoginOtp = async ({
    emailId,
    otp,
    deviceId,
    device,
    ipAddress,
    location,
}) => {
    const response = await authClient.post(
        AUTH_ENDPOINTS.verifyOtp,
        {
            emailId,
            otp,
            deviceId,
            device,
            ipAddress,
            location,
        }
    )

    const result = normalizeStatusResponse(
        response,
        'Login successful.'
    )

    if (response.data?.employee_id) {
        result.employee_id =
            response.data.employee_id
    }

    if (response.data?.user) {
        localStorage.setItem(
            AUTH_USER_KEY,
            JSON.stringify(response.data.user)
        )
    }

    notifyAuthChanged()

    return result
}

export const refreshAccessToken = async () => {
    await authClient.post(
        AUTH_ENDPOINTS.refresh
    )

    return true
}

export const logout = async () => {
    await authClient
        .post(AUTH_ENDPOINTS.logout)
        .catch(() => {})

    clearAuthSession()

    if (typeof window !== 'undefined') {
        window.location.href = '/login'
    }
}

const checkAuth = () => isAuthenticated()

export default checkAuth