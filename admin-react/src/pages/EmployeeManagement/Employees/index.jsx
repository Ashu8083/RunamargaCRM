// admin-react/src/pages/EmployeeManagement/Employees/index.jsx

import { useState } from 'react'

import EmployeeTable from './components/EmployeeTable'
import EmployeeModal from './components/EmployeeModal'

// =============================================================
// MOCK EMPLOYEES
// =============================================================

const INITIAL_EMPLOYEES = [
    {
        id: 1,
        employeeId: 'EMP001',

        name: 'Nitish',
        email: 'Nitish.runamarga@gmail.com',
        phone: '9611413650',
        alternatePhone: '',

        role: 'agent',
        status: 'Active',
        blocked: false,

        gender: 'male',
        designation: 'Loan Agent',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1998-04-12',
        joiningDate: '2026-04-07',

        currentCtc: '360000',
        previousCtc: '',
        bloodGroup: 'O+',

        panCardNo: 'ABCDE1234F',
        aadhaarCardNo: 'XXXX XXXX 1234',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
            'loans.view',
        ],

        createdAt: 'Apr 7, 2026, 3:13:50 PM',
        updatedAt: 'N/A',
    },

    {
        id: 2,
        employeeId: 'EMP002',

        name: 'Bindhu Shree',
        email: 'bindushree.runamarga@gmail.com',
        phone: '7975059204',
        alternatePhone: '',

        role: 'agent',
        status: 'Active',
        blocked: false,

        gender: 'female',
        designation: 'Loan Agent',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1997-08-18',
        joiningDate: '2026-04-08',

        currentCtc: '360000',
        previousCtc: '',
        bloodGroup: 'B+',

        panCardNo: 'BCDEF2345G',
        aadhaarCardNo: 'XXXX XXXX 2345',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
        ],

        createdAt: 'Apr 8, 2026, 10:20:15 AM',
        updatedAt: 'N/A',
    },

    {
        id: 3,
        employeeId: 'EMP003',

        name: 'Deepa Kumari',
        email: 'deepakumari.runamarga@gmail.com',
        phone: '9620358237',
        alternatePhone: '',

        role: 'agent',
        status: 'Active',
        blocked: false,

        gender: 'female',
        designation: 'Senior Loan Agent',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1996-02-20',
        joiningDate: '2026-04-09',

        currentCtc: '420000',
        previousCtc: '',
        bloodGroup: 'A+',

        panCardNo: 'CDEFG3456H',
        aadhaarCardNo: 'XXXX XXXX 3456',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
            'loans.view',
        ],

        createdAt: 'Apr 9, 2026, 11:15:30 AM',
        updatedAt: 'N/A',
    },

    {
        id: 4,
        employeeId: 'EMP004',

        name: 'Razak',
        email: 'razak.runamarga@gmail.com',
        phone: '8431622290',
        alternatePhone: '',

        role: 'agent',
        status: 'Active',
        blocked: false,

        gender: 'male',
        designation: 'Loan Agent',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1995-11-10',
        joiningDate: '2026-04-10',

        currentCtc: '360000',
        previousCtc: '',
        bloodGroup: 'AB+',

        panCardNo: 'DEFGH4567J',
        aadhaarCardNo: 'XXXX XXXX 4567',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
        ],

        createdAt: 'Apr 10, 2026, 9:45:20 AM',
        updatedAt: 'N/A',
    },

    {
        id: 5,
        employeeId: 'EMP005',

        name: 'Aravind Kumar',
        email: 'aravind.runamarga@gmail.com',
        phone: '9876543210',
        alternatePhone: '',

        role: 'rm',
        status: 'Active',
        blocked: false,

        gender: 'male',
        designation: 'Relationship Manager',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1994-06-15',
        joiningDate: '2026-04-11',

        currentCtc: '600000',
        previousCtc: '',
        bloodGroup: 'O+',

        panCardNo: 'EFGHI5678K',
        aadhaarCardNo: 'XXXX XXXX 5678',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
            'loans.view',
            'customers.view',
        ],

        createdAt: 'Apr 11, 2026, 2:10:45 PM',
        updatedAt: 'N/A',
    },

    {
        id: 6,
        employeeId: 'EMP006',

        name: 'Priya Sharma',
        email: 'priya.runamarga@gmail.com',
        phone: '9988776655',
        alternatePhone: '',

        role: 'hr',
        status: 'Inactive',
        blocked: false,

        gender: 'female',
        designation: 'HR Executive',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1993-09-25',
        joiningDate: '2026-04-12',

        currentCtc: '480000',
        previousCtc: '',
        bloodGroup: 'B+',

        panCardNo: 'FGHIJ6789L',
        aadhaarCardNo: 'XXXX XXXX 6789',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'employees.view',
            'employees.edit',
        ],

        createdAt: 'Apr 12, 2026, 4:25:10 PM',
        updatedAt: 'N/A',
    },

    {
        id: 7,
        employeeId: 'EMP007',

        name: 'Suresh Kumar',
        email: 'suresh.runamarga@gmail.com',
        phone: '9876543211',
        alternatePhone: '',

        role: 'rm',
        status: 'Active',
        blocked: true,

        gender: 'male',
        designation: 'Relationship Manager',
        shiftType: 'General',
        currentAddress: 'Bengaluru, Karnataka',

        dateOfBirth: '1992-12-05',
        joiningDate: '2026-04-13',

        currentCtc: '600000',
        previousCtc: '',
        bloodGroup: 'A+',

        panCardNo: 'GHIJK7890M',
        aadhaarCardNo: 'XXXX XXXX 7890',

        profileImage: '',

        documents: {
            aadhaarCard: '',
            panCard: '',
            bankPassbook: '',
            salarySlips: [],
        },

        permissions: [
            'dashboard.view',
            'leads.view',
            'loans.view',
        ],

        createdAt: 'Apr 13, 2026, 11:40:25 AM',
        updatedAt: 'N/A',
    },
]


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

    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] =
        useState('')


    // =========================================================
    // EMPLOYEE DATA
    // =========================================================

    const [employees, setEmployees] =
        useState(INITIAL_EMPLOYEES)


    // =========================================================
    // MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)


    const [editingEmployee, setEditingEmployee] =
        useState(null)


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

    const handleSubmit = (data) => {

        if (!data) {
            return
        }


        // =====================================================
        // EDIT
        // =====================================================

        if (editingEmployee) {

            setEmployees((previous) =>
                previous.map((employee) => {

                    if (
                        employee.id !==
                        editingEmployee.id
                    ) {
                        return employee
                    }


                    return {
                        ...employee,

                        // -------------------------------
                        // BASIC DETAILS
                        // -------------------------------

                        name:
                            data.name ??
                            employee.name,

                        email:
                            data.email ??
                            employee.email,

                        phone:
                            data.phone ??
                            employee.phone,

                        alternatePhone:
                            data.alternatePhone ??
                            employee.alternatePhone,

                        role:
                            data.role ??
                            employee.role,

                        status:
                            data.status ??
                            employee.status,

                        // -------------------------------
                        // PERSONAL / EMPLOYEE DETAILS
                        // -------------------------------

                        gender:
                            data.gender ??
                            employee.gender,

                        designation:
                            data.designation ??
                            employee.designation,

                        shiftType:
                            data.shiftType ??
                            employee.shiftType,

                        currentAddress:
                            data.currentAddress ??
                            employee.currentAddress,

                        dateOfBirth:
                            data.dateOfBirth ??
                            employee.dateOfBirth,

                        joiningDate:
                            data.joiningDate ??
                            employee.joiningDate,

                        currentCtc:
                            data.currentCtc ??
                            employee.currentCtc,

                        previousCtc:
                            data.previousCtc ??
                            employee.previousCtc,

                        bloodGroup:
                            data.bloodGroup ??
                            employee.bloodGroup,

                        panCardNo:
                            data.panCardNo ??
                            employee.panCardNo,

                        aadhaarCardNo:
                            data.aadhaarCardNo ??
                            employee.aadhaarCardNo,

                        profileImage:
                            data.profileImage ??
                            employee.profileImage,

                        // -------------------------------
                        // DOCUMENTS
                        // -------------------------------

                        documents:
                            data.documents ??
                            employee.documents,

                        // -------------------------------
                        // PERMISSIONS
                        // -------------------------------

                        permissions:
                            Array.isArray(
                                data.permissions
                            )
                                ? data.permissions
                                : employee.permissions,

                        // -------------------------------
                        // AUDIT
                        // -------------------------------

                        updatedAt:
                            getCurrentTimestamp(),
                    }

                })
            )

        }

        // =====================================================
        // CREATE
        // =====================================================

        else {

            const newEmployee = {

                id:
                    Date.now(),

                employeeId:
                    `EMP${String(
                        employees.length + 1
                    ).padStart(3, '0')}`,

                // -------------------------------
                // BASIC DETAILS
                // -------------------------------

                name:
                    data.name ||
                    '',

                email:
                    data.email ||
                    '',

                phone:
                    data.phone ||
                    '',

                alternatePhone:
                    data.alternatePhone ||
                    '',

                role:
                    data.role ||
                    'agent',

                status:
                    data.status ||
                    'Active',

                blocked:
                    false,

                // -------------------------------
                // PERSONAL DETAILS
                // -------------------------------

                gender:
                    data.gender ||
                    'male',

                designation:
                    data.designation ||
                    '',

                shiftType:
                    data.shiftType ||
                    '',

                currentAddress:
                    data.currentAddress ||
                    '',

                dateOfBirth:
                    data.dateOfBirth ||
                    '',

                joiningDate:
                    data.joiningDate ||
                    '',

                currentCtc:
                    data.currentCtc ||
                    '',

                previousCtc:
                    data.previousCtc ||
                    '',

                bloodGroup:
                    data.bloodGroup ||
                    '',

                panCardNo:
                    data.panCardNo ||
                    '',

                aadhaarCardNo:
                    data.aadhaarCardNo ||
                    '',

                profileImage:
                    data.profileImage ||
                    '',

                // -------------------------------
                // DOCUMENTS
                // -------------------------------

                documents:
                    data.documents || {
                        aadhaarCard: '',
                        panCard: '',
                        bankPassbook: '',
                        salarySlips: [],
                    },

                // -------------------------------
                // PERMISSIONS
                // -------------------------------

                permissions:
                    Array.isArray(
                        data.permissions
                    )
                        ? data.permissions
                        : [],

                // -------------------------------
                // AUDIT
                // -------------------------------

                createdAt:
                    getCurrentTimestamp(),

                updatedAt:
                    'N/A',
            }


            setEmployees((previous) => [
                ...previous,
                newEmployee,
            ])

        }


        handleCloseModal()

    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (employee) => {

        const confirmed =
            window.confirm(
                `Delete employee "${employee.name}"?`
            )


        if (!confirmed) {
            return
        }


        setEmployees((previous) =>
            previous.filter(
                (item) =>
                    item.id !== employee.id
            )
        )

    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (
        employee,
        status
    ) => {

        setEmployees((previous) =>
            previous.map((item) => {

                if (
                    item.id !== employee.id
                ) {
                    return item
                }


                return {
                    ...item,

                    status,

                    updatedAt:
                        getCurrentTimestamp(),
                }

            })
        )

    }


    // =========================================================
    // BLOCK / UNBLOCK
    // =========================================================

    const handleBlockChange = (
        employee,
        blocked
    ) => {

        setEmployees((previous) =>
            previous.map((item) => {

                if (
                    item.id !== employee.id
                ) {
                    return item
                }


                return {
                    ...item,

                    blocked,

                    updatedAt:
                        getCurrentTimestamp(),
                }

            })
        )

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Mock refresh.
         *
         * Later this can be replaced with:
         *
         * GET /employees
         *
         * without changing the table or modal.
         */

        console.log(
            'Refresh employees'
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
                employees={
                    employees
                }

                search={
                    search
                }

                setSearch={
                    setSearch
                }

                onCreate={
                    handleCreate
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDelete
                }

                onRefresh={
                    handleRefresh
                }

                onStatusChange={
                    handleStatusChange
                }

                onBlockChange={
                    handleBlockChange
                }
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <EmployeeModal
                open={
                    showModal
                }

                employee={
                    editingEmployee
                }

                onClose={
                    handleCloseModal
                }

                onSubmit={
                    handleSubmit
                }
            />

        </div>

    )

}


export default Employees