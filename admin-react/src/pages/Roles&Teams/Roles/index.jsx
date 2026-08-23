// admin-react/src/pages/Roles/index.jsx
import { useState } from 'react'

import RoleTable from './components/RoleTable'
import RoleModal from './components/RoleModal'


function Roles() {

    const [search, setSearch] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const [editingRole, setEditingRole] = useState(null)


    const [roles, setRoles] = useState([
        {
            id: 1,
            name: 'team_lead',
            description: 'team_lead',
            createdAt: 'Apr 7, 2026, 3:13:50 PM',
            updatedAt: 'N/A',
            deleted: false,
        },
        {
            id: 2,
            name: 'agent',
            description: 'agent',
            createdAt: 'Apr 8, 2026, 10:20:15 AM',
            updatedAt: 'Apr 10, 2026, 2:30:10 PM',
            deleted: false,
        },
    ])


    const handleCreate = () => {

        setEditingRole(null)
        setShowModal(true)
    }


    const handleEdit = (role) => {

        setEditingRole(role)
        setShowModal(true)
    }


    const handleCloseModal = () => {

        setShowModal(false)
        setEditingRole(null)
    }


    const handleSubmit = (data) => {

        if (editingRole) {

            setRoles((previous) =>
                previous.map((role) =>
                    role.id === editingRole.id
                        ? {
                            ...role,
                            name: data.name,
                            description: data.description,
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
                        : role
                )
            )

        } else {

            const newRole = {
                id: Date.now(),
                name: data.name,
                description: data.description,
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
                deleted: false,
            }


            setRoles((previous) => [
                ...previous,
                newRole,
            ])

        }

        handleCloseModal()
    }


    const handleDelete = (role) => {

        const confirmed = window.confirm(
            `Delete role "${role.name}"?`
        )

        if (!confirmed) {
            return
        }


        setRoles((previous) =>
            previous.map((item) =>
                item.id === role.id
                    ? {
                        ...item,
                        deleted: true,
                    }
                    : item
            )
        )
    }


    const handleRefresh = () => {

        // API refresh will be added later.
        console.log('Refresh roles')
    }


    return (
        <div className="p-4 sm:p-6 space-y-5">


            {/* =====================================================
                ROLE TABLE
            ===================================================== */}

            <RoleTable
                roles={roles}
                search={search}
                setSearch={setSearch}
                showDeleted={showDeleted}
                setShowDeleted={setShowDeleted}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
            />


            {/* =====================================================
                ROLE MODAL
            ===================================================== */}

            <RoleModal
                open={showModal}
                role={editingRole}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />

        </div>
    )
}

export default Roles