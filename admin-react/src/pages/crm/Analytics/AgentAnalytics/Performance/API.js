// admin-react/src/pages/Analytics/AgentAnalytics/Performance/API.js

import apiClient from '../../../../../app/apiClient'


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
// SAFE NULLABLE NUMBER
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

    const number = Number(value)

    return Number.isFinite(number)
        ? number
        : null

}


// =============================================================
// SAFE COUNT
// =============================================================

const toCount = (
    value
) => {

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
// SAFE AMOUNT
// =============================================================

const toAmount = (
    value
) => {

    const number = Number(value)

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0
    }

    return number

}


// =============================================================
// NORMALIZE TYPE
// =============================================================

const normalizeType = (
    value
) => {

    return String(
        value || ''
    )
        .trim()
        .toLowerCase() === 'rm'
        ? 'rm'
        : 'agent'

}


// =============================================================
// NORMALIZE FILTERS
// =============================================================

const normalizeFilters = (
    filters = {},
    fallbackType = 'agent'
) => {

    return {

        type: normalizeType(
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
// NORMALIZE PERFORMANCE COUNTS
// =============================================================

const normalizeCounts = (
    row = {}
) => {

    return {

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

        disbursedAmount:
            toAmount(
                row?.disbursedAmount ??
                row?.disbursed_amount ??
                0
            ),

    }

}


// =============================================================
// NORMALIZE OVERVIEW ROW
// =============================================================

const normalizeOverviewRow = (
    row = {},
    index = 0
) => {

    return {

        id:
            row?.contextId ??
            row?.context_id ??
            `overview-${index}`,

        contextId:
            toNullableNumber(
                row?.contextId ??
                row?.context_id
            ),

        name:
            row?.name ??
            'Unknown',

        teamLeadContextId:
            toNullableNumber(
                row?.teamLeadContextId ??
                row?.team_lead_context_id
            ),

        teamLeadName:
            row?.teamLeadName ??
            row?.team_lead_name ??
            '-',

        teamId:
            toNullableNumber(
                row?.teamId ??
                row?.team_id
            ),

        teamName:
            row?.teamName ??
            row?.team_name ??
            '-',

        ...normalizeCounts(
            row
        ),

    }

}


// =============================================================
// NORMALIZE OVERVIEW
// =============================================================

const normalizeOverview = (
    overview = []
) => {

    if (
        !Array.isArray(
            overview
        )
    ) {
        return []
    }

    return overview.map(
        normalizeOverviewRow
    )

}


// =============================================================
// NORMALIZE LOAN-WISE ROW
// =============================================================

const normalizeLoanWiseRow = (
    row = {},
    index = 0
) => {

    return {

        id:
            row?.loanTypeId ??
            row?.loan_type_id ??
            `loan-${index}`,

        loanTypeId:
            toNullableNumber(
                row?.loanTypeId ??
                row?.loan_type_id
            ),

        loanTypeName:
            row?.loanTypeName ??
            row?.loan_type_name ??
            'Unknown',

        ...normalizeCounts(
            row
        ),

    }

}


// =============================================================
// NORMALIZE LOAN-WISE PERFORMANCE
// =============================================================

const normalizeLoanWise = (
    loanWise = []
) => {

    if (
        !Array.isArray(
            loanWise
        )
    ) {
        return []
    }

    return loanWise.map(
        normalizeLoanWiseRow
    )

}


// =============================================================
// NORMALIZE TOP PERFORMER
// =============================================================

const normalizeTopPerformer = (
    row = {},
    index = 0
) => {

    return {

        id:
            row?.contextId ??
            row?.context_id ??
            `top-${index}`,

        rank:
            toCount(
                row?.rank ??
                index + 1
            ),

        contextId:
            toNullableNumber(
                row?.contextId ??
                row?.context_id
            ),

        name:
            row?.name ??
            'Unknown',

        teamLeadContextId:
            toNullableNumber(
                row?.teamLeadContextId ??
                row?.team_lead_context_id
            ),

        teamLeadName:
            row?.teamLeadName ??
            row?.team_lead_name ??
            '-',

        teamId:
            toNullableNumber(
                row?.teamId ??
                row?.team_id
            ),

        teamName:
            row?.teamName ??
            row?.team_name ??
            '-',

        ...normalizeCounts(
            row
        ),

    }

}


// =============================================================
// NORMALIZE TOP PERFORMERS
// =============================================================

const normalizeTopPerformers = (
    topPerformers = []
) => {

    if (
        !Array.isArray(
            topPerformers
        )
    ) {
        return []
    }

    return topPerformers.map(
        normalizeTopPerformer
    )

}


// =============================================================
// NORMALIZE TOP PERFORMER LOAN TYPE ROW
// =============================================================

const normalizeTopPerformerLoanTypeRow = (
    row = {},
    index = 0
) => {

    return {

        id:
            row?.contextId ??
            row?.context_id ??
            `loan-performer-${index}`,

        loanTypeId:
            toNullableNumber(
                row?.loanTypeId ??
                row?.loan_type_id
            ),

        loanTypeName:
            row?.loanTypeName ??
            row?.loan_type_name ??
            'Unknown',

        contextId:
            toNullableNumber(
                row?.contextId ??
                row?.context_id
            ),

        name:
            row?.name ??
            'Unknown',

        count:
            toCount(
                row?.count ??
                0
            ),

        disbursedAmount:
            toAmount(
                row?.disbursedAmount ??
                row?.disbursed_amount ??
                0
            ),

    }

}


// =============================================================
// NORMALIZE TOP PERFORMER LOAN TYPE GROUP
// =============================================================

const normalizeTopPerformerLoanTypeGroup = (
    group = {},
    index = 0
) => {

    const rows =
        Array.isArray(
            group?.rows
        )
            ? group.rows.map(
                (
                    row,
                    rowIndex
                ) =>
                    normalizeTopPerformerLoanTypeRow(
                        {
                            ...row,
                            loanTypeId:
                                row?.loanTypeId ??
                                row?.loan_type_id ??
                                group?.loanTypeId ??
                                group?.loan_type_id,
                            loanTypeName:
                                row?.loanTypeName ??
                                row?.loan_type_name ??
                                group?.loanTypeName ??
                                group?.loan_type_name,
                        },
                        rowIndex
                    )
            )
            : []

    return {

        id:
            group?.loanTypeId ??
            group?.loan_type_id ??
            `loan-group-${index}`,

        loanTypeId:
            toNullableNumber(
                group?.loanTypeId ??
                group?.loan_type_id
            ),

        loanTypeName:
            group?.loanTypeName ??
            group?.loan_type_name ??
            'Unknown',

        rows,

    }

}


// =============================================================
// NORMALIZE TOP PERFORMERS BY LOAN TYPE
// =============================================================

const normalizeTopPerformersByLoanType = (
    groups = []
) => {

    if (
        !Array.isArray(
            groups
        )
    ) {
        return []
    }

    return groups.map(
        normalizeTopPerformerLoanTypeGroup
    )

}


// =============================================================
// NORMALIZE VISIBILITY
// =============================================================

const normalizeVisibility = (
    visibility = {}
) => {

    return {

        teamLeadContextIds:
            Array.isArray(
                visibility?.teamLeadContextIds
            )
                ? visibility.teamLeadContextIds
                    .map(
                        toNullableNumber
                    )
                    .filter(
                        (value) =>
                            value !== null
                    )
                : Array.isArray(
                    visibility?.team_lead_context_ids
                )
                    ? visibility.team_lead_context_ids
                        .map(
                            toNullableNumber
                        )
                        .filter(
                            (value) =>
                                value !== null
                        )
                    : [],

        agentContextIds:
            Array.isArray(
                visibility?.agentContextIds
            )
                ? visibility.agentContextIds
                    .map(
                        toNullableNumber
                    )
                    .filter(
                        (value) =>
                            value !== null
                    )
                : Array.isArray(
                    visibility?.agent_context_ids
                )
                    ? visibility.agent_context_ids
                        .map(
                            toNullableNumber
                        )
                        .filter(
                            (value) =>
                                value !== null
                        )
                    : [],

        rmContextIds:
            Array.isArray(
                visibility?.rmContextIds
            )
                ? visibility.rmContextIds
                    .map(
                        toNullableNumber
                    )
                    .filter(
                        (value) =>
                            value !== null
                    )
                : Array.isArray(
                    visibility?.rm_context_ids
                )
                    ? visibility.rm_context_ids
                        .map(
                            toNullableNumber
                        )
                        .filter(
                            (value) =>
                                value !== null
                        )
                    : [],

    }

}


// =============================================================
// GET PERFORMANCE
// =============================================================

const getPerformance = async ({
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
    // TYPE
    // =========================================================

    const selectedType =
        normalizeType(
            type
        )


    // =========================================================
    // REQUEST PARAMS
    // =========================================================

    const params = {
        analytics_type:
            selectedType,
    }


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

    if (
        selectedType === 'agent'
    ) {

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

    }


    // =========================================================
    // RM
    // =========================================================

    if (
        selectedType === 'rm'
    ) {

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

    if (
        fromDate
    ) {
        params.from_date =
            fromDate
    }

    if (
        toDate
    ) {
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
            '/agent-analytics/performance',
            {
                params,
            }
        )


    // =========================================================
    // RESPONSE
    // =========================================================

    const data =
        response?.data || {}


    // =========================================================
    // RESPONSE TYPE
    // =========================================================

    const responseType =
        normalizeType(
            data?.type ??
            data?.filters?.type ??
            selectedType
        )


    // =========================================================
    // NORMALIZED RESPONSE
    // =========================================================

    return {

        type:
            responseType,

        filters:
            normalizeFilters(
                data?.filters,
                responseType
            ),

        overview:
            normalizeOverview(
                data?.overview
            ),

        loanWise:
            normalizeLoanWise(
                data?.loan_wise ??
                data?.loanWise
            ),

        topPerformers:
            normalizeTopPerformers(
                data?.top_performers ??
                data?.topPerformers
            ),

        topPerformersByLoanType:
            normalizeTopPerformersByLoanType(
                data?.top_performers_by_loan_type ??
                data?.topPerformersByLoanType
            ),

        visibility:
            normalizeVisibility(
                data?.visibility
            ),

    }

}


// =============================================================
// EXPORT
// =============================================================

export default {
    getPerformance,
}
