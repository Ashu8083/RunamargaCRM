// admin-react/src/pages/Roles/components/RoleModal.jsx

import { useEffect, useState } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'

function RoleModal({
    open,
    role,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] = useState({
        name: '',
    })

    const [error, setError] = useState('')


    useEffect(() => {

        if (role) {

            setFormData({
                name: role.name || '',
            })

        } else {

            setFormData({
                name: '',
            })

        }

        setError('')

    }, [role, open])


    if (!open) {
        return null
    }


    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

        setError('')
    }


    const handleSubmit = (event) => {

        event.preventDefault()

        const name = formData.name.trim()

        if (!name) {
            setError('Role name is required.')
            return
        }

        if (name.length < 2) {
            setError('Role name must contain at least 2 characters.')
            return
        }

        onSubmit?.({
            name,
        })
    }


    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-lg p-0 bg-base-100 border border-base-300">

                {/* Header */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-[#8BCF00]/10 flex items-center justify-center">

                            <ShieldCheckIcon className="w-5 h-5 text-[#78B300]" />

                        </div>

                        <div>

                            <h3 className="text-lg font-semibold">
                                {role ? 'Edit Role' : 'Create Role'}
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                {role
                                    ? 'Update the role name.'
                                    : 'Create a new user role.'
                                }
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                </div>


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5 space-y-5">

                        {/* Role Name */}

                        <div>

                            <label className="label px-0">

                                <span className="label-text text-sm font-medium">
                                    Role Name
                                </span>

                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. team_lead"
                                className="
                                    input
                                    input-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                                autoFocus
                            />

                            <p className="text-[11px] text-base-content/50 mt-1.5">
                                Use a unique name for this role.
                            </p>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="rounded-lg border border-error/20 bg-error/5 px-3 py-2">

                                <p className="text-xs text-error">
                                    {error}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* Footer */}

                    <div className="flex justify-end gap-2 p-4 border-t border-base-300">

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
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
                            {role ? 'Update Role' : 'Create Role'}
                        </button>

                    </div>

                </form>

            </div>


            {/* Backdrop */}

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

export default RoleModal