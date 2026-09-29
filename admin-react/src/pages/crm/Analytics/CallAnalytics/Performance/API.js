// admin-react/src/pages/Analytics/CallAnalytics/Performance/API.js

import apiClient from "../../../../../app/apiClient";


// =============================================================
// GET PERFORMANCE
// =============================================================

const getPerformance = async ({
    employeeId = null,
    fromDate = null,
    toDate = null,
    callType = null,
    status = null,
    contextId = null,
} = {}) => {

    const params = {};


    // =========================================================
    // EMPLOYEE
    // =========================================================

    if (
        employeeId !== null &&
        employeeId !== undefined &&
        employeeId !== ""
    ) {
        params.employee_id = Number(employeeId);
    }


    // =========================================================
    // DATE
    // =========================================================

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }


    // =========================================================
    // CALL TYPE
    // =========================================================

    if (callType) {
        params.call_type = callType;
    }


    // =========================================================
    // STATUS
    // =========================================================

    if (status) {
        params.status = status;
    }


    // =========================================================
    // CONTEXT
    // =========================================================

    if (
        contextId !== null &&
        contextId !== undefined &&
        contextId !== ""
    ) {
        params.context_id = Number(contextId);
    }


    // =========================================================
    // REQUEST
    // =========================================================

    const response = await apiClient.get(
        "/call-analytics/performance",
        {
            params,
        }
    );


    const data = response?.data || {};


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary = {
        totalAgents: Number(
            data?.summary?.totalAgents || 0
        ),

        totalAssignments: Number(
            data?.summary?.totalAssignments || 0
        ),

        totalCalls: Number(
            data?.summary?.totalCalls || 0
        ),

        totalIncoming: Number(
            data?.summary?.totalIncoming || 0
        ),

        totalOutgoing: Number(
            data?.summary?.totalOutgoing || 0
        ),

        totalAnswered: Number(
            data?.summary?.totalAnswered || 0
        ),

        totalMissed: Number(
            data?.summary?.totalMissed || 0
        ),

        totalApplications: Number(
            data?.summary?.totalApplications || 0
        ),

        totalConverted: Number(
            data?.summary?.totalConverted || 0
        ),

        avgTalkSeconds: Number(
            data?.summary?.avgTalkSeconds || 0
        ),
    };


    // =========================================================
    // AGENTS
    // =========================================================

    const agents = Array.isArray(data?.agents)
        ? data.agents.map((agent) => ({

            id: Number(
                agent?.id
            ),

            name:
                agent?.name ||
                "",


            // -------------------------------------------------
            // TEAM
            // -------------------------------------------------

            teamId:
                agent?.teamId !== null &&
                agent?.teamId !== undefined
                    ? Number(agent.teamId)
                    : null,

            team:
                agent?.team ||
                null,


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            rmId:
                agent?.rmId !== null &&
                agent?.rmId !== undefined
                    ? Number(agent.rmId)
                    : null,

            rmName:
                agent?.rmName ||
                null,


            // -------------------------------------------------
            // CALL METRICS
            // -------------------------------------------------

            incoming: Number(
                agent?.incoming || 0
            ),

            outgoing: Number(
                agent?.outgoing || 0
            ),

            answered: Number(
                agent?.answered || 0
            ),

            missed: Number(
                agent?.missed || 0
            ),


            // -------------------------------------------------
            // APPLICATIONS / CONVERSIONS
            // -------------------------------------------------

            applications: Number(
                agent?.applications || 0
            ),

            converted: Number(
                agent?.converted || 0
            ),


            // -------------------------------------------------
            // ASSIGNMENTS
            // -------------------------------------------------

            assignments: Number(
                agent?.assignments || 0
            ),

            callsHandled: Number(
                agent?.callsHandled || 0
            ),

            totalCalls: Number(
                agent?.totalCalls || 0
            ),


            // -------------------------------------------------
            // TALK TIME
            // -------------------------------------------------

            avgTalkSeconds: Number(
                agent?.avgTalkSeconds || 0
            ),


            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            status:
                agent?.status ||
                "active",

        }))
        : [];


    // =========================================================
    // RETURN
    // =========================================================

    return {
        summary,
        agents,
    };
};


// =============================================================
// EXPORT
// =============================================================

export default {
    getPerformance,
};