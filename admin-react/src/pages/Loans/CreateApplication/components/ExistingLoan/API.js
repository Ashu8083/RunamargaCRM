import apiClient from '../../../../../app/apiClient'

export const submitExistingLoan = async (data) => {
    if (!data?.loan_application_id) {
        throw new Error(
            'Existing application ID is required.'
        )
    }

    try {
        const response = await apiClient.post(
            '/duplicate-approvals',
            data
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
            'Unable to submit approval request.'
        )
    }
}