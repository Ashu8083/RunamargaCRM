// admin-react/src/pages/Loans/ViewApplication/components/BankProcessingSection/Api.js

import apiClient from '../../../../../app/apiClient'

export const assignBank = async (
    applicationId,
    data
) => {
    const response = await apiClient.post(
        `/applications/${applicationId}/bank-processing`,
        data
    )

    return response.data
}

export const getDefaultDSA = async (
    applicationId,
    bankId
) => {
    const response = await apiClient.get(
        `/applications/${applicationId}/bank-processing/default-dsa/${bankId}`
    )

    return response.data
}


export const getBankProcessing = async (applicationId) => {
    const response = await apiClient.get(
        `/applications/${applicationId}/bank-processing`
    )

    return response.data
}

export const updateBankProcessingWorkflow = async (
    applicationId,
    processingId,
    data
) => {
    const response = await apiClient.patch(
        `/applications/${applicationId}/bank-processing/${processingId}/workflow`,
        data
    )

    return response.data
}

export const deleteApplicationBankProcessing = async (
    applicationId,
    processingId
) => {
    const response = await apiClient.delete(
        `/applications/${applicationId}/bank-processing/${processingId}`
    )

    return response.data
}

export const getBanks = async () => {
    const response = await apiClient.get('/common/banks')
    return response.data
}