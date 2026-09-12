import apiClient from '../../../app/apiClient'


export const getDuplicateApprovals = async (params = {}) => {
    try {
        const response = await apiClient.get(
            '/duplicate-approvals',
            {
                params,
            }
        )

        return response.data
    } catch (error) {
        const detail =
            error.response?.data?.detail

        let message =
            error.response?.data?.message

        if (Array.isArray(detail)) {
            message = detail
                .map(
                    (item) =>
                        item?.msg ||
                        'Validation error'
                )
                .join(', ')
        } else if (typeof detail === 'string') {
            message = detail
        }

        throw new Error(
            message ||
            'Unable to load duplicate approvals.'
        )
    }
}


export const submitDuplicateApprovalAction = async (
    id,
    action,
    rejectedRemarks = null
) => {
    try {
        const response = await apiClient.patch(
            `/duplicate-approvals/${id}/${action}`,
            {
                rejected_remarks: rejectedRemarks,
            }
        )

        return response.data
    } catch (error) {
        const detail =
            error.response?.data?.detail

        let message =
            error.response?.data?.message

        if (Array.isArray(detail)) {
            message = detail
                .map(
                    (item) =>
                        item?.msg ||
                        'Validation error'
                )
                .join(', ')
        } else if (typeof detail === 'string') {
            message = detail
        }

        throw new Error(
            message ||
            'Unable to update duplicate approval.'
        )
    }
}
export const approveDuplicateApproval = async (id) => {
    try {
        const response = await apiClient.patch(
            `/duplicate-approvals/${id}/approve`
        )

        return response.data
    } catch (error) {

        const detail =
            error.response?.data?.detail

        let message =
            error.response?.data?.message

        if (Array.isArray(detail)) {

            message = detail
                .map(
                    (item) =>
                        item?.msg ||
                        'Validation error'
                )
                .join(', ')

        } else if (typeof detail === 'string') {

            message = detail

        }

        throw new Error(
            message ||
            'Unable to approve duplicate application.'
        )
    }
}