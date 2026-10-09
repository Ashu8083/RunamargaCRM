// admin-react/src/pages/crm/Analytics/CallAnalytics/Trends/api/TeamCallTrend.js

import apiClient from '../../../../../../app/apiClient'


const hasValue = (value) => (
    value !== '' &&
    value !== null &&
    value !== undefined
)


export const fetchTeamLeadCallPerformance = async ({
    teamLeadContextId = '',
    agentContextId = '',
    rmContextId = '',
    fromDate = '',
    toDate = '',
    contextId = '',
} = {}) => {

    const params = {}

    if (hasValue(teamLeadContextId)) {
        params.team_lead_context_id =
            teamLeadContextId
    }

    if (hasValue(agentContextId)) {
        params.agent_context_id =
            agentContextId
    }

    if (hasValue(rmContextId)) {
        params.rm_context_id =
            rmContextId
    }

    if (hasValue(fromDate)) {
        params.from_date = fromDate
    }

    if (hasValue(toDate)) {
        params.to_date = toDate
    }

    if (hasValue(contextId)) {
        params.context_id = contextId
    }

    const response = await apiClient.get(
        '/call-analytics/team-lead-performance',
        {
            params,
        }
    )

    return response.data
}