// admin-react/src/pages/Analytics/AgentAnalytics/Overview/API.js

import apiClient from '../../../../app/apiClient'


// =============================================================
// DEFAULT COUNTS
// =============================================================

const DEFAULT_COUNTS = {
    totalLeads: 0,
    inProcess: 0,
    login: 0,
    sanctioned: 0,
    disbursed: 0,
    rejected: 0,
}


// =============================================================
// DEFAULT PIPELINE
// =============================================================

const DEFAULT_PIPELINE = {
    totalLeads: 0,
    inProcess: 0,
    login: 0,
    sanctioned: 0,
    disbursed: 0,
    rejected: 0,
}


// =============================================================
// DEFAULT VISIBILITY
// =============================================================

const DEFAULT_VISIBILITY = {
    teamLeadContextIds: [],
    agentContextIds: [],
    rmContextIds: [],
}


// =============================================================
// DEFAULT FILTERS
// =============================================================

const DEFAULT_FILTERS = {
    teamLeadContextId: null,
    agentContextId: null,
    rmContextId: null,
    loanTypeId: null,
    fromDate: null,
    toDate: null,
}


// =============================================================
// SAFE NUMBER
// =============================================================

const toNullableNumber = (
    value
) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return null
    }


    const number =
        Number(value)


    return Number.isFinite(
        number
    )
        ? number
        : null

}


// =============================================================
// SAFE COUNT
// =============================================================

const toCount = (
    value
) => {

    const number =
        Number(value)


    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0
    }


    return Math.floor(
        number
    )

}


// =============================================================
// NORMALIZE COUNTS
// =============================================================

const normalizeCounts = (
    counts = {}
) => {

    return {

        totalLeads:
            toCount(
                counts?.totalLeads ??
                counts?.total_leads ??
                0
            ),


        inProcess:
            toCount(
                counts?.inProcess ??
                counts?.in_process ??
                0
            ),


        login:
            toCount(
                counts?.login ??
                0
            ),


        sanctioned:
            toCount(
                counts?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                counts?.disbursed ??
                0
            ),


        rejected:
            toCount(
                counts?.rejected ??
                0
            ),

    }

}


// =============================================================
// NORMALIZE PIPELINE
// =============================================================

const normalizePipeline = (
    pipeline = {}
) => {

    return {

        totalLeads:
            toCount(
                pipeline?.totalLeads ??
                pipeline?.total_leads ??
                0
            ),


        inProcess:
            toCount(
                pipeline?.inProcess ??
                pipeline?.in_process ??
                0
            ),


        login:
            toCount(
                pipeline?.login ??
                0
            ),


        sanctioned:
            toCount(
                pipeline?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                pipeline?.disbursed ??
                0
            ),


        rejected:
            toCount(
                pipeline?.rejected ??
                0
            ),

    }

}


// =============================================================
// NORMALIZE VISIBILITY
// =============================================================

const normalizeVisibility = (
    visibility = {}
) => {

    const teamLeadIds =
        Array.isArray(
            visibility?.teamLeadContextIds
        )
            ? visibility.teamLeadContextIds
            : (
                Array.isArray(
                    visibility?.team_lead_context_ids
                )
                    ? visibility.team_lead_context_ids
                    : []
            )


    const agentIds =
        Array.isArray(
            visibility?.agentContextIds
        )
            ? visibility.agentContextIds
            : (
                Array.isArray(
                    visibility?.agent_context_ids
                )
                    ? visibility.agent_context_ids
                    : []
            )


    const rmIds =
        Array.isArray(
            visibility?.rmContextIds
        )
            ? visibility.rmContextIds
            : (
                Array.isArray(
                    visibility?.rm_context_ids
                )
                    ? visibility.rm_context_ids
                    : []
            )


    return {

        teamLeadContextIds:
            teamLeadIds
                .map(Number)
                .filter(
                    Number.isFinite
                ),


        agentContextIds:
            agentIds
                .map(Number)
                .filter(
                    Number.isFinite
                ),


        rmContextIds:
            rmIds
                .map(Number)
                .filter(
                    Number.isFinite
                ),

    }

}


// =============================================================
// NORMALIZE FILTERS
// =============================================================

const normalizeFilters = (
    filters = {}
) => {

    return {

        teamLeadContextId:
            toNullableNumber(
                filters?.teamLeadContextId ??
                filters?.team_lead_context_id
            ),


        agentContextId:
            toNullableNumber(
                filters?.agentContextId ??
                filters?.agent_context_id
            ),


        rmContextId:
            toNullableNumber(
                filters?.rmContextId ??
                filters?.rm_context_id
            ),


        loanTypeId:
            toNullableNumber(
                filters?.loanTypeId ??
                filters?.loan_type_id
            ),


        fromDate:
            filters?.fromDate ??
            filters?.from_date ??
            null,


        toDate:
            filters?.toDate ??
            filters?.to_date ??
            null,

    }

}


// =============================================================
// GET AGENT ANALYTICS OVERVIEW
// =============================================================

const getOverview = async ({
    teamLeadContextId = null,
    agentContextId = null,
    rmContextId = null,
    loanTypeId = null,
    fromDate = null,
    toDate = null,
    contextId = null,
} = {}) => {

    const params = {}


    // =========================================================
    // TEAM LEAD
    // =========================================================

    const teamLeadValue =
        toNullableNumber(
            teamLeadContextId
        )


    if (
        teamLeadValue !== null
    ) {

        params.team_lead_context_id =
            teamLeadValue

    }


    // =========================================================
    // AGENT
    // =========================================================

    const agentValue =
        toNullableNumber(
            agentContextId
        )


    if (
        agentValue !== null
    ) {

        params.agent_context_id =
            agentValue

    }


    // =========================================================
    // RM
    // =========================================================

    const rmValue =
        toNullableNumber(
            rmContextId
        )


    if (
        rmValue !== null
    ) {

        params.rm_context_id =
            rmValue

    }


    // =========================================================
    // LOAN TYPE
    // =========================================================

    const loanTypeValue =
        toNullableNumber(
            loanTypeId
        )


    if (
        loanTypeValue !== null
    ) {

        params.loan_type_id =
            loanTypeValue

    }


    // =========================================================
    // DATE RANGE
    // =========================================================

    if (fromDate) {

        params.from_date =
            fromDate

    }


    if (toDate) {

        params.to_date =
            toDate

    }


    // =========================================================
    // CONTEXT
    // =========================================================

    const contextValue =
        toNullableNumber(
            contextId
        )


    if (
        contextValue !== null
    ) {

        params.context_id =
            contextValue

    }


    // =========================================================
    // REQUEST
    // =========================================================

    const response =
        await apiClient.get(
            '/agent-analytics/overview',
            {
                params,
            }
        )


    // =========================================================
    // RESPONSE
    // =========================================================

    const responseData =
        response?.data || {}


    // =========================================================
    // PIPELINE INSIGHTS COUNTS
    // =========================================================

    const counts =
        normalizeCounts(
            responseData?.counts
        )


    // =========================================================
    // APPLICATION PIPELINE COUNTS
    // =========================================================

    const pipeline =
        normalizePipeline(
            responseData?.pipeline
        )


    // =========================================================
    // FILTERS
    // =========================================================

    const filters =
        normalizeFilters(
            responseData?.filters
        )


    // =========================================================
    // VISIBILITY
    // =========================================================

    const visibility =
        normalizeVisibility(
            responseData?.visibility
        )


    // =========================================================
    // FINAL RESULT
    // =========================================================

    return {

        counts,

        pipeline,

        filters,

        visibility,

    }

}


// =============================================================
// EXPORT
// =============================================================

export default {

    getOverview,

}