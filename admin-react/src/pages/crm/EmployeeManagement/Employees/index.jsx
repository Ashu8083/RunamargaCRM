// admin-react/src/pages/crm/EmployeeManagement/Employees/index.jsx

import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
} from 'react'

import { EmpAPI } from '../Employees/Api'
import EmployeeTable from './components/EmployeeTable'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

const EmployeeModal = lazy(
    () => import('./components/EmployeeModal')
)

// =========================================================
// EXTRACT API MESSAGE
// =========================================================

const getApiMessage = (response, fallback) => {
    const data = response?.data
    const message = data?.message ?? data?.detail ?? data?.error

    if (typeof message === 'string' && message.trim()) {
        return message
    }

    if (Array.isArray(message)) {
        return message
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.msg || JSON.stringify(item)
            )
            .join(', ')
    }

    if (message && typeof message === 'object') {
        return (
            message.message ||
            message.msg ||
            JSON.stringify(message)
        )
    }

    return fallback
}

function Employees() {
    const [search, setSearch] = useState('')
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)

    // Feedback modal state
    const [feedback, setFeedback] = useState({
        open: false,
        type: 'success',
        title: '',
        message: '',
    })

    const showFeedback = (
        type,
        message,
        title = ''
    ) => {
        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }

    const closeFeedback = () => {
        setFeedback((prev) => ({
            ...prev,
            open: false,
        }))
    }

    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = useCallback(async () => {
        try {
            const { data } = await EmpAPI.getAll()

            setEmployees(
                Array.isArray(data) ? data : []
            )
        } catch (error) {
            console.error(
                'Failed to fetch employees:',
                error.response?.data || error
            )

            showFeedback(
                'error',
                getApiMessage(
                    error.response,
                    'Failed to load employees'
                )
            )
        }
    }, [])

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
                error.response?.data || error
            )

            showFeedback(
                'error',
                getApiMessage(
                    error.response,
                    'Failed to load employee options'
                )
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
    // EMPLOYEE MODAL
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
            let response
            let fallbackMessage

            if (editingEmployee) {
                response = await EmpAPI.update(
                    editingEmployee.id,
                    data
                )

                fallbackMessage = 'Employee updated successfully'
            } else {
                response = await EmpAPI.create(data)

                fallbackMessage = 'Employee created successfully'
            }

            handleCloseModal()

            showFeedback(
                'success',
                getApiMessage(response, fallbackMessage)
            )

            await loadEmployees()
        } catch (error) {
            console.error(
                'Employee save failed:',
                error.response?.data || error
            )

            showFeedback(
                'error',
                getApiMessage(
                    error.response,
                    'Failed to save employee'
                )
            )
        }
    }

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (employee) => {
        // Preserve native delete confirmation
        if (
            !window.confirm(
                `Delete employee "${employee.name}"?`
            )
        ) {
            return
        }

        try {
            const response = await EmpAPI.delete(
                employee.id
            )

            await loadEmployees()

            showFeedback(
                'success',
                getApiMessage(
                    response,
                    'Employee deleted successfully'
                )
            )
        } catch (error) {
            console.error(
                'Failed to delete employee:',
                error.response?.data || error
            )

            showFeedback(
                'error',
                getApiMessage(
                    error.response,
                    'Failed to delete employee'
                )
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
            const response = await EmpAPI.setBlocked(
                employee.id,
                blocked
            )

            await loadEmployees()

            showFeedback(
                'success',
                getApiMessage(
                    response,
                    blocked
                        ? `${employee.name} blocked successfully`
                        : `${employee.name} unblocked successfully`
                )
            )
        } catch (error) {
            console.error(
                'Failed to update block status:',
                error.response?.data || error
            )

            showFeedback(
                'error',
                getApiMessage(
                    error.response,
                    'Failed to update employee block status'
                )
            )
        }
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="p-4 sm:p-6">
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

            <Suspense fallback={null}>
                {showModal && (
                    <EmployeeModal
                        open={showModal}
                        employee={editingEmployee}
                        employees={employees}
                        roles={roles}
                        permissions={permissions}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                    />
                )}
            </Suspense>

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={closeFeedback}
                autoClose={true}
                autoCloseDuration={3000}
            />
        </div>
    )
}

export default Employees