import apiClient from '../../../../../../app/apiClient'


// ============================================================
// HELPERS
// ============================================================

const hasValue = (value) => {
    return (
        value !== '' &&
        value !== null &&
        value !== undefined
    )
}


// ============================================================
// FETCH CALL PERFORMANCE TREND
// ============================================================

async function fetchCallPerformanceTrend({
    view = 'agent',

    teamLeadContextId = '',
    agentContextId = '',
    rmContextId = '',

    fromDate = '',
    toDate = '',

    contextId = '',
} = {}) {

    const params = {
        // Backend expects `type`
        type: view,
    }


    // ----------------------------------------------------------
    // TEAM LEAD
    // ----------------------------------------------------------

    if (hasValue(teamLeadContextId)) {
        params.team_lead_context_id =
            teamLeadContextId
    }


    // ----------------------------------------------------------
    // AGENT
    // ----------------------------------------------------------

    if (
        view === 'agent' &&
        hasValue(agentContextId)
    ) {
        params.agent_context_id =
            agentContextId
    }


    // ----------------------------------------------------------
    // RM
    // ----------------------------------------------------------

    if (
        view === 'rm' &&
        hasValue(rmContextId)
    ) {
        params.rm_context_id =
            rmContextId
    }


    // ----------------------------------------------------------
    // DATE RANGE
    // ----------------------------------------------------------

    if (hasValue(fromDate)) {
        params.from_date = fromDate
    }

    if (hasValue(toDate)) {
        params.to_date = toDate
    }


    // ----------------------------------------------------------
    // ACTIVE CONTEXT
    // ----------------------------------------------------------

    if (hasValue(contextId)) {
        params.context_id = contextId
    }


    // ----------------------------------------------------------
    // API REQUEST
    // ----------------------------------------------------------

    const response = await apiClient.get(
        '/call-analytics/trends/performance',
        {
            params,
        }
    )


    return response.data
}


export default fetchCallPerformanceTrend