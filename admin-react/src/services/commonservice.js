import apiClient from "../../src/app/apiClient";

export const getPermissions = async () => {
    const response = await apiClient.get("/common/permissions");

    return response.data;
};
export const getRoles = async () => {
    const response = await apiClient.get("/common/roles");

    return response.data;
};

export const getLoanTypes = async () => {
    const response = await apiClient.get("/common/loan-types");

    return response.data;
};

export const getEmployeesByContext = async (contextId) => {
    const response = await apiClient.get("/common/employees", {
        params: {
            context_id: contextId,
        },
    });

    return response.data;
};
export const getRelationshipManagers = async (contextId) => {
    const response = await apiClient.get(
        '/common/relationship-managers',
        {
            params: {
                context_id: contextId,
            },
        }
    )

    return response.data
}