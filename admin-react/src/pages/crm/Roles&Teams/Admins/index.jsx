// admin-react/src/pages/Roles&Teams/Admins/index.jsx

import { useEffect, useMemo, useState } from 'react'

import AdminTable from './components/AdminTable'
import AdminModal from './components/AdminModal'

import PermissionsModal from '../../../../components/GlobalModels/PermissionsModal'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

import {
    getAdmins,
    getEmployees,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateAdminStatus,
    getApiErrorMessage,
} from './API'


function Admins() {

    // =========================================================
    // DATA
    // =========================================================

    const [admins, setAdmins] = useState([])
    const [employees, setEmployees] = useState([])

    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)


    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState('')


    // =========================================================
    // ADD / EDIT MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)

    const [editingAdmin, setEditingAdmin] =
        useState(null)


    // =========================================================
    // PERMISSIONS MODAL
    // =========================================================

    const [showPermissionsModal, setShowPermissionsModal] =
        useState(false)

    const [selectedAdmin, setSelectedAdmin] =
        useState(null)


    // =========================================================
    // FEEDBACK MODAL
    // =========================================================

    const [feedback, setFeedback] = useState({
        open: false,
        type: 'info',
        title: '',
        message: '',
    })


    // =========================================================
    // FEEDBACK HELPERS
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


    const closeFeedback = () => {

        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }


    // =========================================================
    // LOAD ADMINS
    // =========================================================

    const loadAdmins = async () => {

        try {

            setLoading(true)

            const data = await getAdmins()

            setAdmins(
                Array.isArray(data)
                    ? data
                    : []
            )

        } catch (error) {

            showFeedback(
                'error',
                'Failed to Load Admins',
                getApiErrorMessage(
                    error,
                    'Unable to load admins.'
                )
            )

        } finally {

            setLoading(false)

        }
    }


    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = async () => {

        try {

            const data = await getEmployees()

            setEmployees(
                Array.isArray(data)
                    ? data
                    : []
            )

        } catch (error) {

            showFeedback(
                'error',
                'Failed to Load Employees',
                getApiErrorMessage(
                    error,
                    'Unable to load employees.'
                )
            )

        }
    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadAdmins()
        loadEmployees()

    }, [])


    // =========================================================
    // AVAILABLE EMPLOYEES
    // =========================================================
    //
    // Employees already having a GLOBAL Admin context are
    // removed from the create dropdown.
    //
    // =========================================================

    const availableEmployees = useMemo(() => {

        const adminEmployeeIds =
            new Set(
                admins
                    .map(
                        (admin) =>
                            admin.employee_id ??
                            admin.employeeId
                    )
                    .filter(
                        (id) =>
                            id !== null &&
                            id !== undefined
                    )
                    .map(String)
            )


        return employees.filter(
            (employee) =>
                !adminEmployeeIds.has(
                    String(employee.id)
                )
        )

    }, [admins, employees])


    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {

        setEditingAdmin(null)

        setShowModal(true)
    }


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (admin) => {

        setEditingAdmin(admin)

        setShowModal(true)
    }


    // =========================================================
    // CLOSE ADD / EDIT
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingAdmin(null)
    }


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = async (data) => {

        try {

            setActionLoading(true)

            // =================================================
            // UPDATE
            // =================================================

            if (editingAdmin) {

                const response =
                    await updateAdmin(
                        editingAdmin.id,
                        data
                    )

                const updatedAdmin =
                    response || editingAdmin

                setAdmins((previous) =>
                    previous.map((admin) =>
                        admin.id === editingAdmin.id
                            ? {
                                ...admin,
                                ...updatedAdmin,
                                employee_id:
                                    updatedAdmin.employee_id ??
                                    admin.employee_id,
                                employeeId:
                                    updatedAdmin.employee_id ??
                                    admin.employee_id,
                                context_id:
                                    updatedAdmin.context_id ??
                                    admin.context_id,
                                contextId:
                                    updatedAdmin.context_id ??
                                    admin.context_id,
                            }
                            : admin
                    )
                )

                handleCloseModal()

                showFeedback(
                    'success',
                    'Admin Updated',
                    'Admin details updated successfully.'
                )

                return
            }


            // =================================================
            // CREATE
            // =================================================

            const response =
                await createAdmin(data)

            const employee =
                employees.find(
                    (item) =>
                        String(item.id) ===
                        String(
                            data.employee_id ??
                            data.employeeId
                        )
                )


            if (response) {

                setAdmins((previous) => [
                    ...previous,
                    {
                        ...response,
                        name:
                            response.name ||
                            employee?.name ||
                            'N/A',
                        phone:
                            response.phone ||
                            employee?.phone ||
                            'N/A',
                        email:
                            response.email ||
                            employee?.email ||
                            'N/A',
                        employee_id:
                            response.employee_id ??
                            employee?.id,
                        employeeId:
                            response.employee_id ??
                            employee?.id,
                        role: 'Admin',
                        role_code: 'GLOBAL',
                        status:
                            response.status ||
                            data.status ||
                            'Active',
                        is_active:
                            response.is_active ??
                            data.status === 'Active',
                    },
                ])

            } else {

                await loadAdmins()
            }

            handleCloseModal()

            showFeedback(
                'success',
                'Admin Created',
                'Admin created successfully.'
            )

        } catch (error) {

            showFeedback(
                'error',
                editingAdmin
                    ? 'Admin Update Failed'
                    : 'Admin Creation Failed',
                getApiErrorMessage(
                    error,
                    editingAdmin
                        ? 'Unable to update admin.'
                        : 'Unable to create admin.'
                )
            )

        } finally {

            setActionLoading(false)

        }
    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (admin) => {

        const confirmed =
            window.confirm(
                `Delete admin "${admin.name}"?`
            )

        if (!confirmed) {
            return
        }

        try {

            setActionLoading(true)

            await deleteAdmin(admin.id)

            setAdmins((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== admin.id
                )
            )

            showFeedback(
                'success',
                'Admin Deleted',
                'Admin deleted successfully.'
            )

        } catch (error) {

            showFeedback(
                'error',
                'Admin Delete Failed',
                getApiErrorMessage(
                    error,
                    'Unable to delete admin.'
                )
            )

        } finally {

            setActionLoading(false)

        }
    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = async (
        admin,
        status
    ) => {

        const previousStatus =
            admin.status

        try {

            setActionLoading(true)

            const response =
                await updateAdminStatus(
                    admin.id,
                    status
                )

            setAdmins((previous) =>
                previous.map((item) =>
                    item.id === admin.id
                        ? {
                            ...item,
                            ...response,
                            status,
                            is_active:
                                status === 'Active',
                        }
                        : item
                )
            )

            showFeedback(
                'success',
                'Status Updated',
                `Admin status changed to ${status}.`
            )

        } catch (error) {

            setAdmins((previous) =>
                previous.map((item) =>
                    item.id === admin.id
                        ? {
                            ...item,
                            status: previousStatus,
                            is_active:
                                previousStatus === 'Active',
                        }
                        : item
                )
            )

            showFeedback(
                'error',
                'Status Update Failed',
                getApiErrorMessage(
                    error,
                    'Unable to update admin status.'
                )
            )

        } finally {

            setActionLoading(false)

        }
    }


    // =========================================================
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (
        admin
    ) => {

        const employeeId =
            admin?.employee_id ??
            admin?.employeeId

        const contextId =
            admin?.context_id ??
            admin?.contextId

        if (!employeeId || !contextId) {

            showFeedback(
                'error',
                'Permission Error',
                'Admin employee or context information is missing.'
            )

            return
        }

        if (!admin?.is_active) {

            showFeedback(
                'warning',
                'Admin Inactive',
                'Activate this Admin before managing permissions.'
            )

            return
        }

        setSelectedAdmin({
            ...admin,
            employee_id: Number(employeeId),
            employeeId: Number(employeeId),
            context_id: Number(contextId),
            contextId: Number(contextId),
        })

        setShowPermissionsModal(true)
    }


    // =========================================================
    // CLOSE PERMISSIONS
    // =========================================================

    const handleClosePermissions = () => {

        setShowPermissionsModal(false)

        setSelectedAdmin(null)
    }


    // =========================================================
    // PERMISSIONS SAVE
    // =========================================================
    //
    // PermissionsModal itself handles the backend permission
    // update. We only keep the selected Admin reference synced.
    //
    // =========================================================

    const handleSavePermissions = (
        adminId,
        permissions
    ) => {

        setSelectedAdmin((previous) => {

            if (
                !previous ||
                previous.id !== adminId
            ) {
                return previous
            }

            return {
                ...previous,
                permissions,
            }
        })
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        try {

            setLoading(true)

            await Promise.all([
                loadAdmins(),
                loadEmployees(),
            ])

            showFeedback(
                'success',
                'Refreshed',
                'Admin data refreshed successfully.'
            )

        } catch (error) {

            showFeedback(
                'error',
                'Refresh Failed',
                getApiErrorMessage(
                    error,
                    'Unable to refresh admin data.'
                )
            )

        } finally {

            setLoading(false)

        }
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            p-4
            sm:p-6
        ">

 
       

            {/* =====================================================
                TABLE
            ===================================================== */}

            <AdminTable
                admins={admins}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onManagePermissions={
                    handleManagePermissions
                }
                onStatusChange={
                    handleStatusChange
                }
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <AdminModal
                open={showModal}
                admin={editingAdmin}
                employees={
                    editingAdmin
                        ? employees
                        : availableEmployees
                }
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                loading={actionLoading}
            />


            {/* =====================================================
                PERMISSIONS
                =====================================================
                
                IMPORTANT:
                Existing PermissionsModal is not modified.

                It receives the REAL Employee.id and
                EmployeeContext.context_id.

            ===================================================== */}

            <PermissionsModal
                open={showPermissionsModal}
                admin={selectedAdmin}
                employeeId={
                    selectedAdmin?.employee_id
                }
                contextId={
                    selectedAdmin?.context_id
                }
                onClose={handleClosePermissions}
                onSave={handleSavePermissions}
            />


            {/* =====================================================
                FEEDBACK
            ===================================================== */}

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={closeFeedback}
            />

        </div>
    )
}


export default Admins