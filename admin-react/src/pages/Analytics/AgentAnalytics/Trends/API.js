// admin-react/src/pages/Analytics/AgentAnalytics/Trends/API.js

import apiClient from '../../../../app/apiClient'


// =============================================================
// DEFAULT FILTERS
// =============================================================

const DEFAULT_FILTERS = {
    type: 'agent',

    teamLeadContextId: null,

    agentContextId: null,

    rmContextId: null,

    loanTypeId: null,

    fromDate: null,

    toDate: null,
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
// NUMBER
// =============================================================

const toNullableNumber = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return null
    }

    const number = Number(value)

    return Number.isFinite(number)
        ? number
        : null
}


// =============================================================
// COUNT
// =============================================================

const toCount = (value) => {

    const number = Number(value)

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0
    }

    return Math.floor(number)
}


// =============================================================
// TYPE
// =============================================================

const normalizeType = (value) => {

    return String(value || '')
        .trim()
        .toLowerCase() === 'rm'
        ? 'rm'
        : 'agent'
}


// =============================================================
// DATE
// =============================================================

const normalizeDate = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return null
    }

    return String(value)
}


// =============================================================
// FILTERS
// =============================================================

const normalizeFilters = (
    filters = {},
    fallbackType = 'agent'
) => {

    return {

        type:
            normalizeType(
                filters?.type ??
                fallbackType
            ),


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
            normalizeDate(
                filters?.fromDate ??
                filters?.from_date
            ),


        toDate:
            normalizeDate(
                filters?.toDate ??
                filters?.to_date
            ),

    }
}


// =============================================================
// DAILY TREND
// =============================================================

const normalizeTrendRow = (
    row = {}
) => {

    return {

        date:
            row?.date ??
            null,


        applicationCreated:
            toCount(
                row?.applicationCreated ??
                row?.application_created ??
                0
            ),


        inProcess:
            toCount(
                row?.inProcess ??
                row?.in_process ??
                0
            ),


        login:
            toCount(
                row?.login ??
                0
            ),


        sanctioned:
            toCount(
                row?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                row?.disbursed ??
                0
            ),


        rejected:
            toCount(
                row?.rejected ??
                0
            ),

    }
}


// =============================================================
// LOAN TYPE TREND
// =============================================================

const normalizeLoanTypeTrend = (
    row = {}
) => {

    return {

        loanTypeId:
            toNullableNumber(
                row?.loanTypeId ??
                row?.loan_type_id
            ),


        loanTypeName:
            row?.loanTypeName ??
            row?.loan_type_name ??
            'Unknown',


        applicationCreated:
            toCount(
                row?.applicationCreated ??
                row?.application_created ??
                0
            ),


        inProcess:
            toCount(
                row?.inProcess ??
                row?.in_process ??
                0
            ),


        login:
            toCount(
                row?.login ??
                0
            ),


        sanctioned:
            toCount(
                row?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                row?.disbursed ??
                0
            ),


        rejected:
            toCount(
                row?.rejected ??
                0
            ),

    }
}


// =============================================================
// STAGE DISTRIBUTION
// =============================================================

const normalizeStageDistribution = (
    distribution = {}
) => {

    return {

        // ---------------------------------------------------------
        // Total Leads
        //
        // IMPORTANT:
        // This value comes directly from the backend.
        //
        // Do NOT calculate this from the stage counts.
        // ---------------------------------------------------------

        totalLeads:
            toCount(
                distribution?.totalLeads ??
                distribution?.total_leads ??
                0
            ),


        inProcess:
            toCount(
                distribution?.inProcess ??
                distribution?.in_process ??
                0
            ),


        login:
            toCount(
                distribution?.login ??
                0
            ),


        sanctioned:
            toCount(
                distribution?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                distribution?.disbursed ??
                0
            ),


        rejected:
            toCount(
                distribution?.rejected ??
                0
            ),

    }
}


// =============================================================
// SANCTION / DISBURSEMENT
// =============================================================

const normalizeSanctionDisbursementTrend = (
    row = {}
) => {

    return {

        date:
            row?.date ??
            null,


        sanctioned:
            toCount(
                row?.sanctioned ??
                0
            ),


        disbursed:
            toCount(
                row?.disbursed ??
                0
            ),

    }
}


// =============================================================
// REJECTION
// =============================================================

const normalizeRejectionTrend = (
    row = {}
) => {

    return {

        date:
            row?.date ??
            null,


        rejected:
            toCount(
                row?.rejected ??
                0
            ),

    }
}


// =============================================================
// ID ARRAY
// =============================================================

const normalizeIdArray = (
    value
) => {

    if (!Array.isArray(value)) {
        return []
    }

    return value
        .map(
            (item) =>
                toNullableNumber(item)
        )
        .filter(
            (item) =>
                item !== null
        )
}


// =============================================================
// VISIBILITY
// =============================================================

const normalizeVisibility = (
    visibility = {}
) => {

    return {

        teamLeadContextIds:
            normalizeIdArray(
                visibility?.teamLeadContextIds ??
                visibility?.team_lead_context_ids
            ),


        agentContextIds:
            normalizeIdArray(
                visibility?.agentContextIds ??
                visibility?.agent_context_ids
            ),


        rmContextIds:
            normalizeIdArray(
                visibility?.rmContextIds ??
                visibility?.rm_context_ids
            ),

    }
}


// =============================================================
// BUILD REQUEST PARAMS
// =============================================================

const buildRequestParams = ({
    type = 'agent',

    teamLeadContextId = null,

    agentContextId = null,

    rmContextId = null,

    loanTypeId = null,

    fromDate = null,

    toDate = null,

    contextId = null,

} = {}) => {

    const selectedType =
        normalizeType(type)


    const params = {
        type: selectedType,
    }


    // =========================================================
    // TEAM LEAD
    // =========================================================

    const teamLeadValue =
        toNullableNumber(
            teamLeadContextId
        )

    if (teamLeadValue !== null) {

        params.team_lead_context_id =
            teamLeadValue

    }


    // =========================================================
    // AGENT
    // =========================================================

    if (selectedType === 'agent') {

        const agentValue =
            toNullableNumber(
                agentContextId
            )

        if (agentValue !== null) {

            params.agent_context_id =
                agentValue

        }

    }


    // =========================================================
    // RM
    // =========================================================

    if (selectedType === 'rm') {

        const rmValue =
            toNullableNumber(
                rmContextId
            )

        if (rmValue !== null) {

            params.rm_context_id =
                rmValue

        }

    }


    // =========================================================
    // LOAN TYPE
    // =========================================================

    const loanTypeValue =
        toNullableNumber(
            loanTypeId
        )

    if (loanTypeValue !== null) {

        params.loan_type_id =
            loanTypeValue

    }


    // =========================================================
    // FROM DATE
    // =========================================================

    if (
        fromDate !== null &&
        fromDate !== undefined &&
        fromDate !== ''
    ) {

        params.from_date =
            String(fromDate)

    }


    // =========================================================
    // TO DATE
    // =========================================================

    if (
        toDate !== null &&
        toDate !== undefined &&
        toDate !== ''
    ) {

        params.to_date =
            String(toDate)

    }


    // =========================================================
    // CONTEXT
    // =========================================================

    const contextValue =
        toNullableNumber(
            contextId
        )

    if (contextValue !== null) {

        params.context_id =
            contextValue

    }


    return params
}


// =============================================================
// GET TRENDS
// =============================================================

const getTrends = async ({
    type = 'agent',

    teamLeadContextId = null,

    agentContextId = null,

    rmContextId = null,

    loanTypeId = null,

    fromDate = null,

    toDate = null,

    contextId = null,

} = {}) => {

    // =========================================================
    // BUILD PARAMS
    // =========================================================

    const params =
        buildRequestParams({

            type,

            teamLeadContextId,

            agentContextId,

            rmContextId,

            loanTypeId,

            fromDate,

            toDate,

            contextId,

        })


    // =========================================================
    // DEBUG REQUEST
    // =========================================================

    console.log(
        '[Agent Analytics Trends] Request params:',
        params
    )


    // =========================================================
    // API REQUEST
    // =========================================================

    const response =
        await apiClient.get(
            '/agent-analytics/trends',
            {
                params,
            }
        )


    const responseData =
        response?.data || {}


    // =========================================================
    // RESPONSE TYPE
    // =========================================================

    const responseType =
        normalizeType(
            responseData?.filters?.type ??
            responseData?.type ??
            params.type
        )


    // =========================================================
    // DAILY TREND
    // =========================================================

    const trend =
        Array.isArray(
            responseData?.trend
        )
            ? responseData.trend.map(
                normalizeTrendRow
            )
            : []


    // =========================================================
    // LOAN TYPE TREND
    // =========================================================

    const loanTypeTrend =
        Array.isArray(
            responseData?.loan_type_trend ??
            responseData?.loanTypeTrend
        )
            ? (
                responseData?.loan_type_trend ??
                responseData?.loanTypeTrend
            ).map(
                normalizeLoanTypeTrend
            )
            : []


    // =========================================================
    // STAGE DISTRIBUTION
    // =========================================================

    const stageDistribution =
        normalizeStageDistribution(
            responseData?.stage_distribution ??
            responseData?.stageDistribution
        )


    // =========================================================
    // SANCTION / DISBURSEMENT
    // =========================================================

    const sanctionDisbursementTrend =
        Array.isArray(
            responseData?.sanction_disbursement_trend ??
            responseData?.sanctionDisbursementTrend
        )
            ? (
                responseData?.sanction_disbursement_trend ??
                responseData?.sanctionDisbursementTrend
            ).map(
                normalizeSanctionDisbursementTrend
            )
            : []


    // =========================================================
    // REJECTION
    // =========================================================

    const rejectionTrend =
        Array.isArray(
            responseData?.rejection_trend ??
            responseData?.rejectionTrend
        )
            ? (
                responseData?.rejection_trend ??
                responseData?.rejectionTrend
            ).map(
                normalizeRejectionTrend
            )
            : []


    // =========================================================
    // FILTERS
    // =========================================================

    const filters =
        normalizeFilters(
            responseData?.filters ||
            params,
            responseType
        )


    // =========================================================
    // VISIBILITY
    // =========================================================

    const visibility =
        normalizeVisibility(
            responseData?.visibility ||
            DEFAULT_VISIBILITY
        )


    // =========================================================
    // FINAL RESPONSE
    // =========================================================

    const normalizedResponse = {

        type:
            responseType,


        filters,


        trend,


        loanTypeTrend,


        stageDistribution,


        sanctionDisbursementTrend,


        rejectionTrend,


        visibility,

    }


    // =========================================================
    // DEBUG RESPONSE
    // =========================================================

    console.log(
        '[Agent Analytics Trends] Response:',
        normalizedResponse
    )


    return normalizedResponse
}


// =============================================================
// EXPORT
// =============================================================

export default {
    getTrends,
}