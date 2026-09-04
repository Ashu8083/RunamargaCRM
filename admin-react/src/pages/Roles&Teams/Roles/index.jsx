import { useEffect, useState } from 'react'

import RoleTable from './components/RoleTable'
import RoleModal from './components/RoleModal'

import FeedbackModal from '../../../components/GlobalModels/FeedbackModal'

import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
} from './API'


function Roles() {

    // =========================================================
    // ROLES
    // =========================================================

    const [roles, setRoles] = useState([])


    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState('')


    // =========================================================
    // ROLE MODAL
    // =========================================================

    const [showModal, setShowModal] = useState(false)

    const [editingRole, setEditingRole] = useState(null)


    // =========================================================
    // LOADING STATES
    // =========================================================

    const [loading, setLoading] = useState(false)

    const [saving, setSaving] = useState(false)

    const [deletingId, setDeletingId] = useState(null)


    // =========================================================
    // FEEDBACK MODAL
    // =========================================================

    const [feedback, setFeedback] = useState({
        open: false,
        type: 'success',
        title: '',
        message: '',
    })


    // =========================================================
    // SHOW FEEDBACK
    // =========================================================

    const showFeedback = (
        type,
        title,
        message
    ) => {

        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    // =========================================================
    // CLOSE FEEDBACK
    // =========================================================

    const closeFeedback = () => {

        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }


    // =========================================================
    // FETCH ROLES FROM API
    // =========================================================
    //
    // This is the single function responsible for getting
    // the latest Roles/Contexts data from the backend.
    //
    // GET /api/contexts
    //
    // It is used:
    //
    // 1. Initial page load
    // 2. Refresh button
    //
    // =========================================================

    const fetchRoles = async () => {

        setLoading(true)

        try {

            const data = await getRoles()


            /*
             * API.js already normalizes the backend response.
             *
             * Always replace the existing list with the
             * latest API response.
             */
            setRoles(
                Array.isArray(data)
                    ? data
                    : []
            )

        } catch (error) {

            console.error(
                'Failed to load roles:',
                error
            )


            showFeedback(
                'error',
                'Unable to Load Roles',
                error?.message ||
                    'The roles could not be loaded. Please try again.'
            )

        } finally {

            setLoading(false)

        }
    }


    // =========================================================
    // INITIAL API LOAD
    // =========================================================

    useEffect(() => {

        fetchRoles()

    }, [])


    // =========================================================
    // OPEN CREATE MODAL
    // =========================================================

    const handleCreate = () => {

        setEditingRole(null)

        setShowModal(true)
    }


    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const handleEdit = (role) => {

        setEditingRole(role)

        setShowModal(true)
    }


    // =========================================================
    // CLOSE ROLE MODAL
    // =========================================================

    const handleCloseModal = () => {

        /*
         * Do not allow the form to close while a create/update
         * request is currently being processed.
         */
        if (saving) {
            return
        }


        setShowModal(false)

        setEditingRole(null)
    }


    // =========================================================
    // CREATE / UPDATE ROLE
    // =========================================================

    const handleSubmit = async (roleData) => {

        setSaving(true)

        try {

            // =================================================
            // CREATE
            // =================================================

            if (!editingRole) {

                const createdRole =
                    await createRole(roleData)


                /*
                 * Add the newly-created role locally so the
                 * table updates immediately.
                 */
                setRoles((previousRoles) => [
                    ...previousRoles,
                    createdRole,
                ])


                /*
                 * Close the RoleModal after successful creation.
                 */
                setShowModal(false)

                setEditingRole(null)


                /*
                 * Show global success feedback.
                 */
                showFeedback(
                    'success',
                    'Role Created',
                    `The role "${createdRole?.name || roleData.name}" was created successfully.`
                )

                return
            }


            // =================================================
            // UPDATE
            // =================================================

            const updatedRole =
                await updateRole(
                    editingRole.id,
                    roleData
                )


            /*
             * Replace the updated role in the current list.
             */
            setRoles((previousRoles) =>
                previousRoles.map((role) =>
                    role.id === editingRole.id
                        ? updatedRole
                        : role
                )
            )


            /*
             * Close the RoleModal after successful update.
             */
            setShowModal(false)

            setEditingRole(null)


            /*
             * Show global success feedback.
             */
            showFeedback(
                'success',
                'Role Updated',
                `The role "${updatedRole?.name || roleData.name}" was updated successfully.`
            )

        } catch (error) {

            console.error(
                'Failed to save role:',
                error
            )


            /*
             * Keep RoleModal open when the request fails.
             *
             * This allows the user to close the feedback
             * message and correct the form without losing
             * the entered values.
             */
            showFeedback(
                'error',
                editingRole
                    ? 'Unable to Update Role'
                    : 'Unable to Create Role',
                error?.message ||
                    'The role could not be saved. Please try again.'
            )

        } finally {

            setSaving(false)

        }
    }


    // =========================================================
    // DELETE ROLE
    // =========================================================

    const handleDelete = async (role) => {

        if (!role?.id) {

            showFeedback(
                'error',
                'Unable to Delete Role',
                'A valid role ID is required.'
            )

            return
        }


        // =====================================================
        // CONFIRM DELETE
        // =====================================================

        const confirmed = window.confirm(
            `Are you sure you want to delete "${role.name}"?\n\nThis action cannot be undone.`
        )


        if (!confirmed) {
            return
        }


        setDeletingId(role.id)


        try {

            // =================================================
            // DELETE FROM API
            // =================================================

            await deleteRole(role.id)


            /*
             * Remove the deleted role from the current UI
             * immediately.
             */
            setRoles((previousRoles) =>
                previousRoles.filter(
                    (item) =>
                        item.id !== role.id
                )
            )


            /*
             * Show global success feedback.
             */
            showFeedback(
                'success',
                'Role Deleted',
                `The role "${role.name}" was deleted successfully.`
            )

        } catch (error) {

            console.error(
                'Failed to delete role:',
                error
            )


            showFeedback(
                'error',
                'Unable to Delete Role',
                error?.message ||
                    'The role could not be deleted. Please try again.'
            )

        } finally {

            setDeletingId(null)

        }
    }


    // =========================================================
    // REFRESH
    // =========================================================
    //
    // IMPORTANT:
    //
    // This does NOT just reset the React state.
    //
    // It calls:
    //
    // GET /api/contexts
    //
    // again and replaces the current roles with the latest
    // database data.
    //
    // =========================================================

    const handleRefresh = async () => {

        /*
         * Clear the current search so the user sees the
         * complete freshly-loaded dataset.
         */
        setSearch('')


        /*
         * Fetch latest data from backend.
         */
        await fetchRoles()
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                w-full
                space-y-6
                p-4
            "
        >

            {/* =================================================
                ROLE TABLE
            ================================================= */}

            <RoleTable
                roles={roles}

                search={search}
                setSearch={setSearch}

                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}

                loading={loading}
                deletingId={deletingId}
            />


            {/* =================================================
                ROLE MODAL
            ================================================= */}

            <RoleModal
                open={showModal}

                role={editingRole}

                onClose={handleCloseModal}

                onSubmit={handleSubmit}

                loading={saving}
            />


            {/* =================================================
                GLOBAL FEEDBACK MODAL
            ================================================= */}

            <FeedbackModal
                open={feedback.open}

                type={feedback.type}

                title={feedback.title}

                message={feedback.message}

                onClose={closeFeedback}

                autoClose={
                    feedback.type === 'success'
                }

                autoCloseDuration={2500}

                closeOnBackdrop={
                    feedback.type !== 'error'
                }

                showCloseButton={true}

                confirmText="OK"
            />

        </div>
    )
}


export default Roles