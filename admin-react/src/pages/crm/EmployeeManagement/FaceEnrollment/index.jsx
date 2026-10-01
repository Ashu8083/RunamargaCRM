// admin-react/src/pages/EmployeeManagement/FaceEnrollment/index.jsx

import { useCallback, useEffect, useState } from 'react'

import FaceEnrollmentTable from './components/FaceEnrollmentTable'
import FaceEnrollmentModal from './components/FaceEnrollmentModal'

import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

import {
    getFaceEnrollments,
    uploadFaceEnrollment,
    deleteFaceEnrollment,
    getFaceImageUrl,
} from './API'


function FaceEnrollment() {

    // =========================================================
    // EMPLOYEES
    // =========================================================

    const [employees, setEmployees] =
        useState([])


    // =========================================================
    // SELECTED EMPLOYEE
    // =========================================================

    const [selectedEmployee, setSelectedEmployee] =
        useState(null)


    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] =
        useState('')


    // =========================================================
    // PAGE LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(false)


    // =========================================================
    // MODAL OPERATION LOADING
    // =========================================================

    const [modalLoading, setModalLoading] =
        useState(false)


    // =========================================================
    // DELETING CAPTURE TYPE
    // =========================================================

    const [deletingType, setDeletingType] =
        useState(null)


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

    const showFeedback = useCallback((
        type,
        title,
        message,
    ) => {

        setFeedback({

            open: true,

            type,

            title,

            message,

        })

    }, [])


    // =========================================================
    // CLOSE FEEDBACK
    // =========================================================

    const closeFeedback = useCallback(() => {

        setFeedback((previous) => ({

            ...previous,

            open: false,

        }))

    }, [])


    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = useCallback(
        async (showError = true) => {

            setLoading(true)

            try {

                const data =
                    await getFaceEnrollments()


                setEmployees(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                setEmployees([])

                if (showError) {

                    showFeedback(
                        'error',
                        'Unable to Load Employees',
                        error?.message ||
                            'Failed to load employee face enrollments.'
                    )
                }

            } finally {

                setLoading(false)

            }

        },
        [
            showFeedback,
        ]
    )


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadEmployees()

    }, [
        loadEmployees,
    ])


    // =========================================================
    // OPEN ENROLLMENT MODAL
    // =========================================================

    const handleOpenEnrollment = (
        employee,
    ) => {

        setSelectedEmployee(
            employee
        )

    }


    // =========================================================
    // CLOSE ENROLLMENT MODAL
    // =========================================================

    const handleCloseEnrollment = () => {

        if (modalLoading) {
            return
        }


        setSelectedEmployee(
            null
        )

        setDeletingType(
            null
        )

    }


    // =========================================================
    // UPDATE SELECTED EMPLOYEE
    // =========================================================
    //
    // After upload/delete, update the employee inside the
    // modal immediately from the latest GET response.
    //
    // =========================================================

    const updateSelectedEmployee = (
        employeeList,
    ) => {

        if (!selectedEmployee) {
            return
        }


        const updatedEmployee =
            employeeList.find(
                (employee) =>
                    employee.employeeId ===
                    selectedEmployee.employeeId
            )


        if (updatedEmployee) {

            setSelectedEmployee(
                updatedEmployee
            )

        } else {

            setSelectedEmployee(
                null
            )

        }

    }


    // =========================================================
    // UPLOAD / RE-REGISTER
    // =========================================================

    const handleUpload = async (
        captureType,
        imageFile,
    ) => {

        if (!selectedEmployee?.employeeId) {

            showFeedback(
                'error',
                'Employee Not Selected',
                'Please select an employee before uploading a face image.'
            )

            return
        }


        if (!imageFile) {

            showFeedback(
                'error',
                'Image Required',
                'Please select a face image.'
            )

            return
        }


        setModalLoading(true)


        try {

            const updatedEmployees =
                await uploadFaceEnrollment(
                    selectedEmployee.employeeId,
                    captureType,
                    imageFile,
                )


            setEmployees(
                updatedEmployees
            )


            updateSelectedEmployee(
                updatedEmployees
            )


            showFeedback(
                'success',
                `${captureType} Face Saved`,
                `${captureType} face enrollment was saved successfully.`
            )

        } catch (error) {

            showFeedback(
                'error',
                'Face Enrollment Failed',
                error?.message ||
                    `Unable to save the ${captureType} face enrollment.`
            )

        } finally {

            setModalLoading(false)

        }

    }


    // =========================================================
    // DELETE ENROLLMENT
    // =========================================================

    const handleDelete = async (
        enrollment,
    ) => {

        if (!selectedEmployee?.employeeId) {

            showFeedback(
                'error',
                'Employee Not Selected',
                'Please select an employee.'
            )

            return
        }


        const captureType =
            String(
                enrollment?.captureType || ''
            ).toUpperCase()


        if (!captureType) {

            showFeedback(
                'error',
                'Invalid Enrollment',
                'The selected face enrollment is invalid.'
            )

            return
        }


        setDeletingType(
            captureType
        )

        setModalLoading(true)


        try {

            await deleteFaceEnrollment(
                selectedEmployee.employeeId,
                captureType,
            )


            /*
             * Refresh the complete list after deletion.
             *
             * This keeps the table and modal synchronized
             * with the database.
             */

            const updatedEmployees =
                await getFaceEnrollments()


            setEmployees(
                updatedEmployees
            )


            updateSelectedEmployee(
                updatedEmployees
            )


            showFeedback(
                'success',
                `${captureType} Face Deleted`,
                `${captureType} face enrollment was deleted successfully.`
            )

        } catch (error) {

            showFeedback(
                'error',
                'Unable to Delete Face',
                error?.message ||
                    `Unable to delete the ${captureType} face enrollment.`
            )

        } finally {

            setDeletingType(
                null
            )

            setModalLoading(
                false
            )

        }

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        await loadEmployees()

    }


    // =========================================================
    // PREPARE MODAL EMPLOYEE
    // =========================================================
    //
    // Add imageUrl to each enrollment here.
    //
    // The backend stores a relative path such as:
    //
    // face_enrollment/25/front_xxxxx.jpg
    //
    // The browser needs:
    //
    // /uploads/face_enrollment/25/front_xxxxx.jpg
    //
    // =========================================================

    const modalEmployee = selectedEmployee
        ? {
            ...selectedEmployee,

            enrollments:
                selectedEmployee.enrollments.map(
                    (enrollment) => ({

                        ...enrollment,

                        imageUrl:
                            getFaceImageUrl(
                                enrollment.imagePath
                            ),

                    })
                ),
        }
        : null


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
                FACE ENROLLMENT TABLE
            ================================================= */}

            <FaceEnrollmentTable

                employees={
                    employees
                }

                search={
                    search
                }

                setSearch={
                    setSearch
                }

                onViewEnrollment={
                    handleOpenEnrollment
                }

                onRefresh={
                    handleRefresh
                }

                loading={
                    loading
                }

            />


            {/* =================================================
                FACE ENROLLMENT MODAL
            ================================================= */}

            <FaceEnrollmentModal

                open={
                    Boolean(
                        selectedEmployee
                    )
                }

                employee={
                    modalEmployee
                }

                onClose={
                    handleCloseEnrollment
                }

                onUpload={
                    handleUpload
                }

                onDelete={
                    handleDelete
                }

                loading={
                    modalLoading
                }

                deletingType={
                    deletingType
                }

            />


            {/* =================================================
                GLOBAL FEEDBACK MODAL
            ================================================= */}

            <FeedbackModal

                open={
                    feedback.open
                }

                type={
                    feedback.type
                }

                title={
                    feedback.title
                }

                message={
                    feedback.message
                }

                onClose={
                    closeFeedback
                }

                autoClose={
                    feedback.type === 'success'
                }

                autoCloseDuration={
                    2500
                }

                closeOnBackdrop={
                    feedback.type !== 'error'
                }

                showCloseButton={
                    true
                }

                confirmText="OK"

            />

        </div>
    )
}


export default FaceEnrollment