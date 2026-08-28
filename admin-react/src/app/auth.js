import axios from 'axios'

export const AUTH_STORAGE_KEYS = Object.freeze({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    user: 'auth_user',
})
const authClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || '/api',
    withCredentials: true,
})
const AUTH_ENDPOINTS = Object.freeze({
    login: process.env.REACT_APP_AUTH_LOGIN_PATH || '/auth/login',
    requestOtp:
        process.env.REACT_APP_AUTH_REQUEST_OTP_PATH ||
        '/auth/request-otp',
    verifyOtp:
        process.env.REACT_APP_AUTH_VERIFY_OTP_PATH ||
        '/auth/verify-otp',
    refresh: process.env.REACT_APP_AUTH_REFRESH_PATH || '/auth/refresh',
    logout: process.env.REACT_APP_AUTH_LOGOUT_PATH || '/auth/logout',
})
const isMockApiEnabled = () => {
    console.log(
        'REACT_APP_USE_MOCK_API =',
        process.env.REACT_APP_USE_MOCK_API
    )

    return process.env.REACT_APP_USE_MOCK_API !== 'false'
}
const getMockOtp = () => process.env.REACT_APP_MOCK_OTP || '123456'

const wait = (delay = 300) => {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

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

const normalizeAuthResponse = (response) => {
    const body = response?.data ?? response ?? {}
    const data = body?.data ?? body

    return {
        accessToken:
            data?.accessToken ||
            body?.accessToken ||
            data?.access_token ||
            body?.access_token ||
            data?.token ||
            body?.token ||
            '',
        refreshToken:
            data?.refreshToken ||
            body?.refreshToken ||
            data?.refresh_token ||
            body?.refresh_token ||
            '',
        user:
            data?.user ||
            body?.user ||
            data?.admin ||
            body?.admin ||
            data?.profile ||
            body?.profile ||
            null,
    }
}

const normalizeStatusResponse = (response, fallbackMessage) => {
    const body = response?.data ?? response ?? {}
    const data = body?.data ?? body
    const source = typeof data === 'object' && data !== null ? data : {}

    return {
        ...source,
        success: body?.success ?? source?.success ?? true,
        message:
            body?.message ||
            source?.message ||
            fallbackMessage,
    }
}

const createMockSession = (email) => ({
    accessToken: `mock-access-token-${Date.now()}`,
    refreshToken: `mock-refresh-token-${Date.now()}`,
    user: {
        id: 'admin_001',
        name: 'Runamarga Admin',
        email,
        gender: 'male',
        role: 'admin',
        permissions: ['*'],
        profileImage: '',
    },
})

export const getAccessToken = () => {
    return (
        localStorage.getItem(AUTH_STORAGE_KEYS.accessToken) ||
        localStorage.getItem('token') ||
        ''
    )
}

export const getRefreshToken = () => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken) || ''
}

export const getCurrentUser = () => {
    const user = readJson(localStorage.getItem(AUTH_STORAGE_KEYS.user))

    if (user) return user

    if (isMockApiEnabled() && getAccessToken()) {
        return createMockSession('admin@runamarga.local').user
    }

    return null
}

export const setAuthSession = ({
    accessToken,
    refreshToken,
    user,
}) => {
    if (!accessToken) {
        throw new Error('Auth session requires an access token')
    }

    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken)
    localStorage.setItem('token', accessToken)

    if (refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken)
    }

    if (user) {
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
    }

    notifyAuthChanged()
}

export const clearAuthSession = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
    localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken)
    localStorage.removeItem(AUTH_STORAGE_KEYS.user)
    localStorage.removeItem('token')
    notifyAuthChanged()
}

export const isAuthenticated = () => {
    return Boolean(getCurrentUser())
}
export const requestLoginOtp = async (payload) => {
    if (isMockApiEnabled()) {
        console.log('MOCK REQUEST OTP PAYLOAD:', payload)
        await wait(500)

        return {
            success: true,
            message: 'OTP sent successfully.',
            mockOtp: getMockOtp(),
        }
    }

    const response = await authClient.post(AUTH_ENDPOINTS.requestOtp, payload)
    return normalizeStatusResponse(response, 'OTP sent successfully.')
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
        result.employee_id = response.data.employee_id
    }

    if (response.data?.user) {
        localStorage.setItem(
            AUTH_STORAGE_KEYS.user,
            JSON.stringify(response.data.user)
        )
    }

    notifyAuthChanged()

    return result
}

export const loginWithCredentials = async ({
    emailId,
    password,
}) => {
    if (isMockApiEnabled()) {
        await wait(250)

        const session = createMockSession(emailId)
        setAuthSession(session)

        return session
    }

    const response = await authClient.post(AUTH_ENDPOINTS.login, {
        email: emailId,
        password,
    })

    const session = normalizeAuthResponse(response)

    if (!session.accessToken || !session.refreshToken) {
        throw new Error(
            'Login API must return accessToken and refreshToken'
        )
    }

    setAuthSession(session)

    return session
}

export const refreshAccessToken = async () => {
    if (isMockApiEnabled()) {
        return true
    }

    const response = await authClient.post(
        AUTH_ENDPOINTS.refresh
    )

    if (response.data?.message) {
        return true
    }

    return true
}

export const logout = async () => {
    const refreshToken = getRefreshToken()

    if (!isMockApiEnabled() && refreshToken) {
        await axios
            .post(AUTH_ENDPOINTS.logout, { refreshToken })
            .catch(() => { })
    }

    clearAuthSession()

    if (typeof window !== 'undefined') {
        window.location.href = '/login'
    }
}

const checkAuth = () => isAuthenticated()

export default checkAuth
