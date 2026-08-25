// admin-react/src/pages/Login/Login.js

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    MapPinIcon,
    DevicePhoneMobileIcon,
    ArrowLeftIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline'
import {
    requestLoginOtp,
    verifyLoginOtp,
} from '../app/auth'
import { APP_LOGO } from '../constants/assets'


// =============================================================
// CONSTANTS
// =============================================================

const DEVICE_ID_KEY = 'runamarga_crm_device_id'
const MOCK_OTP = process.env.REACT_APP_MOCK_OTP || '123456'


// =============================================================
// GET / CREATE DEVICE ID
// =============================================================

const getDeviceId = () => {

    let deviceId =
        localStorage.getItem(
            DEVICE_ID_KEY
        )


    if (!deviceId) {

        deviceId =
            typeof crypto !== 'undefined' &&
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


// =============================================================
// GET DEVICE TYPE
// =============================================================

const getDeviceType = () => {

    const userAgent =
        navigator.userAgent ||
        ''


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


// =============================================================
// GET CLIENT IP
// =============================================================
//
// In production, this should preferably come from your backend.
//
// The browser should NOT be trusted as the source of the user's
// actual public IP address.
//
// The request below allows your backend to return:
//
// {
//     "ipAddress": "xxx.xxx.xxx.xxx"
// }
//
// If the endpoint is unavailable, we keep it null for the mock.
// =============================================================

const getClientIp = async () => {

    try {

        const response =
            await fetch(
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

    } catch (error) {

        console.warn(
            'Unable to determine client IP.',
            error
        )

        return null

    }

}


// =============================================================
// GET LOCATION
// =============================================================

const getLocation = () => {

    return new Promise(
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
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,
                    })

                },

                (error) => {

                    let message =
                        'Unable to access your location.'


                    switch (
                        error.code
                    ) {

                        case error.PERMISSION_DENIED:

                            message =
                                'Location permission is required to continue.'

                            break


                        case error.POSITION_UNAVAILABLE:

                            message =
                                'Your current location could not be determined.'

                            break


                        case error.TIMEOUT:

                            message =
                                'Location request timed out. Please try again.'

                            break


                        default:

                            message =
                                'Unable to access your location.'

                    }


                    reject(
                        new Error(message)
                    )

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            )

        }
    )

}


// =============================================================
// LOGIN COMPONENT
// =============================================================

function Login({ onLogin }) {

    const navigate =
        useNavigate()


    // =========================================================
    // LOGIN STEP
    // =========================================================

    const [step, setStep] =
        useState('email')


    // =========================================================
    // FORM
    // =========================================================

    const [emailId, setEmailId] =
        useState('')


    const [otp, setOtp] =
        useState('')


    // =========================================================
    // DEVICE / LOCATION
    // =========================================================

    const [deviceInfo, setDeviceInfo] =
        useState(null)


    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false)


    const [errorMessage, setErrorMessage] =
        useState('')


    const [successMessage, setSuccessMessage] =
        useState('')


    // =========================================================
    // PERMISSION / INFORMATION STATE
    // =========================================================

    const [showPermissionInfo, setShowPermissionInfo] =
        useState(false)


    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    const isValidEmail = (value) => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
        )

    }


    // =========================================================
    // CONTINUE FROM EMAIL
    // =========================================================

    const handleContinue = (event) => {

        event.preventDefault()

        setErrorMessage('')
        setSuccessMessage('')


        const email =
            emailId.trim()


        // -----------------------------------------------------
        // REQUIRED
        // -----------------------------------------------------

        if (!email) {

            setErrorMessage(
                'Email address is required.'
            )

            return

        }


        // -----------------------------------------------------
        // EMAIL FORMAT
        // -----------------------------------------------------

        if (!isValidEmail(email)) {

            setErrorMessage(
                'Please enter a valid email address.'
            )

            return

        }


        // -----------------------------------------------------
        // SHOW PERMISSION INFORMATION
        // -----------------------------------------------------

        setShowPermissionInfo(true)

    }


    // =========================================================
    // REQUEST PERMISSION + SEND OTP
    // =========================================================

    const handleAllowAndContinue = async () => {

        setErrorMessage('')
        setSuccessMessage('')
        setLoading(true)


        try {

            // -------------------------------------------------
            // REQUEST LOCATION
            // -------------------------------------------------

            const location =
                await getLocation()


            // -------------------------------------------------
            // DEVICE ID
            // -------------------------------------------------

            const deviceId =
                getDeviceId()


            // -------------------------------------------------
            // DEVICE TYPE
            // -------------------------------------------------

            const deviceType =
                getDeviceType()


            // -------------------------------------------------
            // IP ADDRESS
            // -------------------------------------------------

            const ipAddress =
                await getClientIp()


            // -------------------------------------------------
            // DEVICE INFORMATION
            // -------------------------------------------------

            const collectedDeviceInfo = {

                type: deviceType,

                id: deviceId,

                userAgent:
                    navigator.userAgent ||
                    '',

                platform:
                    navigator.platform ||
                    '',

            }


            // -------------------------------------------------
            // FINAL PAYLOAD
            // -------------------------------------------------

            const payload = {

                emailId:
                    emailId.trim(),

                device:
                    collectedDeviceInfo,

                ipAddress,

                location: {

                    latitude:
                        location.latitude,

                    longitude:
                        location.longitude,

                },

            }


            console.log(
                'LOGIN DEVICE PAYLOAD:',
                payload
            )


            // -------------------------------------------------
            // REQUEST OTP
            // -------------------------------------------------

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


            // -------------------------------------------------
            // SAVE DEVICE INFO
            // -------------------------------------------------

            setDeviceInfo({
                ...collectedDeviceInfo,

                ipAddress,

                latitude:
                    location.latitude,

                longitude:
                    location.longitude,

            })


            // -------------------------------------------------
            // MOVE TO OTP SCREEN
            // -------------------------------------------------

            setShowPermissionInfo(false)

            setSuccessMessage(
                response.message ||
                'OTP sent successfully.'
            )

            setStep('otp')

        } catch (error) {

            setErrorMessage(
                error?.message ||
                'Unable to continue. Please try again.'
            )

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    const handleVerifyOtp = async (
        event
    ) => {

        event.preventDefault()

        setErrorMessage('')
        setSuccessMessage('')


        const enteredOtp =
            otp.trim()


        // -----------------------------------------------------
        // OTP VALIDATION
        // -----------------------------------------------------

        if (!enteredOtp) {

            setErrorMessage(
                'Please enter the OTP.'
            )

            return

        }


        if (!/^\d{6}$/.test(enteredOtp)) {

            setErrorMessage(
                'OTP must contain 6 digits.'
            )

            return

        }


        setLoading(true)


        try {

            const response =
                await verifyLoginOtp({

                    emailId:
                        emailId.trim(),

                    otp:
                        enteredOtp,

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


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Invalid OTP.'
                )

            }


            // -------------------------------------------------
            // LOGIN SUCCESS
            // -------------------------------------------------

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

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // BACK TO EMAIL
    // =========================================================

    const handleBackToEmail = () => {

        setStep('email')

        setOtp('')

        setDeviceInfo(null)

        setErrorMessage('')

        setSuccessMessage('')

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            min-h-screen
            bg-base-200
            px-4
            py-8
            sm:px-6
        ">

            <div className="
                flex
                min-h-[calc(100vh-4rem)]
                items-center
                justify-center
            ">

                <div className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-lg
                ">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="
                        px-6
                        pt-8
                        text-center
                        sm:px-8
                    ">

                        <img
                            src={APP_LOGO}
                            alt="Runamarga"
                            className="
                                mx-auto
                                h-20
                                w-20
                                object-contain
                            "
                        />


                        <h1 className="
                            mt-4
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-base-content
                        ">
                            Runamarga Loan CRM
                        </h1>


                        <p className="
                            mt-1.5
                            text-sm
                            text-base-content/55
                        ">
                            Secure CRM access
                        </p>

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="
                        px-6
                        pb-7
                        pt-7
                        sm:px-8
                    ">

                        {/* =================================================
                            EMAIL STEP
                        ================================================= */}

                        {step === 'email' && (

                            <form
                                onSubmit={
                                    handleContinue
                                }
                            >

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-base-content/75
                                    ">
                                        Email address
                                    </label>


                                    <input
                                        type="email"
                                        value={emailId}
                                        onChange={(event) => {

                                            setEmailId(
                                                event.target.value
                                            )

                                            setErrorMessage('')
                                            setSuccessMessage('')

                                        }}
                                        placeholder="Enter your registered email"
                                        autoComplete="email"
                                        autoFocus
                                        className="
                                            input
                                            input-bordered
                                            h-11
                                            min-h-11
                                            w-full
                                        "
                                    />

                                </div>


                                {/* ERROR */}

                                {errorMessage && (

                                    <div className="
                                        mt-3
                                        rounded-lg
                                        border
                                        border-error/20
                                        bg-error/5
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-error
                                    ">
                                        {errorMessage}
                                    </div>

                                )}


                                <button
                                    type="submit"
                                    className="
                                        mt-5
                                        h-11
                                        w-full
                                        rounded-lg
                                        bg-[#8BCF00]
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#78B300]
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#8BCF00]/30
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    Continue
                                </button>


                                <p className="
                                    mt-4
                                    text-center
                                    text-xs
                                    leading-5
                                    text-base-content/45
                                ">
                                    You will receive a one-time
                                    password on your registered
                                    email address.
                                </p>

                            </form>

                        )}


                        {/* =================================================
                            OTP STEP
                        ================================================= */}

                        {step === 'otp' && (

                            <form
                                onSubmit={
                                    handleVerifyOtp
                                }
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleBackToEmail
                                    }
                                    className="
                                        mb-5
                                        flex
                                        items-center
                                        gap-1.5
                                        text-sm
                                        font-medium
                                        text-base-content/55
                                        transition
                                        hover:text-base-content
                                    "
                                >

                                    <ArrowLeftIcon className="
                                        h-4
                                        w-4
                                    " />

                                    Back

                                </button>


                                <div>

                                    <p className="
                                        text-sm
                                        text-base-content/60
                                    ">
                                        OTP sent to
                                    </p>


                                    <p className="
                                        mt-0.5
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {emailId}
                                    </p>

                                </div>


                                <div className="
                                    mt-5
                                ">

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-base-content/75
                                    ">
                                        Enter OTP
                                    </label>


                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(event) => {

                                            const value =
                                                event.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ''
                                                    )
                                                    .slice(
                                                        0,
                                                        6
                                                    )

                                            setOtp(value)
                                            setErrorMessage('')

                                        }}
                                        placeholder="Enter 6-digit OTP"
                                        autoFocus
                                        className="
                                            input
                                            input-bordered
                                            h-12
                                            min-h-12
                                            w-full
                                            text-center
                                            text-lg
                                            font-semibold
                                            tracking-[0.35em]
                                        "
                                    />

                                </div>


                                {/* SUCCESS */}

                                {successMessage && (

                                    <div className="
                                        mt-3
                                        rounded-lg
                                        border
                                        border-[#8BCF00]/30
                                        bg-[#8BCF00]/5
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[#5f9000]
                                    ">
                                        {successMessage}
                                    </div>

                                )}


                                {/* ERROR */}

                                {errorMessage && (

                                    <div className="
                                        mt-3
                                        rounded-lg
                                        border
                                        border-error/20
                                        bg-error/5
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-error
                                    ">
                                        {errorMessage}
                                    </div>

                                )}


                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        otp.length !== 6
                                    }
                                    className="
                                        mt-5
                                        flex
                                        h-11
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#8BCF00]
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#78B300]
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#8BCF00]/30
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {loading && (

                                        <ArrowPathIcon className="
                                            h-4
                                            w-4
                                            animate-spin
                                        " />

                                    )}

                                    {loading
                                        ? 'Verifying...'
                                        : 'Verify & Login'}

                                </button>


                                {/* MOCK OTP */}

                                <p className="
                                    mt-4
                                    text-center
                                    text-xs
                                    text-base-content/40
                                ">
                                    Mock OTP:
                                    <span className="
                                        ml-1
                                        font-semibold
                                    ">
                                        {MOCK_OTP}
                                    </span>
                                </p>

                            </form>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================================================
                PERMISSION MODAL
            ========================================================= */}

            {showPermissionInfo && (

                <div className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-base-300
                        bg-base-100
                        shadow-2xl
                    ">

                        <div className="
                            p-6
                            sm:p-7
                        ">

                            {/* ICONS */}

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#8BCF00]/10
                                ">

                                    <MapPinIcon className="
                                        h-5
                                        w-5
                                        text-[#6FA800]
                                    " />

                                </div>


                                <div>

                                    <h2 className="
                                        text-base
                                        font-semibold
                                        text-base-content
                                    ">
                                        Verify your device
                                    </h2>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-base-content/50
                                    ">
                                        One-time security check
                                    </p>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <p className="
                                mt-5
                                text-sm
                                leading-6
                                text-base-content/65
                            ">
                                Before sending the OTP, we need
                                to verify this login attempt.
                                Your device information and
                                current location will be sent
                                securely with the OTP request.
                            </p>


                            {/* INFORMATION */}

                            <div className="
                                mt-4
                                space-y-2
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    bg-base-200/60
                                    px-3
                                    py-2.5
                                ">

                                    <DevicePhoneMobileIcon className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-base-content/45
                                    " />

                                    <div>

                                        <p className="
                                            text-xs
                                            font-medium
                                            text-base-content
                                        ">
                                            Device verification
                                        </p>

                                        <p className="
                                            text-[11px]
                                            text-base-content/45
                                        ">
                                            A secure device ID will
                                            be associated with this login.
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    bg-base-200/60
                                    px-3
                                    py-2.5
                                ">

                                    <MapPinIcon className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-base-content/45
                                    " />

                                    <div>

                                        <p className="
                                            text-xs
                                            font-medium
                                            text-base-content
                                        ">
                                            Location
                                        </p>

                                        <p className="
                                            text-[11px]
                                            text-base-content/45
                                        ">
                                            Your latitude and longitude
                                            will be included in the request.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ERROR */}

                            {errorMessage && (

                                <div className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-error/20
                                    bg-error/5
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-error
                                ">
                                    {errorMessage}
                                </div>

                            )}


                            {/* ACTIONS */}

                            <div className="
                                mt-6
                                flex
                                flex-col-reverse
                                gap-2
                                sm:flex-row
                                sm:justify-end
                            ">

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {

                                        setShowPermissionInfo(false)
                                        setErrorMessage('')

                                    }}
                                    className="
                                        h-10
                                        rounded-lg
                                        px-4
                                        text-sm
                                        font-medium
                                        text-base-content/60
                                        transition
                                        hover:bg-base-200
                                        hover:text-base-content
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={
                                        handleAllowAndContinue
                                    }
                                    className="
                                        flex
                                        h-10
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#8BCF00]
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#78B300]
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#8BCF00]/30
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {loading && (

                                        <ArrowPathIcon className="
                                            h-4
                                            w-4
                                            animate-spin
                                        " />

                                    )}

                                    {loading
                                        ? 'Verifying...'
                                        : 'Allow & Continue'}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}


export default Login
