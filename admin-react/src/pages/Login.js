// src/pages/Login/Login.js

import {
    useEffect,
    useRef,
    useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import {
    ArrowLeftIcon,
    ArrowPathIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline'

import {
    requestLoginOtp,
    verifyLoginOtp,
} from '../app/auth'

import { APP_LOGO } from '../constants/assets'

const DEVICE_ID_KEY =
    'runamarga_crm_device_id'

const LOCATION_ATTEMPTS = 2

const RESEND_COOLDOWN = 90

// =========================================================
// DEVICE ID
// =========================================================

const getDeviceId = () => {
    let deviceId =
        localStorage.getItem(
            DEVICE_ID_KEY
        )

    if (!deviceId) {
        deviceId =
            typeof crypto !==
                'undefined' &&
            crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()
                      .toString(36)
                      .substring(2, 12)}`

        localStorage.setItem(
            DEVICE_ID_KEY,
            deviceId
        )
    }

    return deviceId
}

// =========================================================
// DEVICE TYPE
// =========================================================

const getDeviceType = () => {
    const userAgent =
        navigator.userAgent || ''

    if (
        /tablet|ipad|playbook|silk/i.test(
            userAgent
        )
    ) {
        return 'tablet'
    }

    if (
        /mobile|iphone|ipod|android/i.test(
            userAgent
        )
    ) {
        return 'mobile'
    }

    return 'desktop'
}

// =========================================================
// CLIENT IP
// =========================================================

const getClientIp = async () => {
    try {
        const response = await fetch(
            '/api/auth/client-ip'
        )

        if (!response.ok) {
            return null
        }

        const data =
            await response.json()

        return (
            data?.ipAddress ||
            data?.ip ||
            null
        )
    } catch {
        return null
    }
}

// =========================================================
// LOCATION
// =========================================================

const getLocation = () =>
    new Promise(
        (resolve, reject) => {
            if (
                !navigator.geolocation
            ) {
                reject(
                    new Error(
                        'Location services are not supported by this browser.'
                    )
                )

                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude:
                            position
                                .coords
                                .latitude,

                        longitude:
                            position
                                .coords
                                .longitude,
                    })
                },

                (error) => {
                    reject(error)
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            )
        }
    )

// =========================================================
// LOCATION WITH FALLBACK
// =========================================================
//
// Try twice.
// If both attempts fail,
// continue with location = null.
//

const getLocationWithFallback =
    async () => {
        for (
            let attempt = 0;
            attempt <
            LOCATION_ATTEMPTS;
            attempt++
        ) {
            try {
                return await getLocation()
            } catch {
                // Try again.
            }
        }

        return null
    }

// =========================================================
// LOGIN
// =========================================================

function Login({ onLogin }) {
    const navigate = useNavigate()

    const [step, setStep] =
        useState('email')

    const [emailId, setEmailId] =
        useState('')

    const [otp, setOtp] =
        useState('')

    const [deviceInfo, setDeviceInfo] =
        useState(null)

    const [loading, setLoading] =
        useState(false)

    const [resending, setResending] =
        useState(false)

    const [errorMessage, setErrorMessage] =
        useState('')

    const [successMessage, setSuccessMessage] =
        useState('')

    const [
        resendSeconds,
        setResendSeconds,
    ] = useState(RESEND_COOLDOWN)

    const otpRefs = useRef([])

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    const isValidEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
        )

    // =====================================================
    // CREATE DEVICE INFORMATION
    // =====================================================

    const createDeviceInfo =
        async (location) => {
            const deviceId =
                getDeviceId()

            const deviceType =
                getDeviceType()

            const ipAddress =
                await getClientIp()

            const device = {
                type: deviceType,

                id: deviceId,

                userAgent:
                    navigator.userAgent ||
                    '',

                platform:
                    navigator.platform ||
                    '',
            }

            return {
                device,

                deviceInfo: {
                    ...device,

                    ipAddress,

                    latitude:
                        location?.latitude ??
                        null,

                    longitude:
                        location?.longitude ??
                        null,
                },

                ipAddress,

                location,
            }
        }

    // =====================================================
    // SEND OTP
    // =====================================================

    const sendOtp = async ({
        location,
        isResend = false,
    }) => {
        const email =
            emailId.trim()

        const {
            device,
            deviceInfo:
                collectedDeviceInfo,
            ipAddress,
        } = await createDeviceInfo(
            location
        )

        const payload = {
            emailId: email,

            device,

            ipAddress,

            location,
        }

        console.log(
            'LOGIN DEVICE PAYLOAD:',
            payload
        )

        const response =
            await requestLoginOtp(
                payload
            )

        if (!response?.success) {
            throw new Error(
                response?.message ||
                    'Unable to send OTP.'
            )
        }

        setDeviceInfo(
            collectedDeviceInfo
        )

        setOtp('')

        setErrorMessage('')

        setSuccessMessage(
            response.message ||
                (isResend
                    ? 'OTP resent successfully.'
                    : 'OTP sent successfully.')
        )

        setResendSeconds(
            RESEND_COOLDOWN
        )

        setStep('otp')

        setTimeout(() => {
            otpRefs.current[0]?.focus()
        }, 50)

        return response
    }

    // =====================================================
    // EMAIL → LOCATION → OTP
    // =====================================================

    const handleContinue = async (
        event
    ) => {
        event.preventDefault()

        if (loading) {
            return
        }

        setErrorMessage('')
        setSuccessMessage('')

        const email =
            emailId.trim()

        if (!email) {
            setErrorMessage(
                'Email address is required.'
            )

            return
        }

        if (!isValidEmail(email)) {
            setErrorMessage(
                'Please enter a valid email address.'
            )

            return
        }

        setLoading(true)

        try {
            // Ask for location permission.
            //
            // If location fails twice,
            // getLocationWithFallback()
            // returns null and OTP
            // continues normally.

            const location =
                await getLocationWithFallback()

            await sendOtp({
                location,
                isResend: false,
            })
        } catch (error) {
            setErrorMessage(
                error?.message ||
                    'Unable to continue. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    // =====================================================
    // RESEND COUNTDOWN
    // =====================================================

    useEffect(() => {
        if (
            step !== 'otp' ||
            resendSeconds <= 0
        ) {
            return
        }

        const timer =
            setInterval(() => {
                setResendSeconds(
                    (seconds) =>
                        Math.max(
                            seconds - 1,
                            0
                        )
                )
            }, 1000)

        return () =>
            clearInterval(timer)
    }, [
        step,
        resendSeconds,
    ])

    // =====================================================
    // FORMAT TIMER
    // =====================================================

    const formatTimer = (
        seconds
    ) => {
        const minutes =
            Math.floor(
                seconds / 60
            )

        const remainingSeconds =
            seconds % 60

        return `${String(
            minutes
        ).padStart(2, '0')}:${String(
            remainingSeconds
        ).padStart(2, '0')}`
    }

    // =====================================================
    // RESEND OTP
    // =====================================================

    const handleResendOtp =
        async () => {
            if (
                resendSeconds > 0 ||
                resending ||
                loading
            ) {
                return
            }

            setResending(true)

            setErrorMessage('')
            setSuccessMessage('')

            try {
                /*
                 * IMPORTANT:
                 *
                 * We don't request location again
                 * during resend.
                 *
                 * We reuse the location/device
                 * information already collected
                 * during the first OTP request.
                 */

                const location =
                    deviceInfo
                        ? {
                              latitude:
                                  deviceInfo.latitude,
                              longitude:
                                  deviceInfo.longitude,
                          }
                        : null

                await sendOtp({
                    location,
                    isResend: true,
                })
            } catch (error) {
                setErrorMessage(
                    error?.message ||
                        'Unable to resend OTP. Please try again.'
                )

                // Allow another resend attempt.
                setResendSeconds(0)
            } finally {
                setResending(false)
            }
        }

    // =====================================================
    // OTP CHANGE
    // =====================================================

    const handleOtpChange = (
        index,
        value
    ) => {
        const digits =
            value.replace(
                /\D/g,
                ''
            )

        // ---------------------------------------------
        // PASTE OTP
        // ---------------------------------------------

        if (digits.length > 1) {
            const pasted =
                digits.slice(0, 4)

            setOtp(pasted)

            pasted
                .split('')
                .forEach(
                    (
                        digit,
                        i
                    ) => {
                        if (
                            otpRefs.current[
                                i
                            ]
                        ) {
                            otpRefs.current[
                                i
                            ].value =
                                digit
                        }
                    }
                )

            const focusIndex =
                Math.min(
                    pasted.length,
                    3
                )

            otpRefs.current[
                focusIndex
            ]?.focus()

            setErrorMessage('')

            return
        }

        const currentOtp =
            otp.split('')

        currentOtp[index] =
            digits

        const nextOtp =
            currentOtp
                .join('')
                .slice(0, 4)

        setOtp(nextOtp)

        setErrorMessage('')

        // Move to next box.
        if (digits) {
            otpRefs.current[
                Math.min(
                    index + 1,
                    3
                )
            ]?.focus()
        }
    }

    // =====================================================
    // OTP KEYBOARD
    // =====================================================

    const handleOtpKeyDown = (
        index,
        event
    ) => {
        // ---------------------------------------------
        // BACKSPACE
        // ---------------------------------------------

        if (
            event.key ===
                'Backspace' &&
            !event.currentTarget
                .value &&
            index > 0
        ) {
            const currentOtp =
                otp.split('')

            currentOtp[
                index - 1
            ] = ''

            const nextOtp =
                currentOtp
                    .join('')
                    .slice(0, 4)

            setOtp(nextOtp)

            otpRefs.current[
                index - 1
            ]?.focus()

            return
        }

        // ---------------------------------------------
        // ARROW LEFT
        // ---------------------------------------------

        if (
            event.key ===
                'ArrowLeft' &&
            index > 0
        ) {
            otpRefs.current[
                index - 1
            ]?.focus()
        }

        // ---------------------------------------------
        // ARROW RIGHT
        // ---------------------------------------------

        if (
            event.key ===
                'ArrowRight' &&
            index < 3
        ) {
            otpRefs.current[
                index + 1
            ]?.focus()
        }
    }

    // =====================================================
    // AUTO VERIFY
    // =====================================================

    useEffect(() => {
        if (
            step !== 'otp' ||
            otp.length !== 4 ||
            loading ||
            resending
        ) {
            return
        }

        handleVerifyOtp()
    }, [
        otp,
        step,
    ])

    // =====================================================
    // VERIFY OTP
    // =====================================================

    const handleVerifyOtp =
        async () => {
            if (
                otp.length !== 4 ||
                loading
            ) {
                return
            }

            setErrorMessage('')
            setSuccessMessage('')
            setLoading(true)

            try {
                const response =
                    await verifyLoginOtp({
                        emailId:
                            emailId.trim(),

                        otp,

                        deviceId:
                            deviceInfo?.id,

                        device:
                            deviceInfo,

                        ipAddress:
                            deviceInfo?.ipAddress,

                        location:
                            deviceInfo
                                ? {
                                      latitude:
                                          deviceInfo.latitude,
                                      longitude:
                                          deviceInfo.longitude,
                                  }
                                : null,
                    })

                if (
                    !response?.success
                ) {
                    throw new Error(
                        response?.message ||
                            'Invalid OTP.'
                    )
                }

                onLogin?.()

                navigate(
                    '/crm/dashboard',
                    {
                        replace: true,
                    }
                )
            } catch (error) {
                setErrorMessage(
                    error?.message ||
                        'Unable to verify OTP.'
                )

                // Clear OTP so user
                // can enter it again.
                setOtp('')

                setTimeout(() => {
                    otpRefs.current[
                        0
                    ]?.focus()
                }, 50)
            } finally {
                setLoading(false)
            }
        }

    // =====================================================
    // BACK TO EMAIL
    // =====================================================

    const handleBackToEmail =
        () => {
            setStep('email')

            setOtp('')

            setDeviceInfo(null)

            setErrorMessage('')

            setSuccessMessage('')

            setResendSeconds(
                RESEND_COOLDOWN
            )

            setTimeout(() => {
                document
                    .querySelector(
                        '#login-email'
                    )
                    ?.focus()
            }, 50)
        }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-base-200 px-4">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 shadow-lg">

                    {/* HEADER */}

                    <div className="px-6 pt-7 text-center">
                        <img
                            src={APP_LOGO}
                            alt="Runamarga"
                            className="mx-auto h-16 w-16 object-contain"
                        />

                        <h1 className="mt-3 text-xl font-semibold tracking-tight text-base-content">
                            Runamarga Loan CRM
                        </h1>

                        <p className="mt-1 text-xs text-base-content/50">
                            Secure CRM access
                        </p>
                    </div>

                    {/* CONTENT */}

                    <div className="px-6 pb-6 pt-6">

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        {step ===
                            'email' && (
                            <form
                                onSubmit={
                                    handleContinue
                                }
                            >
                                <label
                                    htmlFor="login-email"
                                    className="mb-1.5 block text-xs font-medium text-base-content/70"
                                >
                                    Email address
                                </label>

                                <input
                                    id="login-email"
                                    type="email"
                                    value={
                                        emailId
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setEmailId(
                                            event
                                                .target
                                                .value
                                        )

                                        setErrorMessage(
                                            ''
                                        )

                                        setSuccessMessage(
                                            ''
                                        )
                                    }}
                                    placeholder="Enter your registered email"
                                    autoComplete="email"
                                    autoFocus
                                    disabled={
                                        loading
                                    }
                                    className="input input-bordered h-10 min-h-10 w-full text-sm"
                                />

                                {errorMessage && (
                                    <Message
                                        type="error"
                                        text={
                                            errorMessage
                                        }
                                    />
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8BCF00] text-sm font-semibold text-white transition hover:bg-[#78B300] focus:outline-none focus:ring-2 focus:ring-[#8BCF00]/30 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading && (
                                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    )}

                                    {loading
                                        ? 'Checking...'
                                        : 'Continue'}
                                </button>

                                <p className="mt-3 text-center text-[11px] leading-4 text-base-content/40">
                                    A one-time password
                                    will be sent to your
                                    registered email.
                                </p>
                            </form>
                        )}

                        {/* =================================================
                            OTP
                        ================================================= */}

                        {step ===
                            'otp' && (
                            <div>

                                {/* BACK */}

                                <button
                                    type="button"
                                    onClick={
                                        handleBackToEmail
                                    }
                                    disabled={
                                        loading ||
                                        resending
                                    }
                                    className="mb-4 flex items-center gap-1 text-xs font-medium text-base-content/50 transition hover:text-base-content disabled:opacity-50"
                                >
                                    <ArrowLeftIcon className="h-3.5 w-3.5" />

                                    Back
                                </button>

                                {/* OTP SENT */}

                                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-base-200/60 px-3 py-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8BCF00]/10">
                                        <MapPinIcon className="h-4 w-4 text-[#6FA800]" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[11px] text-base-content/50">
                                            OTP sent to
                                        </p>

                                        <p className="truncate text-xs font-semibold text-base-content">
                                            {
                                                emailId
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* OTP */}

                                <label className="mb-2 block text-xs font-medium text-base-content/70">
                                    Enter OTP
                                </label>

                                <div className="flex justify-center gap-2">
                                    {[
                                        0,
                                        1,
                                        2,
                                        3,
                                    ].map(
                                        (
                                            index
                                        ) => (
                                            <input
                                                key={
                                                    index
                                                }
                                                ref={(
                                                    element
                                                ) => {
                                                    otpRefs.current[
                                                        index
                                                    ] =
                                                        element
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete={
                                                    index ===
                                                    0
                                                        ? 'one-time-code'
                                                        : 'off'
                                                }
                                                maxLength={
                                                    1
                                                }
                                                value={
                                                    otp[
                                                        index
                                                    ] ||
                                                    ''
                                                }
                                                disabled={
                                                    loading ||
                                                    resending
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleOtpChange(
                                                        index,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                onKeyDown={(
                                                    event
                                                ) =>
                                                    handleOtpKeyDown(
                                                        index,
                                                        event
                                                    )
                                                }
                                                onFocus={(
                                                    event
                                                ) =>
                                                    event
                                                        .target
                                                        .select()
                                                }
                                                className="h-12 w-12 rounded-lg border border-base-300 bg-base-100 text-center text-lg font-semibold outline-none transition focus:border-[#8BCF00] focus:ring-2 focus:ring-[#8BCF00]/20 disabled:opacity-60"
                                            />
                                        )
                                    )}
                                </div>

                                {/* SUCCESS */}

                                {successMessage && (
                                    <Message
                                        type="success"
                                        text={
                                            successMessage
                                        }
                                    />
                                )}

                                {/* ERROR */}

                                {errorMessage && (
                                    <Message
                                        type="error"
                                        text={
                                            errorMessage
                                        }
                                    />
                                )}

                                {/* VERIFYING */}

                                {loading && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-base-content/50">
                                        <ArrowPathIcon className="h-4 w-4 animate-spin" />

                                        Verifying...
                                    </div>
                                )}

                                {/* =================================================
                                    RESEND
                                ================================================= */}

                                <div className="mt-5 text-center">

                                    {resendSeconds >
                                        0 ? (
                                        <p className="text-[11px] text-base-content/45">
                                            Resend OTP in{' '}
                                            <span className="font-semibold text-base-content/65">
                                                {formatTimer(
                                                    resendSeconds
                                                )}
                                            </span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={
                                                handleResendOtp
                                            }
                                            disabled={
                                                resending ||
                                                loading
                                            }
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6FA800] transition hover:text-[#578500] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {resending && (
                                                <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                                            )}

                                            {resending
                                                ? 'Sending...'
                                                : 'Resend OTP'}
                                        </button>
                                    )}
                                </div>

                                <p className="mt-3 text-center text-[11px] leading-4 text-base-content/40">
                                    Enter all 4 digits
                                    to verify
                                    automatically.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// =========================================================
// MESSAGE
// =========================================================

const Message = ({
    type,
    text,
}) => {
    const success =
        type === 'success'

    return (
        <div
            className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                success
                    ? 'border-[#8BCF00]/30 bg-[#8BCF00]/5 text-[#5f9000]'
                    : 'border-error/20 bg-error/5 text-error'
            }`}
        >
            {text}
        </div>
    )
}

export default Login