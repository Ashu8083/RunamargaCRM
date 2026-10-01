import { useCallback, useEffect, useState } from 'react'

import { EmpAPI } from '../Employees/Api'
import EmployeeTable from './components/EmployeeTable'
import EmployeeModal from './components/EmployeeModal'
import { useToast } from '../../../../components/Toast/ToastProvider'


function Employees() {

    const {
        showSuccess,
        showError,
    } = useToast()

    const [search, setSearch] = useState('')
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)


    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = useCallback(async () => {

        try {

            const { data } =
                await EmpAPI.getAll()

            setEmployees(
                Array.isArray(data) ? data : []
            )

        } catch (error) {

            console.error(
                'Failed to fetch employees:',
                error.response?.data || error
            )

            showError(
                error.response?.data?.detail ||
                'Failed to load employees'
            )
        }

    }, [showError])


    // =========================================================
    // LOAD OPTIONS
    // =========================================================

    const loadOptions = useCallback(async () => {

        try {

            const [
                rolesResponse,
                permissionsResponse,
            ] = await EmpAPI.getOptions()

            setRoles(rolesResponse.data)
            setPermissions(permissionsResponse.data)

        } catch (error) {

            console.error(
                'Failed to fetch employee options:',
                error
            )
        }

    }, [])


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadEmployees()
        loadOptions()

    }, [loadEmployees, loadOptions])


    // =========================================================
    // MODAL
    // =========================================================

    const handleCreate = () => {

        setEditingEmployee(null)
        setShowModal(true)

    }


    const handleEdit = (employee) => {

        setEditingEmployee(employee)
        setShowModal(true)

    }


    const handleCloseModal = () => {

        setShowModal(false)
        setEditingEmployee(null)

    }


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = async (data) => {

        try {

            if (editingEmployee) {

                await EmpAPI.update(
                    editingEmployee.id,
                    data
                )

                showSuccess(
                    'Employee updated successfully'
                )

            } else {

                await EmpAPI.create(data)

                showSuccess(
                    'Employee created successfully'
                )
            }

            await loadEmployees()
            handleCloseModal()

        } catch (error) {

            console.error(
                'Employee save failed:',
                error.response?.data || error
            )

            showError(
                error.response?.data?.detail ||
                'Failed to save employee'
            )
        }
    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (employee) => {

        if (
            !window.confirm(
                `Delete employee "${employee.name}"?`
            )
        ) {
            return
        }

        try {

            await EmpAPI.delete(
                employee.id
            )

            await loadEmployees()

        } catch (error) {

            console.error(
                'Failed to delete employee:',
                error.response?.data || error
            )

            showError(
                error.response?.data?.detail ||
                'Failed to delete employee'
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

            await EmpAPI.setBlocked(
                employee.id,
                blocked
            )

            await loadEmployees()

            showSuccess(
                blocked
                    ? `${employee.name} blocked successfully`
                    : `${employee.name} unblocked successfully`
            )

        } catch (error) {

            console.error(
                'Failed to update block status:',
                error.response?.data || error
            )

            showError(
                error.response?.data?.detail ||
                'Failed to update employee block status'
            )
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

            <EmployeeTable
                employees={employees}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={loadEmployees}
                onBlockChange={handleBlockChange}
            />


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