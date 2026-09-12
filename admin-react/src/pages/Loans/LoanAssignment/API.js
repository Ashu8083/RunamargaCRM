// admin-react/src/pages/Loans/LoanAssignment/API.js

import apiClient from '../../../app/apiClient'


// =========================================================
// API ERROR
// =========================================================

export const getApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
) => {

    const data = error?.response?.data


    if (
        typeof data?.detail === 'string' &&
        data.detail.trim()
    ) {

        return data.detail.trim()
    }


    if (
        Array.isArray(
            data?.detail
        )
    ) {

        const messages =
            data.detail
                .map(
                    (item) =>
                        typeof item === 'string'
                            ? item
                            : item?.msg
                )
                .filter(Boolean)


        if (
            messages.length
        ) {

            return messages.join(
                ', '
            )
        }
    }


    if (
        typeof data?.message === 'string' &&
        data.message.trim()
    ) {

        return data.message.trim()
    }


    if (
        typeof error?.message === 'string' &&
        error.message.trim()
    ) {

        return error.message.trim()
    }


    return fallback
}


// =========================================================
// NORMALIZE LOAN ASSIGNMENT
// =========================================================
//
// Backend:
//
// {
//     id,
//     name,
//     permission,
//     agents: [
//         {
//             employee_context_id,
//             employee_id,
//             name,
//             assigned
//         }
//     ]
// }
//
// Frontend:
//
// {
//     id,
//     name,
//     permission,
//     employees: [
//         {
//             id,
//             employeeContextId,
//             name,
//             enabled
//         }
//     ]
// }
//
// =========================================================

const normalizeLoanAssignment = (
    loan
) => {

    if (
        !loan
    ) {

        return null
    }


    const agents =
        Array.isArray(
            loan.agents
        )
            ? loan.agents
            : []


    return {
        ...loan,

        id:
            Number(
                loan.id
            ),

        name:
            loan.name ??
            '',

        permission:
            loan.permission ??
            null,

        employees:
            agents
                .map(
                    (agent) => ({
                        id:
                            Number(
                                agent.employee_id
                            ),

                        employeeContextId:
                            Number(
                                agent.employee_context_id
                            ),

                        name:
                            agent.name ??
                            'N/A',

                        enabled:
                            Boolean(
                                agent.assigned
                            ),
                    })
                )
                .filter(
                    (employee) =>
                        Number.isFinite(
                            employee.id
                        ) &&
                        Number.isFinite(
                            employee.employeeContextId
                        )
                ),
    }
}


// =========================================================
// GET LOAN ASSIGNMENTS
// =========================================================
//
// Backend:
//
// GET /loans-assignment
//
// Optional:
//
// ?context_id=1
//
// Backend flow:
//
//     current user
//          ↓
//     selected context
//          ↓
//     visible agents
//          ↓
//     loan permission
//          ↓
//     eligible agents
//          ↓
//     loan assignment status
//          ↓
//     frontend
//
// =========================================================

export const getLoanAssignments = async (
    {
        contextId = null,
    } = {}
) => {

    const params = {}


    // =====================================================
    // CONTEXT
    // =====================================================

    if (
        contextId !== '' &&
        contextId !== null &&
        contextId !== undefined
    ) {

        params.context_id =
            Number(
                contextId
            )
    }


    // =====================================================
    // REQUEST
    // =====================================================

    const response =
        await apiClient.get(
            '/loans-assignment',
            {
                params,
            }
        )


    // =====================================================
    // RESPONSE
    // =====================================================

    const responseData =
        Array.isArray(
            response?.data
        )
            ? response.data
            : []


    return responseData
        .map(
            normalizeLoanAssignment
        )
        .filter(Boolean)
}


// =========================================================
// TOGGLE EMPLOYEE LOAN ASSIGNMENT
// =========================================================
//
// Backend:
//
// PUT
// /loans-assignment/{employee_context_id}/{loan_type_id}
//
// Payload:
//
// {
//     status: "active"
// }
//
// OR:
//
// {
//     status: "inactive"
// }
//
// Optional:
//
// ?context_id=1
//
// =========================================================

export const toggleLoanAssignment = async ({
    employeeContextId,
    loanTypeId,
    enabled,
    contextId = null,
}) => {

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        employeeContextId === '' ||
        employeeContextId === null ||
        employeeContextId === undefined
    ) {

        throw new Error(
            'Employee context is required.'
        )
    }


    if (
        loanTypeId === '' ||
        loanTypeId === null ||
        loanTypeId === undefined
    ) {

        throw new Error(
            'Loan type is required.'
        )
    }


    // =====================================================
    // STATUS
    // =====================================================
    //
    // Frontend:
    //
    // enabled = true
    //      ↓
    // active
    //
    // enabled = false
    //      ↓
    // inactive
    //
    // =====================================================

    const status =
        enabled
            ? 'active'
            : 'inactive'


    // =====================================================
    // PARAMS
    // =====================================================

    const params = {}


    if (
        contextId !== '' &&
        contextId !== null &&
        contextId !== undefined
    ) {

        params.context_id =
            Number(
                contextId
            )
    }


    // =====================================================
    // REQUEST
    // =====================================================

    const response =
        await apiClient.put(
            `/loans-assignment/${Number(employeeContextId)}/${Number(loanTypeId)}`,
            {
                status,
            },
            {
                params,
            }
        )


    // =====================================================
    // RESPONSE
    // =====================================================

    const data =
        response?.data


    return {
        id:
            Number(
                data?.id
            ),

        employeeContextId:
            Number(
                data?.employee_context_id
            ),

        loanTypeId:
            Number(
                data?.loan_type_id
            ),

        status:
            data?.status ??
            status,

        enabled:
            Boolean(
                data?.assigned ??
                (status === 'active')
            ),
    }
}


// =========================================================
// TOGGLE MULTIPLE EMPLOYEES FOR ONE LOAN
// =========================================================
//
// The backend endpoint changes ONE
// employee_context_id + loan_type_id at a time.
//
// Therefore when the user toggles the entire loan:
//
//     Personal
//       ├── Agent A
//       ├── Agent B
//       └── Agent C
//
// the frontend calls the same backend endpoint for each
// eligible agent.
//
// =========================================================

export const toggleLoanForEmployees = async ({
    loanTypeId,
    employees = [],
    enabled,
    contextId = null,
}) => {

    if (
        loanTypeId === '' ||
        loanTypeId === null ||
        loanTypeId === undefined
    ) {

        throw new Error(
            'Loan type is required.'
        )
    }


    if (
        !Array.isArray(
            employees
        ) ||
        employees.length === 0
    ) {

        return []
    }


    const results = []


    // =====================================================
    // UPDATE EACH EMPLOYEE
    // =====================================================

    for (
        const employee
        of employees
    ) {

        if (
            employee?.employeeContextId ===
            undefined ||
            employee?.employeeContextId ===
            null
        ) {

            continue
        }


        const result =
            await toggleLoanAssignment({
                employeeContextId:
                    employee.employeeContextId,

                loanTypeId,

                enabled,

                contextId,
            })


        results.push(
            result
        )
    }


    return results
}