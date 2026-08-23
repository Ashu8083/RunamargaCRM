// admin-react/src/pages/Roles&Teams/Admins/index.jsx

import { useState } from 'react'

import AdminTable from './components/AdminTable'
import AdminModal from './components/AdminModal'
import PermissionsModal from './components/PermissionsModal'


function Admins() {

    const [search, setSearch] = useState('')


    const [admins, setAdmins] = useState([
        {
            id: 1,
            name: 'John Admin',
            phone: '9876543210',
            email: 'john.admin@example.com',
            status: 'Active',
            createdAt: 'Apr 7, 2026, 3:13:50 PM',
            updatedAt: 'N/A',

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
            name: 'Rahul Admin',
            phone: '9876543211',
            email: 'rahul.admin@example.com',
            status: 'Absent',
            createdAt: 'Apr 8, 2026, 10:20:15 AM',
            updatedAt: 'Apr 10, 2026, 2:30:10 PM',

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
    // ADD / EDIT MODAL
    // =========================================================

    const [showModal, setShowModal] = useState(false)

    const [editingAdmin, setEditingAdmin] = useState(null)


    // =========================================================
    // PERMISSIONS MODAL
    // =========================================================

    const [showPermissionsModal, setShowPermissionsModal] =
        useState(false)

    const [selectedAdmin, setSelectedAdmin] =
        useState(null)


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
    // CLOSE ADD / EDIT MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingAdmin(null)
    }


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = (data) => {

        if (editingAdmin) {

            setAdmins((previous) =>
                previous.map((admin) =>
                    admin.id === editingAdmin.id
                        ? {
                            ...admin,

                            name: data.name,

                            phone: data.phone,

                            email: data.email,

                            status: data.status,

                            updatedAt: new Date().toLocaleString(
                                'en-IN',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }
                            ),
                        }
                        : admin
                )
            )

        } else {

            const newAdmin = {

                id: Date.now(),

                name: data.name,

                phone: data.phone,

                email: data.email,

                status: data.status,

                createdAt: new Date().toLocaleString(
                    'en-IN',
                    {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                    }
                ),

                updatedAt: 'N/A',

                permissions: [],

            }


            setAdmins((previous) => [
                ...previous,
                newAdmin,
            ])
        }


        handleCloseModal()
    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (admin) => {

        const confirmed = window.confirm(
            `Delete admin "${admin.name}"?`
        )


        if (!confirmed) {
            return
        }


        setAdmins((previous) =>
            previous.filter(
                (item) => item.id !== admin.id
            )
        )
    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (admin, status) => {

        setAdmins((previous) =>
            previous.map((item) =>
                item.id === admin.id
                    ? {
                        ...item,

                        status,

                        updatedAt: new Date().toLocaleString(
                            'en-IN',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                            }
                        ),
                    }
                    : item
            )
        )
    }


    // =========================================================
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (admin) => {

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
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Backend API refresh will be added later.
         */

        console.log('Refresh admins')
    }


    // =========================================================
    // SAVE PERMISSIONS
    // =========================================================

    const handleSavePermissions = (
        adminId,
        permissions
    ) => {

        setAdmins((previous) =>
            previous.map((admin) =>
                admin.id === adminId
                    ? {
                        ...admin,
                        permissions,
                    }
                    : admin
            )
        )
    }


    return (
        <div className="p-4 sm:p-6 space-y-5">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Admins
                </h1>

                <p className="text-sm text-base-content/60 mt-1">
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
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />


            {/* =====================================================
                PERMISSIONS MODAL
            ===================================================== */}

            <PermissionsModal
                open={showPermissionsModal}
                admin={selectedAdmin}
                onClose={handleClosePermissions}
                onSave={handleSavePermissions}
            />

        </div>
    )
}


export default Admins