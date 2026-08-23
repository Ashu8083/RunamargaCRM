// admin-react/src/pages/Roles&Teams/Admins/components/AdminModal.jsx
import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'


function AdminModal({
    open,
    admin,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        status: 'Active',
    })


    const [error, setError] = useState('')


    // =========================================================
    // LOAD ADMIN DATA
    // =========================================================

    useEffect(() => {

        if (admin) {

            setFormData({
                name: admin.name || '',
                phone: admin.phone || '',
                email: admin.email || '',
                status: admin.status || 'Active',
            })

        } else {

            setFormData({
                name: '',
                phone: '',
                email: '',
                status: 'Active',
            })

        }

        setError('')

    }, [admin, open])


    if (!open) {
        return null
    }


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

        setError('')

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        const name = formData.name.trim()
        const phone = formData.phone.trim()
        const email = formData.email.trim()


        if (!name) {

            setError('Admin name is required.')

            return
        }


        if (name.length < 2) {

            setError(
                'Admin name must contain at least 2 characters.'
            )

            return
        }


        if (!phone) {

            setError('Phone number is required.')

            return
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            setError(
                'Please enter a valid 10-digit phone number.'
            )

            return
        }


        if (!email) {

            setError('Email address is required.')

            return
        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            setError(
                'Please enter a valid email address.'
            )

            return
        }


        onSubmit?.({
            name,
            phone,
            email,
            status: formData.status,
        })

    }


    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div className="
                modal-box
                w-11/12
                max-w-lg
                p-0
                bg-base-100
                border
                border-base-300
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    p-5
                    border-b
                    border-base-300
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#8BCF00]/10
                            flex
                            items-center
                            justify-center
                        ">

                            <ShieldCheckIcon
                                className="
                                    w-5
                                    h-5
                                    text-[#78B300]
                                "
                            />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">
                                {admin
                                    ? 'Edit Admin'
                                    : 'Create Admin'
                                }
                            </h3>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-1
                            ">
                                {admin
                                    ? 'Update the admin details.'
                                    : 'Create a new admin account.'
                                }
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        p-5
                        space-y-5
                    ">

                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div>

                            <label className="
                                label
                                px-0
                            ">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Admin Name
                                </span>

                            </label>


                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter admin name"
                                className="
                                    input
                                    input-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                                autoFocus
                            />

                        </div>


                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        ">

                            {/* Phone */}

                            <div>

                                <label className="
                                    label
                                    px-0
                                ">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        Phone
                                    </span>

                                </label>


                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone"
                                    maxLength={10}
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label className="
                                    label
                                    px-0
                                ">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        Email
                                    </span>

                                </label>


                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />

                            </div>

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div>

                            <label className="
                                label
                                px-0
                            ">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Status
                                </span>

                            </label>


                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Absent">
                                    Absent
                                </option>

                                <option value="Deactivated">
                                    Deactivated
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="
                                rounded-lg
                                border
                                border-error/20
                                bg-error/5
                                px-3
                                py-2
                            ">

                                <p className="
                                    text-xs
                                    text-error
                                ">
                                    {error}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-2
                        p-4
                        border-t
                        border-base-300
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                            "
                        >
                            {admin
                                ? 'Update Admin'
                                : 'Create Admin'
                            }
                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                BACKDROP
            ================================================= */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={onClose}
            >

                <button type="button">
                    close
                </button>

            </form>

        </dialog>

    )

}


export default AdminModal