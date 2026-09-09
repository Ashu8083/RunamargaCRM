// admin-react/src/pages/Profile.jsx

import { useEffect, useState } from 'react'

import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import EnvelopeIcon from '@heroicons/react/24/outline/EnvelopeIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'
import IdentificationIcon from '@heroicons/react/24/outline/IdentificationIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import { getMyProfile } from './ProfileApi'

// =============================================================
// DEFAULT PROFILE IMAGES
// =============================================================

const DEFAULT_PROFILE_IMAGES = {
    male: '/default/male_profile.png',
    female: '/default/female_profile.png',
}


// =============================================================
// GET DEFAULT PROFILE IMAGE
// =============================================================

const getDefaultProfileImage = (gender) => {
    const normalizedGender = String(gender || '').trim().toLowerCase()

    if (normalizedGender === 'female') {
        return DEFAULT_PROFILE_IMAGES.female
    }

    return DEFAULT_PROFILE_IMAGES.male
}


// =============================================================
// GET PROFILE IMAGE
// =============================================================

const getProfileImage = (user) => {
    if (
        user &&
        user.profileImage &&
        String(user.profileImage).trim()
    ) {
        return user.profileImage
    }

    return getDefaultProfileImage(user?.gender)
}


// =============================================================
// MOCK API
// =============================================================

// const fetchProfile = async () => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 user: {
//                     id: 'RM-1024',
//                     name: 'Aravind Kumar',
//                     email: 'aravind@runamarga.com',
//                     phone: '+91 98765 43210',
//                     gender: 'male',
//                     profileImage: '',
//                     role: 'Relationship Manager',
//                     department: 'Loan Operations',
//                     joinedDate: '15/06/2024',
//                 },
//
//                 documents: [
//                     {
//                         id: 1,
//                         name: 'Aadhaar Card',
//                         type: 'Identity Proof',
//                         submittedDate: '18/06/2024',
//                         status: 'verified',
//                         path: '/documents/aadhaar.pdf',
//                     },
//                     {
//                         id: 2,
//                         name: 'PAN Card',
//                         type: 'Identity Proof',
//                         submittedDate: '18/06/2024',
//                         status: 'verified',
//                         path: '/documents/pan.pdf',
//                     },
//                     {
//                         id: 3,
//                         name: 'Address Proof',
//                         type: 'Address Proof',
//                         submittedDate: '19/06/2024',
//                         status: 'pending',
//                         path: '/documents/address-proof.pdf',
//                     },
//                     {
//                         id: 4,
//                         name: 'Employment Certificate',
//                         type: 'Employment Document',
//                         submittedDate: '20/06/2024',
//                         status: 'verified',
//                         path: '/documents/employment-certificate.pdf',
//                     },
//                 ],
//             })
//         }, 500)
//     })
// }


// =============================================================
// STATUS TEXT
// =============================================================

const formatStatus = (status) => {
    const normalizedStatus = String(status || '').toLowerCase()

    if (normalizedStatus === 'verified') {
        return 'Verified'
    }

    if (normalizedStatus === 'pending') {
        return 'Pending'
    }

    if (normalizedStatus === 'rejected') {
        return 'Rejected'
    }

    return 'Unknown'
}


// =============================================================
// STATUS CLASSES
// =============================================================

const getStatusClasses = (status) => {
    const normalizedStatus = String(status || '').toLowerCase()

    if (normalizedStatus === 'verified') {
        return 'border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#6FA800]'
    }

    if (normalizedStatus === 'pending') {
        return 'border-amber-300 bg-amber-50 text-amber-600'
    }

    if (normalizedStatus === 'rejected') {
        return 'border-red-300 bg-red-50 text-red-600'
    }

    return 'border-base-300 bg-base-200 text-base-content/50'
}


// =============================================================
// FORMAT GENDER
// =============================================================

const formatGender = (gender) => {
    const normalizedGender = String(gender || '').trim().toLowerCase()

    if (normalizedGender === 'female') {
        return 'Female'
    }

    if (normalizedGender === 'male') {
        return 'Male'
    }

    if (normalizedGender === 'other') {
        return 'Other'
    }

    return 'Not specified'
}


// =============================================================
// PROFILE
// =============================================================

function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')


    // =========================================================
    // LOAD PROFILE
    // =========================================================

    useEffect(() => {
        let mounted = true

        const loadProfile = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await getMyProfile()

                if (!mounted) {
                    return
                }

                setProfile(response)
            } catch (err) {
                if (!mounted) {
                    return
                }

                setError(
                    err?.message ||
                    'Unable to load profile.'
                )
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadProfile()

        return () => {
            mounted = false
        }
    }, [])


    // =========================================================
    // VIEW DOCUMENT
    // =========================================================

    const handleViewDocument = (document) => {
        if (
            !document ||
            !document.path ||
            !String(document.path).trim()
        ) {
            return
        }

        window.open(
            document.path,
            '_blank',
            'noopener,noreferrer'
        )
    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

                    <div className="h-[520px] animate-pulse rounded-xl border border-base-300 bg-base-100" />

                    <div className="h-[420px] animate-pulse rounded-xl border border-base-300 bg-base-100" />

                </div>
            </div>
        )
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error || !profile) {
        return (
            <div className="p-4 sm:p-6">
                <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                    <p className="text-sm font-semibold text-base-content">
                        Unable to load profile
                    </p>

                    <p className="mt-1 text-xs text-base-content/50">
                        {error || 'Profile information is unavailable.'}
                    </p>

                </div>
            </div>
        )
    }


    // =========================================================
    // PROFILE DATA
    // =========================================================

const user = profile || {}

const defaultProfileImage = getDefaultProfileImage(
    user.gender
)

const profileImage = getProfileImage({
    ...user,
    gender: user.gender,
})

const documents = [
    {
        id: 'aadhar',
        name: 'Aadhaar Card',
        path: user.aadhar_card,
    },
    {
        id: 'pan',
        name: 'PAN Card',
        path: user.pan_card,
    },
].filter((document) => document.path)
    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="space-y-5 p-4 sm:p-6">

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

                    {/* PROFILE HEADER */}

                    <div className="border-b border-base-300 px-5 py-6">

                        <div className="flex flex-col items-center text-center">

                            <div className="h-24 w-24 overflow-hidden rounded-full border border-base-300 bg-base-200 shadow-sm">

                                <img
                                    src={profileImage}
                                    alt={user.name || 'Profile'}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        if (
                                            event.currentTarget.src !==
                                            window.location.origin +
                                            defaultProfileImage
                                        ) {
                                            event.currentTarget.src =
                                                defaultProfileImage
                                        }
                                    }}
                                />

                            </div>


                            <h2 className="mt-4 text-base font-semibold text-base-content">
                                {user.name || 'N/A'}
                            </h2>


                            <p className="mt-1 text-xs text-base-content/50">
                                {user.role || 'N/A'}
                            </p>


                            <span className="mt-3 rounded-full bg-base-200 px-3 py-1 font-mono text-[11px] font-medium text-base-content/60">
                                {user.employee_code || 'N/A'}
                            </span>

                        </div>

                    </div>


                    {/* PROFILE INFORMATION */}

                    <div className="divide-y divide-base-300">

                        {/* EMAIL */}

                        <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200">
                                <EnvelopeIcon className="h-4 w-4 text-base-content/50" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                    Email
                                </p>

                                <p
                                    className="mt-0.5 truncate text-sm text-base-content"
                                    title={user.email || ''}
                                >
                                    {user.email || 'N/A'}
                                </p>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200">
                                <PhoneIcon className="h-4 w-4 text-base-content/50" />
                            </div>

                            <div>

                                <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                    Phone
                                </p>

                                <p className="mt-0.5 text-sm text-base-content">
                                    {user.phone || 'N/A'}
                                </p>

                            </div>

                        </div>


                        {/* GENDER */}

                        <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200">
                                <UserIcon className="h-4 w-4 text-base-content/50" />
                            </div>

                            <div>

                                <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                    Gender
                                </p>

                                <p className="mt-0.5 text-sm text-base-content">
                                    {formatGender(user.gender)}
                                </p>

                            </div>

                        </div>


                        {/* EMPLOYEE ID */}

                        <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200">
                                <IdentificationIcon className="h-4 w-4 text-base-content/50" />
                            </div>

                            <div>

                                <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                    Employee ID
                                </p>

                                <p className="mt-0.5 font-mono text-sm text-base-content">
                                    {user.employee_code || 'N/A'}
                                </p>

                            </div>

                        </div>


                        {/* DEPARTMENT */}

                        <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200">
                                <BriefcaseIcon className="h-4 w-4 text-base-content/50" />
                            </div>

                            <div>

                                <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                    Department
                                </p>

                                <p className="mt-0.5 text-sm text-base-content">
                                    {user.department || 'N/A'}
                                </p>

                            </div>

                        </div>


                        {/* JOINED DATE */}

                        <div className="px-5 py-4">

                            <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/40">
                                Joined Date
                            </p>

                            <p className="mt-0.5 text-sm text-base-content">
                                {user.joining_date
    ? new Date(user.joining_date).toLocaleDateString('en-IN')
    : 'N/A'}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DOCUMENTS CARD
                ================================================= */}

                <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

                    {/* DOCUMENT HEADER */}

                    <div className="flex items-center justify-between border-b border-base-300 px-5 py-5">

                        <div>

                            <h2 className="text-base font-semibold text-base-content">
                                Applied Documents
                            </h2>

                            <p className="mt-0.5 text-xs text-base-content/50">
                                Documents submitted with your profile.
                            </p>

                        </div>


                        <span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60">
                            {documents.length}
                        </span>

                    </div>


                    {/* DOCUMENT LIST */}

                    {documents.length > 0 ? (
                        <div className="divide-y divide-base-300">

                            {documents.map((document) => {

                                const hasDocumentPath =
                                    Boolean(
                                        document &&
                                        document.path &&
                                        String(
                                            document.path
                                        ).trim()
                                    )

                                return (
                                    <div
                                        key={document.id}
                                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-base-200/30"
                                    >

                                        {/* DOCUMENT ICON */}

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-base-200">

                                            <DocumentTextIcon className="h-5 w-5 text-base-content/50" />

                                        </div>


                                        {/* DOCUMENT DETAILS */}

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-sm font-medium text-base-content">
                                                {document.name ||
                                                    'Unnamed Document'}
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-base-content/45">

                                                <span>
                                                    {document.type ||
                                                        'Document'}
                                                </span>

                                                <span>
                                                    •
                                                </span>

                                                <span>
                                                    Submitted{' '}
                                                    {document.submittedDate ||
                                                        'N/A'}
                                                </span>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                                                document.status
                                            )}`}
                                        >
                                            {formatStatus(
                                                document.status
                                            )}
                                        </span>


                                        {/* VIEW */}

                                        <button
                                            type="button"
                                            disabled={!hasDocumentPath}
                                            onClick={() =>
                                                handleViewDocument(
                                                    document
                                                )
                                            }
                                            className="h-9 shrink-0 rounded-lg border border-base-300 bg-base-100 px-3 text-xs font-medium text-base-content/70 transition hover:border-[#8BCF00]/40 hover:bg-[#8BCF00]/10 hover:text-[#6FA800] disabled:cursor-not-allowed disabled:opacity-40"
                                            title={
                                                hasDocumentPath
                                                    ? 'View document'
                                                    : 'Document path unavailable'
                                            }
                                        >
                                            View
                                        </button>

                                    </div>
                                )
                            })}

                        </div>
                    ) : (
                        <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">

                            <DocumentTextIcon className="h-8 w-8 text-base-content/25" />

                            <p className="mt-3 text-sm font-medium text-base-content/60">
                                No documents found
                            </p>

                            <p className="mt-1 text-xs text-base-content/40">
                                No documents have been submitted yet.
                            </p>

                        </div>
                    )}

                </div>

            </div>

        </div>
    )
}


export default Profile