// admin-react/src/pages/Dashboard/components/MonthlyTrend/API.js

const MONTHLY_DATA = [
    {
        month: "April",
        shortMonth: "Apr",
        statuses: {
            "In Process": { count: 96, amount: 61000000 },
            Login: { count: 72, amount: 47000000 },
            Sanctioned: { count: 34, amount: 23000000 },
            Disbursed: { count: 28, amount: 18000000 },
            Rejected: { count: 54, amount: 33000000 },
        },
    },
    {
        month: "May",
        shortMonth: "May",
        statuses: {
            "In Process": { count: 108, amount: 69000000 },
            Login: { count: 84, amount: 55000000 },
            Sanctioned: { count: 39, amount: 27000000 },
            Disbursed: { count: 31, amount: 21000000 },
            Rejected: { count: 64, amount: 42000000 },
        },
    },
    {
        month: "June",
        shortMonth: "Jun",
        statuses: {
            "In Process": { count: 117, amount: 76000000 },
            Login: { count: 91, amount: 61000000 },
            Sanctioned: { count: 45, amount: 31000000 },
            Disbursed: { count: 35, amount: 24000000 },
            Rejected: { count: 70, amount: 46000000 },
        },
    },
    {
        month: "July",
        shortMonth: "Jul",
        statuses: {
            "In Process": { count: 128, amount: 83000000 },
            Login: { count: 98, amount: 66000000 },
            Sanctioned: { count: 49, amount: 35000000 },
            Disbursed: { count: 38, amount: 28000000 },
            Rejected: { count: 78, amount: 52000000 },
        },
    },
    {
        month: "August",
        shortMonth: "Aug",
        statuses: {
            "In Process": { count: 139, amount: 91000000 },
            Login: { count: 107, amount: 72000000 },
            Sanctioned: { count: 54, amount: 39000000 },
            Disbursed: { count: 42, amount: 31000000 },
            Rejected: { count: 86, amount: 58000000 },
        },
    },
    {
        month: "September",
        shortMonth: "Sep",
        statuses: {
            "In Process": { count: 151, amount: 99000000 },
            Login: { count: 116, amount: 78000000 },
            Sanctioned: { count: 59, amount: 43000000 },
            Disbursed: { count: 46, amount: 34000000 },
            Rejected: { count: 90, amount: 64000000 },
        },
    },
    {
        month: "October",
        shortMonth: "Oct",
        statuses: {
            "In Process": { count: 163, amount: 108000000 },
            Login: { count: 124, amount: 84000000 },
            Sanctioned: { count: 64, amount: 47000000 },
            Disbursed: { count: 51, amount: 38000000 },
            Rejected: { count: 95, amount: 69000000 },
        },
    },
    {
        month: "November",
        shortMonth: "Nov",
        statuses: {
            "In Process": { count: 174, amount: 116000000 },
            Login: { count: 132, amount: 89000000 },
            Sanctioned: { count: 69, amount: 51000000 },
            Disbursed: { count: 55, amount: 41000000 },
            Rejected: { count: 101, amount: 73000000 },
        },
    },
    {
        month: "December",
        shortMonth: "Dec",
        statuses: {
            "In Process": { count: 186, amount: 124000000 },
            Login: { count: 141, amount: 96000000 },
            Sanctioned: { count: 74, amount: 55000000 },
            Disbursed: { count: 59, amount: 44000000 },
            Rejected: { count: 108, amount: 80000000 },
        },
    },
    {
        month: "January",
        shortMonth: "Jan",
        statuses: {
            "In Process": { count: 197, amount: 132000000 },
            Login: { count: 149, amount: 102000000 },
            Sanctioned: { count: 79, amount: 59000000 },
            Disbursed: { count: 63, amount: 47000000 },
            Rejected: { count: 114, amount: 84000000 },
        },
    },
    {
        month: "February",
        shortMonth: "Feb",
        statuses: {
            "In Process": { count: 209, amount: 141000000 },
            Login: { count: 158, amount: 109000000 },
            Sanctioned: { count: 84, amount: 63000000 },
            Disbursed: { count: 67, amount: 50000000 },
            Rejected: { count: 123, amount: 89000000 },
        },
    },
    {
        month: "March",
        shortMonth: "Mar",
        statuses: {
            "In Process": { count: 223, amount: 151000000 },
            Login: { count: 168, amount: 117000000 },
            Sanctioned: { count: 91, amount: 69000000 },
            Disbursed: { count: 72, amount: 54000000 },
            Rejected: { count: 130, amount: 95000000 },
        },
    },
];

const STATUS_OPTIONS = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
    "Rejected",
];

const PERIOD_MONTHS = {
    3: 3,
    6: 6,
    12: 12,
};

const getStatusData = (month, status) => {
    return (
        month.statuses[status] || {
            count: 0,
            amount: 0,
        }
    );
};

const getSummary = (data) => {
    return data.reduce(
        (summary, month) => ({
            totalApplications:
                summary.totalApplications +
                (Number(month.count) || 0),
            totalAmount:
                summary.totalAmount +
                (Number(month.amount) || 0),
        }),
        {
            totalApplications: 0,
            totalAmount: 0,
        }
    );
};

export const getMonthlyTrendData = async ({
    status = "In Process",
    period = 3,
} = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const normalizedStatus = STATUS_OPTIONS.includes(status)
        ? status
        : "In Process";

    const monthCount =
        PERIOD_MONTHS[Number(period)] || 3;

    const selectedMonths = MONTHLY_DATA.slice(-monthCount);

    const data = selectedMonths.map((month) => {
        const statusData = getStatusData(
            month,
            normalizedStatus
        );

        return {
            month: month.month,
            shortMonth: month.shortMonth,
            status: normalizedStatus,
            count: Number(statusData.count) || 0,
            amount: Number(statusData.amount) || 0,
        };
    });

    const summary = getSummary(data);

    return {
        data,
        status: normalizedStatus,
        period: monthCount,
        totalApplications: summary.totalApplications,
        totalAmount: summary.totalAmount,
    };
};