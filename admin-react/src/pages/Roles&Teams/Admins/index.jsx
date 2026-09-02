// admin-react/src/pages/Roles&Teams/Admins/index.jsx

import { useMemo, useState } from 'react'

import AdminTable from './components/AdminTable'
import AdminModal from './components/AdminModal'

import PermissionsModal from '../../../components/GlobalModels/PermissionsModal'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


function Admins() {

    // =========================================================
    // MOCK EMPLOYEES
    //
    // In the real API these will come from the employee table.
    // Admins are created by selecting one of these employees.
    // =========================================================

    const employees = [
        {
            id: 201,
            name: 'Rahul Sharma',
            employeeId: 'EMP201',
            phone: '9876543210',
            email: 'rahul@runamarga.com',
        },

        {
            id: 202,
            name: 'Anil Kumar',
            employeeId: 'EMP202',
            phone: '9845671234',
            email: 'anil@runamarga.com',
        },

        {
            id: 203,
            name: 'Vikram Singh',
            employeeId: 'EMP203',
            phone: '9988776655',
            email: 'vikram@runamarga.com',
        },

        {
            id: 204,
            name: 'Arjun Rao',
            employeeId: 'EMP204',
            phone: '9123456789',
            email: 'arjun@runamarga.com',
        },

        {
            id: 205,
            name: 'Kiran Kumar',
            employeeId: 'EMP205',
            phone: '9012345678',
            email: 'kiran@runamarga.com',
        },
    ]


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const getCurrentDateTime = () => {

        return new Date().toLocaleString(
            'en-IN',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
            }
        )

    }


    // =========================================================
    // MOCK ADMINS
    //
    // employeeId connects an admin to an existing employee.
    // =========================================================

    const [admins, setAdmins] = useState([
        {
            id: 1,

            employeeId: 201,

            name: 'Rahul Sharma',

            phone: '9876543210',

            email: 'rahul@runamarga.com',

            status: 'Active',

            createdAt:
                'Apr 7, 2026, 3:13:50 PM',

            updatedAt:
                'N/A',

            permissions: [
                {
                    id: 1,
                    name: 'View RM Applications',
                    group: 'RM',
                },

                {
                    id: 11,
                    name: 'View Dashboard',
                    group: 'Common',
                },
            ],
        },

        {
            id: 2,

            employeeId: 202,

            name: 'Anil Kumar',

            phone: '9845671234',

            email: 'anil@runamarga.com',

            status: 'Absent',

            createdAt:
                'Apr 8, 2026, 10:20:15 AM',

            updatedAt:
                'Apr 10, 2026, 2:30:10 PM',

            permissions: [
                {
                    id: 6,
                    name: 'View Agent Applications',
                    group: 'Agent',
                },

                {
                    id: 12,
                    name: 'View Profile',
                    group: 'Common',
                },
            ],
        },
    ])


    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState('')


    // =========================================================
    // ADD / EDIT ADMIN MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)


    const [editingAdmin, setEditingAdmin] =
        useState(null)


    // =========================================================
    // PERMISSIONS MODAL
    // =========================================================

    const [
        showPermissionsModal,
        setShowPermissionsModal,
    ] = useState(false)


    const [
        selectedAdmin,
        setSelectedAdmin,
    ] = useState(null)


    // =========================================================
    // EMPLOYEES AVAILABLE FOR ADMIN CREATION
    //
    // An employee who is already an admin is removed from
    // the selection list.
    // =========================================================

    const availableEmployees = useMemo(() => {

        const adminEmployeeIds =
            new Set(
                admins
                    .map(
                        (admin) =>
                            String(admin.employeeId)
                    )
                    .filter(Boolean)
            )


        return employees.filter(
            (employee) =>
                !adminEmployeeIds.has(
                    String(employee.id)
                )
        )

    }, [admins])


    // =========================================================
    // CREATE ADMIN
    // =========================================================

    const handleCreate = () => {

        setEditingAdmin(null)

        setShowModal(true)

    }


    // =========================================================
    // EDIT ADMIN
    // =========================================================

    const handleEdit = (admin) => {

        setEditingAdmin(admin)

        setShowModal(true)

    }


    // =========================================================
    // CLOSE ADD / EDIT MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingAdmin(null)

    }


    // =========================================================
    // CREATE / UPDATE ADMIN
    // =========================================================

    const handleSubmit = (data) => {

        // =====================================================
        // UPDATE EXISTING ADMIN
        //
        // Only status can be changed.
        // =====================================================

        if (editingAdmin) {

            setAdmins((previous) =>

                previous.map((admin) => {

                    if (
                        admin.id !==
                        editingAdmin.id
                    ) {
                        return admin
                    }


                    return {

                        ...admin,

                        status:
                            data.status,

                        updatedAt:
                            getCurrentDateTime(),

                    }

                })

            )


            handleCloseModal()

            return

        }


        // =====================================================
        // CREATE NEW ADMIN
        // =====================================================

        const employee =
            employees.find(
                (item) =>
                    String(item.id) ===
                    String(data.employeeId)
            )


        if (!employee) {

            return

        }


        // =====================================================
        // DUPLICATE CHECK
        // =====================================================

        const alreadyAdmin =
            admins.some(
                (admin) =>
                    String(admin.employeeId) ===
                    String(employee.id)
            )


        if (alreadyAdmin) {

            return

        }


        const now =
            getCurrentDateTime()


        const newAdmin = {

            id:
                Date.now(),

            employeeId:
                employee.id,

            name:
                employee.name,

            phone:
                employee.phone ||
                '',

            email:
                employee.email ||
                '',

            status:
                data.status ||
                'Active',

            createdAt:
                now,

            updatedAt:
                'N/A',

            permissions:
                [],

        }


        setAdmins((previous) => [

            ...previous,

            newAdmin,

        ])


        handleCloseModal()

    }


    // =========================================================
    // DELETE ADMIN
    // =========================================================

    const handleDelete = (admin) => {

        const confirmed =
            window.confirm(
                `Delete admin "${admin.name}"?`
            )


        if (!confirmed) {
            return
        }


        setAdmins((previous) =>
            previous.filter(
                (item) =>
                    item.id !== admin.id
            )
        )

    }


    // =========================================================
    // STATUS CHANGE
    //
    // This is the inline status dropdown in the table.
    // =========================================================

    const handleStatusChange = (
        admin,
        status
    ) => {

        setAdmins((previous) =>

            previous.map((item) => {

                if (
                    item.id !==
                    admin.id
                ) {
                    return item
                }


                return {

                    ...item,

                    status,

                    updatedAt:
                        getCurrentDateTime(),

                }

            })

        )

    }


    // =========================================================
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (
        admin
    ) => {

        setSelectedAdmin(admin)

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
    // SAVE PERMISSIONS
    // =========================================================

    const handleSavePermissions = (
        adminId,
        permissions
    ) => {

        setAdmins((previous) =>

            previous.map((admin) => {

                if (
                    admin.id !==
                    adminId
                ) {
                    return admin
                }


                return {

                    ...admin,

                    permissions,

                }

            })

        )


        // Keep selected admin data in sync
        // while the permissions modal is open.

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

    const handleRefresh = () => {

        /*
         * Backend API refresh will be added later.
         */

        console.log(
            'Refresh admins'
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                    sm:text-3xl
                ">
                    Admins
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    Manage administrators, permissions and account status.
                </p>

            </div>


            {/* =====================================================
                ADMIN TABLE
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
                ADD / EDIT ADMIN MODAL
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
            />


            {/* =====================================================
                PERMISSIONS MODAL
            ===================================================== */}

            <PermissionsModal
                open={
                    showPermissionsModal
                }
                admin={
                    selectedAdmin
                }
                onClose={
                    handleClosePermissions
                }
                onSave={
                    handleSavePermissions
                }
            />

        </div>

    )

}


export default Admins