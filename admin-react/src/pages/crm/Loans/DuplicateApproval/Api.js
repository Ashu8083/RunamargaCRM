import apiClient from '../../../../app/apiClient'


export const getDuplicateApprovals = async (params = {}) => {
    try {
        const response = await apiClient.get(
            '/duplicate-approvals',
            {
                params: {
                    ...params,
                    context_id: params.contextId
                        ? Number(params.contextId)
                        : undefined,
                },
            }
        )

        return response.data
    } catch (error) {
        console.error(
            'Error fetching duplicate approvals:',
            error
        )

        throw error
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


export const approveDuplicateApproval = async (
    id,
    contextId
) => {
    try {
        const response = await apiClient.patch(
            `/duplicate-approvals/${id}/approve`,
            null,
            {
                params: {
                    context_id: Number(contextId),
                },
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
            'Unable to approve duplicate application.'
        )
    }
}