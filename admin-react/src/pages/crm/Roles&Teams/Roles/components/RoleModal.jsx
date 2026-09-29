// admin-react/src/pages/Roles&Teams/Roles/components/RoleModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'

import {
    generateRoleCode,
    validateRole,
} from '../API'


function RoleModal({
    open,
    role = null,
    loading = false,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        active: true,
    })

    const [errors, setErrors] = useState({})


    /*
    |--------------------------------------------------------------------------
    | Initialize Form
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return
        }


        if (role) {

            setFormData({
                name: role.name || '',

                code: role.code || '',

                description: role.description || '',

                active:
                    role.active !== undefined
                        ? Boolean(role.active)
                        : true,
            })

        } else {

            setFormData({
                name: '',
                code: '',
                description: '',
                active: true,
            })
        }


        setErrors({})

    }, [role, open])


    /*
    |--------------------------------------------------------------------------
    | Close On Escape
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return
        }


        const handleKeyDown = (event) => {

            if (event.key === 'Escape' && !loading) {
                onClose?.()
            }
        }


        document.addEventListener(
            'keydown',
            handleKeyDown
        )


        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }

    }, [open, loading, onClose])


    /*
    |--------------------------------------------------------------------------
    | Do Not Render When Closed
    |--------------------------------------------------------------------------
    */

    if (!open) {
        return null
    }


    /*
    |--------------------------------------------------------------------------
    | Name Change
    |--------------------------------------------------------------------------
    */

    const handleNameChange = (event) => {

        const value = event.target.value


        /*
         * Generate the code automatically from the role name.
         *
         * Example:
         *
         * Agent
         *       -> AGENT
         *
         * Agent Personal
         *       -> AGENT_PERSONAL
         *
         * Team Lead
         *       -> TEAMLEAD
         *
         * Manager Operations
         *       -> MANAGER_OPERATIONS
         *
         * RM Senior
         *       -> RM_SENIOR
         */

        const generatedCode = generateRoleCode(value)


        setFormData((previous) => ({
            ...previous,

            name: value,

            code: generatedCode,
        }))


        setErrors((previous) => ({
            ...previous,

            name: '',
            code: '',
        }))
    }


    /*
    |--------------------------------------------------------------------------
    | Code Change
    |--------------------------------------------------------------------------
    */

    const handleCodeChange = (event) => {

        const value = event.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9_]/g, '')


        setFormData((previous) => ({
            ...previous,
            code: value,
        }))


        setErrors((previous) => ({
            ...previous,
            code: '',
        }))
    }


    /*
    |--------------------------------------------------------------------------
    | Description Change
    |--------------------------------------------------------------------------
    */

    const handleDescriptionChange = (event) => {

        const value = event.target.value


        setFormData((previous) => ({
            ...previous,
            description: value,
        }))


        setErrors((previous) => ({
            ...previous,
            description: '',
        }))
    }


    /*
    |--------------------------------------------------------------------------
    | Active Change
    |--------------------------------------------------------------------------
    */

    const handleActiveChange = (event) => {

        const value = event.target.checked


        setFormData((previous) => ({
            ...previous,
            active: value,
        }))
    }


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault()


        if (loading) {
            return
        }


        /*
         * Normalize values before validation.
         */

        const name = formData.name.trim()

        const code = formData.code.trim().toUpperCase()

        const description =
            formData.description.trim()


        const validation = validateRole({
            name,
            code,
            description,
        })


        if (!validation.valid) {

            setErrors(validation.errors)

            return
        }


        /*
         * Submit clean data to parent.
         */

        onSubmit?.({
            name,
            code,
            description,
            active: Boolean(formData.active),
        })
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div
                className="
                    modal-box
                    w-11/12
                    max-w-2xl
                    p-0
                    bg-base-100
                    border
                    border-base-300
                "
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-[#8BCF00]/10 flex items-center justify-center">

                            <ShieldCheckIcon className="w-5 h-5 text-[#78B300]" />

                        </div>


                        <div>

                            <h3 className="text-lg font-semibold">

                                {role
                                    ? 'Edit Role'
                                    : 'Create Role'
                                }

                            </h3>


                            <p className="text-xs text-base-content/50 mt-1">

                                {role
                                    ? 'Update the role details below.'
                                    : 'Create a new role for the system.'
                                }

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
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


                {/* =====================================================
                    FORM
                ===================================================== */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5 space-y-5">

                        {/* =================================================
                            ROLE NAME
                        ================================================= */}

                        <div>

                            <label className="label px-0">

                                <span className="label-text text-sm font-medium">

                                    Role Name

                                    <span className="ml-1 text-error">
                                        *
                                    </span>

                                </span>

                            </label>


                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="e.g. Agent Personal"
                                disabled={loading}
                                maxLength={100}
                                className={`
                                    input
                                    input-bordered
                                    w-full
                                    ${
                                        errors.name
                                            ? 'border-error focus:border-error focus:outline-error'
                                            : 'focus:border-[#8BCF00] focus:outline-[#8BCF00]'
                                    }
                                `}
                                autoFocus
                            />


                            {errors.name ? (

                                <p className="mt-1.5 text-xs text-error">
                                    {errors.name}
                                </p>

                            ) : (

                                <p className="text-[11px] text-base-content/50 mt-1.5">
                                    Example: Agent Personal, Team Lead, Manager Operations, RM Senior.
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            ROLE CODE
                        ================================================= */}

                        <div>

                            <label className="label px-0">

                                <span className="label-text text-sm font-medium">

                                    Role Code

                                    <span className="ml-1 text-error">
                                        *
                                    </span>

                                </span>

                            </label>


                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleCodeChange}
                                placeholder="e.g. AGENT_PERSONAL"
                                disabled={loading}
                                maxLength={100}
                                className={`
                                    input
                                    input-bordered
                                    w-full
                                    font-mono
                                    uppercase
                                    tracking-wide
                                    ${
                                        errors.code
                                            ? 'border-error focus:border-error focus:outline-error'
                                            : 'focus:border-[#8BCF00] focus:outline-[#8BCF00]'
                                    }
                                `}
                            />


                            {errors.code ? (

                                <p className="mt-1.5 text-xs text-error">
                                    {errors.code}
                                </p>

                            ) : (

                                <p className="text-[11px] text-base-content/50 mt-1.5">

                                    Code must start with{' '}

                                    <span className="font-semibold">
                                        AGENT
                                    </span>
                                    {', '}

                                    <span className="font-semibold">
                                        TEAMLEAD
                                    </span>
                                    {', '}

                                    <span className="font-semibold">
                                        MANAGER
                                    </span>
                                    {' or '}

                                    <span className="font-semibold">
                                        RM
                                    </span>
                                    .

                                </p>

                            )}

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div>

                            <label className="label px-0">

                                <span className="label-text text-sm font-medium">
                                    Description
                                </span>

                            </label>


                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter a short description for this role..."
                                disabled={loading}
                                maxLength={500}
                                rows={4}
                                className={`
                                    textarea
                                    textarea-bordered
                                    w-full
                                    resize-none
                                    ${
                                        errors.description
                                            ? 'border-error focus:border-error focus:outline-error'
                                            : 'focus:border-[#8BCF00] focus:outline-[#8BCF00]'
                                    }
                                `}
                            />


                            <div className="flex items-center justify-between mt-1.5">

                                {errors.description ? (

                                    <p className="text-xs text-error">
                                        {errors.description}
                                    </p>

                                ) : (

                                    <p className="text-[11px] text-base-content/50">
                                        Describe what this role is responsible for.
                                    </p>

                                )}


                                <span className="text-[11px] text-base-content/40">
                                    {formData.description.length}/500
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            ACTIVE
                        ================================================= */}

                        <div className="rounded-lg border border-base-300 p-4">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="text-sm font-medium">
                                        Role Status
                                    </p>

                                    <p className="text-xs text-base-content/50 mt-1">
                                        Inactive roles cannot be assigned to users.
                                    </p>

                                </div>


                                <label className="flex items-center gap-3 cursor-pointer">

                                    <span
                                        className={`
                                            text-sm
                                            font-medium
                                            ${
                                                formData.active
                                                    ? 'text-[#78B300]'
                                                    : 'text-base-content/50'
                                            }
                                        `}
                                    >
                                        {formData.active
                                            ? 'Active'
                                            : 'Inactive'
                                        }
                                    </span>


                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={handleActiveChange}
                                        disabled={loading}
                                        className="
                                            toggle
                                            border-base-300
                                            [--tglbg:theme(colors.base-300)]
                                            checked:border-[#8BCF00]
                                            checked:bg-[#8BCF00]
                                        "
                                    />

                                </label>

                            </div>

                        </div>


                        {/* =================================================
                            VALIDATION SUMMARY
                        ================================================= */}

                        {Object.keys(errors).length > 0 && (

                            <div className="rounded-lg border border-error/20 bg-error/5 px-3 py-2.5">

                                <p className="text-xs font-medium text-error">
                                    Please correct the highlighted fields before submitting.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =====================================================
                        FOOTER
                    ===================================================== */}

                    <div className="flex justify-end gap-2 p-4 border-t border-base-300">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
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

                            {loading ? (

                                <>
                                    <span className="loading loading-spinner loading-xs" />

                                    {role
                                        ? 'Updating...'
                                        : 'Creating...'
                                    }
                                </>

                            ) : (

                                role
                                    ? 'Update Role'
                                    : 'Create Role'

                            )}

                        </button>

                    </div>

                </form>

            </div>


            {/* =====================================================
                BACKDROP
            ===================================================== */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={(event) => {

                    /*
                     * Only close when the actual backdrop
                     * itself is clicked.
                     */

                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        if (!loading) {
                            onClose?.()
                        }
                    }
                }}
            >

                <button
                    type="button"
                    disabled={loading}
                    aria-label="Close modal"
                >
                    close
                </button>

            </form>

        </dialog>
    )
}


export default RoleModal