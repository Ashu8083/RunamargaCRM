// admin-react/src/pages/Dashboard/components/ApplicationStatus/API.js

const APPLICATION_STATUS_DATA = [
    {
        date: "2026-08-01",
        loanType: "Personal Loan",
        status: "In Process",
        count: 420,
        amount: 168000000,
    },
    {
        date: "2026-08-01",
        loanType: "Personal Loan",
        status: "Rejected",
        count: 310,
        amount: 124000000,
    },
    {
        date: "2026-08-01",
        loanType: "Personal Loan",
        status: "Login",
        count: 85,
        amount: 34000000,
    },
    {
        date: "2026-08-01",
        loanType: "Personal Loan",
        status: "Sanctioned",
        count: 12,
        amount: 19200000,
    },
    {
        date: "2026-08-01",
        loanType: "Personal Loan",
        status: "Disbursed",
        count: 18,
        amount: 27000000,
    },

    {
        date: "2026-08-10",
        loanType: "Home Loan",
        status: "In Process",
        count: 560,
        amount: 448000000,
    },
    {
        date: "2026-08-10",
        loanType: "Home Loan",
        status: "Rejected",
        count: 240,
        amount: 192000000,
    },
    {
        date: "2026-08-10",
        loanType: "Home Loan",
        status: "Login",
        count: 120,
        amount: 96000000,
    },
    {
        date: "2026-08-10",
        loanType: "Home Loan",
        status: "Sanctioned",
        count: 28,
        amount: 56000000,
    },
    {
        date: "2026-08-10",
        loanType: "Home Loan",
        status: "Disbursed",
        count: 34,
        amount: 68000000,
    },

    {
        date: "2026-08-15",
        loanType: "Business Loan",
        status: "In Process",
        count: 390,
        amount: 273000000,
    },
    {
        date: "2026-08-15",
        loanType: "Business Loan",
        status: "Rejected",
        count: 285,
        amount: 199500000,
    },
    {
        date: "2026-08-15",
        loanType: "Business Loan",
        status: "Login",
        count: 72,
        amount: 50400000,
    },
    {
        date: "2026-08-15",
        loanType: "Business Loan",
        status: "Sanctioned",
        count: 16,
        amount: 22400000,
    },
    {
        date: "2026-08-15",
        loanType: "Business Loan",
        status: "Disbursed",
        count: 22,
        amount: 30800000,
    },

    {
        date: "2026-08-20",
        loanType: "Personal Loan",
        status: "In Process",
        count: 515,
        amount: 206000000,
    },
    {
        date: "2026-08-20",
        loanType: "Personal Loan",
        status: "Rejected",
        count: 360,
        amount: 144000000,
    },
    {
        date: "2026-08-20",
        loanType: "Personal Loan",
        status: "Login",
        count: 98,
        amount: 39200000,
    },
    {
        date: "2026-08-20",
        loanType: "Personal Loan",
        status: "Sanctioned",
        count: 21,
        amount: 33600000,
    },
    {
        date: "2026-08-20",
        loanType: "Personal Loan",
        status: "Disbursed",
        count: 25,
        amount: 37500000,
    },

    {
        date: "2026-08-25",
        loanType: "Home Loan",
        status: "In Process",
        count: 475,
        amount: 380000000,
    },
    {
        date: "2026-08-25",
        loanType: "Home Loan",
        status: "Rejected",
        count: 315,
        amount: 252000000,
    },
    {
        date: "2026-08-25",
        loanType: "Home Loan",
        status: "Login",
        count: 88,
        amount: 70400000,
    },
    {
        date: "2026-08-25",
        loanType: "Home Loan",
        status: "Sanctioned",
        count: 19,
        amount: 38000000,
    },
    {
        date: "2026-08-25",
        loanType: "Home Loan",
        status: "Disbursed",
        count: 27,
        amount: 54000000,
    },

    {
        date: "2026-08-30",
        loanType: "Business Loan",
        status: "In Process",
        count: 445,
        amount: 311500000,
    },
    {
        date: "2026-08-30",
        loanType: "Business Loan",
        status: "Rejected",
        count: 295,
        amount: 206500000,
    },
    {
        date: "2026-08-30",
        loanType: "Business Loan",
        status: "Login",
        count: 82,
        amount: 57400000,
    },
    {
        date: "2026-08-30",
        loanType: "Business Loan",
        status: "Sanctioned",
        count: 17,
        amount: 23800000,
    },
    {
        date: "2026-08-30",
        loanType: "Business Loan",
        status: "Disbursed",
        count: 24,
        amount: 33600000,
    },
];

/* =============================================================
   API
   ============================================================= */

export const getApplicationStatusData = async ({
    fromDate = "",
    toDate = "",
    loanType = "",
} = {}) => {
    await new Promise((resolve) =>
        setTimeout(resolve, 250)
    );

    const filteredData =
        APPLICATION_STATUS_DATA.filter(
            (item) => {
                const matchesFromDate =
                    !fromDate ||
                    item.date >= fromDate;

                const matchesToDate =
                    !toDate ||
                    item.date <= toDate;

                const matchesLoanType =
                    !loanType ||
                    item.loanType === loanType;

                return (
                    matchesFromDate &&
                    matchesToDate &&
                    matchesLoanType
                );
            }
        );

    const statusMap = new Map();

    filteredData.forEach((item) => {
        const existing =
            statusMap.get(item.status) || {
                status: item.status,
                count: 0,
                amount: 0,
            };

        existing.count += item.count;
        existing.amount += item.amount;

        statusMap.set(
            item.status,
            existing
        );
    });

    const data = Array.from(
        statusMap.values()
    );

    const totalApplications =
        data.reduce(
            (total, item) =>
                total + item.count,
            0
        );

    const pendingStatuses = new Set([
        "In Process",
        "Login",
        "Sanctioned",
    ]);

    const pendingApplications =
        data.reduce(
            (total, item) =>
                pendingStatuses.has(
                    item.status
                )
                    ? total + item.count
                    : total,
            0
        );

    const totalAmount =
        data.reduce(
            (total, item) =>
                total + item.amount,
            0
        );

    return {
        success: true,
        data,
        summary: {
            totalApplications,
            pendingApplications,
            totalAmount,
        },
        filters: {
            fromDate,
            toDate,
            loanType,
        },
    };
};