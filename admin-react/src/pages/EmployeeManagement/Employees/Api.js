// admin-react/src/pages/EmployeeManagement/Employees/Api.js
import apiClient from '../../../app/apiClient'

export const EmpAPI = {

    getAll: () =>
        apiClient.get('/employees'),

    getOptions: () =>
        Promise.all([
            apiClient.get('/employees/roles'),
            apiClient.get('/employees/permissions'),
        ]),

    create: (data) =>
        apiClient.post('/employees', data),

    update: (id, data) =>
        apiClient.put(`/employees/${id}`, data),

    delete: (id) =>
        apiClient.delete(`/employees/${id}`),

    setBlocked: (id, blocked) =>
        apiClient.patch(
            `/employees/${id}/block`,
            null,
            {
                params: { blocked },
            }
        ),
}