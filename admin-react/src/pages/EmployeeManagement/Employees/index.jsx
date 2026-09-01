// admin-react/src/pages/EmployeeManagement/Employees/index.jsx
import { useEffect, useState } from 'react'
import apiClient from '../../../app/apiClient'

import EmployeeTable from './components/EmployeeTable'
import EmployeeModal from './components/EmployeeModal'
import { useToast } from '../../../components/Toast/ToastProvider'


// =============================================================
// DATE FORMATTER
// =============================================================

const getCurrentTimestamp = () => {

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


// =============================================================
// EMPLOYEES
// =============================================================

function Employees() {
    const {
        showSuccess,
        showError,
    } = useToast()

    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [roles, setRoles] = useState([])
    // =========================================================
    // EMPLOYEE DATA
    // =========================================================
    const [permissions, setPermissions] = useState([])
    const [employees, setEmployees] =
        useState([])


    // =========================================================
    // MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)


    const [editingEmployee, setEditingEmployee] =
        useState(null)
    const fetchEmployees = async () => {
        try {
            const response = await apiClient.get("/employees");

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch employees:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.detail ||
                "Failed to load employees"
            );
        }
    };
    useEffect(() => {
        fetchEmployees()
        fetchEmployeeOptions()
    }, [])
    const fetchEmployeeOptions = async () => {
        try {
            const [
                rolesResponse,
                permissionsResponse,
            ] = await Promise.all([
                apiClient.get('/employees/roles'),
                apiClient.get('/employees/permissions'),
            ])

            setRoles(rolesResponse.data)
            setPermissions(permissionsResponse.data)

        } catch (error) {
            console.error(
                'Failed to fetch employee options:',
                error
            )
        }
    }
    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {

        setEditingEmployee(null)

        setShowModal(true)

    }


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (employee) => {

        setEditingEmployee(employee)

        setShowModal(true)

    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingEmployee(null)

    }


    // =========================================================
    // CREATE / UPDATE EMPLOYEE
    // =========================================================

    const handleSubmit = async (data) => {
        try {

            if (editingEmployee) {

                await apiClient.put(
                    `/employees/${editingEmployee.id}`,
                    data
                );

                await fetchEmployees();
                handleCloseModal();

                showSuccess(
                    "Employee updated successfully"
                );

                return;
            }

            await apiClient.post(
                "/employees",
                data
            );

            await fetchEmployees();
            handleCloseModal();

            showSuccess(
                "Employee created successfully"
            );

        } catch (error) {

            console.error(
                "EMPLOYEE API ERROR:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.detail ||
                "Failed to save employee"
            );
        }
    };
    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (employee) => {

        const confirmed = window.confirm(
            `Delete employee "${employee.name}"?`
        )

        if (!confirmed) {
            return
        }

        try {

            const response = await apiClient.delete(
                `/employees/${employee.id}`
            )

            console.log(
                'DELETE EMPLOYEE API:',
                response.data
            )

            await fetchEmployees()

        } catch (error) {

            console.error(
                'Failed to delete employee:',
                error.response?.data || error
            )

        }
    }

    // =========================================================
    // BLOCK / UNBLOCK
    // =========================================================

    const handleBlockChange = async (
        employee,
        blocked
    ) => {

        try {

            const response = await apiClient.patch(
                `/employees/${employee.id}/block`,
                null,
                {
                    params: {
                        blocked: blocked,
                    },
                }
            )

            console.log(
                "BLOCK API RESPONSE:",
                response.data
            )

            await fetchEmployees()

            showSuccess(
                blocked
                    ? `${employee.name} blocked successfully`
                    : `${employee.name} unblocked successfully`
            )

        } catch (error) {

            console.error(
                "BLOCK API FAILED:",
                error.response?.status
            )

            console.error(
                "BLOCK API ERROR:",
                error.response?.data
            )

            showError(
                error.response?.data?.detail ||
                "Failed to update employee block status"
            )

        }
    }

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {
        fetchEmployees();
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
                    text-base-content
                    sm:text-3xl
                ">
                    Employees
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    Manage employees, status and access.
                </p>

            </div>


            {/* =====================================================
                EMPLOYEE TABLE
            ===================================================== */}

            <EmployeeTable
                employees={employees}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onBlockChange={handleBlockChange}
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <EmployeeModal
                open={showModal}
                employee={editingEmployee}
                employees={employees}
                roles={roles}
                permissions={permissions}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />

        </div>

    )

}


export default Employees