// admin-react/src/pages/Dashboard/components/LoanTypeDistribution/API.js

const MOCK_APPLICATIONS = [
    {
        applicationDate: "2026-01-03",
        loanType: "Personal Loan",
        loanAmount: 500000,
        status: "In Process",
        loginAmount: 500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-05",
        loanType: "Business Loan",
        loanAmount: 1500000,
        status: "In Process",
        loginAmount: 1500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-08",
        loanType: "Home Loan",
        loanAmount: 4500000,
        status: "In Process",
        loginAmount: 4500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-10",
        loanType: "Car Loan",
        loanAmount: 900000,
        status: "Login",
        loginAmount: 900000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-13",
        loanType: "Personal Loan",
        loanAmount: 750000,
        status: "Rejected",
        loginAmount: 750000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-16",
        loanType: "Gold Loan",
        loanAmount: 300000,
        status: "Sanctioned",
        loginAmount: 300000,
        sanctionedAmount: 290000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-19",
        loanType: "Education Loan",
        loanAmount: 800000,
        status: "In Process",
        loginAmount: 800000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-22",
        loanType: "Loan Against Property",
        loanAmount: 2500000,
        status: "Sanctioned",
        loginAmount: 2500000,
        sanctionedAmount: 2200000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-25",
        loanType: "Business Loan",
        loanAmount: 2000000,
        status: "Disbursed",
        loginAmount: 2000000,
        sanctionedAmount: 1800000,
        disbursedAmount: 1800000,
    },
    {
        applicationDate: "2026-01-28",
        loanType: "Medical Loan",
        loanAmount: 450000,
        status: "Login",
        loginAmount: 450000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-02-02",
        loanType: "Personal Loan",
        loanAmount: 600000,
        status: "Disbursed",
        loginAmount: 600000,
        sanctionedAmount: 550000,
        disbursedAmount: 550000,
    },
    {
        applicationDate: "2026-02-04",
        loanType: "Home Loan",
        loanAmount: 6000000,
        status: "Sanctioned",
        loginAmount: 6000000,
        sanctionedAmount: 5600000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-07",
        loanType: "Car Loan",
        loanAmount: 1200000,
        status: "Disbursed",
        loginAmount: 1200000,
        sanctionedAmount: 1100000,
        disbursedAmount: 1100000,
    },
    {
        applicationDate: "2026-02-10",
        loanType: "Business Loan",
        loanAmount: 1800000,
        status: "In Process",
        loginAmount: 1800000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-12",
        loanType: "Gold Loan",
        loanAmount: 450000,
        status: "Rejected",
        loginAmount: 450000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-15",
        loanType: "Education Loan",
        loanAmount: 950000,
        status: "Sanctioned",
        loginAmount: 950000,
        sanctionedAmount: 850000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-18",
        loanType: "Personal Loan",
        loanAmount: 400000,
        status: "Disbursed",
        loginAmount: 400000,
        sanctionedAmount: 375000,
        disbursedAmount: 375000,
    },
    {
        applicationDate: "2026-02-20",
        loanType: "Travel Loan",
        loanAmount: 350000,
        status: "Login",
        loginAmount: 350000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-23",
        loanType: "Loan Against Property",
        loanAmount: 3200000,
        status: "Disbursed",
        loginAmount: 3200000,
        sanctionedAmount: 2900000,
        disbursedAmount: 2900000,
    },
    {
        applicationDate: "2026-02-26",
        loanType: "Consumer Durable Loan",
        loanAmount: 220000,
        status: "In Process",
        loginAmount: 220000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-03-03",
        loanType: "Personal Loan",
        loanAmount: 900000,
        status: "Disbursed",
        loginAmount: 900000,
        sanctionedAmount: 800000,
        disbursedAmount: 800000,
    },
    {
        applicationDate: "2026-03-05",
        loanType: "Business Loan",
        loanAmount: 2500000,
        status: "Sanctioned",
        loginAmount: 2500000,
        sanctionedAmount: 2200000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-07",
        loanType: "Home Loan",
        loanAmount: 7000000,
        status: "Disbursed",
        loginAmount: 7000000,
        sanctionedAmount: 6500000,
        disbursedAmount: 6500000,
    },
    {
        applicationDate: "2026-03-10",
        loanType: "Car Loan",
        loanAmount: 1500000,
        status: "Login",
        loginAmount: 1500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-12",
        loanType: "Medical Loan",
        loanAmount: 550000,
        status: "Rejected",
        loginAmount: 550000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-15",
        loanType: "Gold Loan",
        loanAmount: 500000,
        status: "Disbursed",
        loginAmount: 500000,
        sanctionedAmount: 480000,
        disbursedAmount: 480000,
    },
    {
        applicationDate: "2026-03-18",
        loanType: "Education Loan",
        loanAmount: 1100000,
        status: "In Process",
        loginAmount: 1100000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-21",
        loanType: "Personal Loan",
        loanAmount: 550000,
        status: "Sanctioned",
        loginAmount: 550000,
        sanctionedAmount: 500000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-24",
        loanType: "Business Loan",
        loanAmount: 3200000,
        status: "Disbursed",
        loginAmount: 3200000,
        sanctionedAmount: 3000000,
        disbursedAmount: 3000000,
    },
    {
        applicationDate: "2026-03-28",
        loanType: "Credit Card",
        loanAmount: 200000,
        status: "Login",
        loginAmount: 200000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-04-02",
        loanType: "Personal Loan",
        loanAmount: 700000,
        status: "Disbursed",
        loginAmount: 700000,
        sanctionedAmount: 650000,
        disbursedAmount: 650000,
    },
    {
        applicationDate: "2026-04-05",
        loanType: "Business Loan",
        loanAmount: 2100000,
        status: "In Process",
        loginAmount: 2100000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-07",
        loanType: "Home Loan",
        loanAmount: 5200000,
        status: "Sanctioned",
        loginAmount: 5200000,
        sanctionedAmount: 4900000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-10",
        loanType: "Car Loan",
        loanAmount: 1000000,
        status: "Disbursed",
        loginAmount: 1000000,
        sanctionedAmount: 950000,
        disbursedAmount: 950000,
    },
    {
        applicationDate: "2026-04-13",
        loanType: "Gold Loan",
        loanAmount: 350000,
        status: "Rejected",
        loginAmount: 350000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-16",
        loanType: "Education Loan",
        loanAmount: 900000,
        status: "Sanctioned",
        loginAmount: 900000,
        sanctionedAmount: 820000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-19",
        loanType: "Loan Against Property",
        loanAmount: 4000000,
        status: "Disbursed",
        loginAmount: 4000000,
        sanctionedAmount: 3700000,
        disbursedAmount: 3700000,
    },
    {
        applicationDate: "2026-04-22",
        loanType: "Medical Loan",
        loanAmount: 600000,
        status: "In Process",
        loginAmount: 600000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-25",
        loanType: "Personal Loan",
        loanAmount: 850000,
        status: "Disbursed",
        loginAmount: 850000,
        sanctionedAmount: 780000,
        disbursedAmount: 780000,
    },
    {
        applicationDate: "2026-04-28",
        loanType: "Travel Loan",
        loanAmount: 400000,
        status: "Login",
        loginAmount: 400000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-05-02",
        loanType: "Business Loan",
        loanAmount: 2800000,
        status: "Disbursed",
        loginAmount: 2800000,
        sanctionedAmount: 2600000,
        disbursedAmount: 2600000,
    },
    {
        applicationDate: "2026-05-05",
        loanType: "Home Loan",
        loanAmount: 6500000,
        status: "In Process",
        loginAmount: 6500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-08",
        loanType: "Personal Loan",
        loanAmount: 450000,
        status: "Sanctioned",
        loginAmount: 450000,
        sanctionedAmount: 420000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-11",
        loanType: "Car Loan",
        loanAmount: 1350000,
        status: "Disbursed",
        loginAmount: 1350000,
        sanctionedAmount: 1250000,
        disbursedAmount: 1250000,
    },
    {
        applicationDate: "2026-05-14",
        loanType: "Gold Loan",
        loanAmount: 280000,
        status: "Login",
        loginAmount: 280000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-17",
        loanType: "Education Loan",
        loanAmount: 1200000,
        status: "Disbursed",
        loginAmount: 1200000,
        sanctionedAmount: 1100000,
        disbursedAmount: 1100000,
    },
    {
        applicationDate: "2026-05-20",
        loanType: "Loan Against Property",
        loanAmount: 3500000,
        status: "Sanctioned",
        loginAmount: 3500000,
        sanctionedAmount: 3200000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-23",
        loanType: "Medical Loan",
        loanAmount: 500000,
        status: "Rejected",
        loginAmount: 500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-26",
        loanType: "Personal Loan",
        loanAmount: 1000000,
        status: "Disbursed",
        loginAmount: 1000000,
        sanctionedAmount: 920000,
        disbursedAmount: 920000,
    },
    {
        applicationDate: "2026-05-29",
        loanType: "Consumer Durable Loan",
        loanAmount: 300000,
        status: "In Process",
        loginAmount: 300000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-06-02",
        loanType: "Business Loan",
        loanAmount: 1900000,
        status: "Disbursed",
        loginAmount: 1900000,
        sanctionedAmount: 1750000,
        disbursedAmount: 1750000,
    },
    {
        applicationDate: "2026-06-05",
        loanType: "Home Loan",
        loanAmount: 5800000,
        status: "Sanctioned",
        loginAmount: 5800000,
        sanctionedAmount: 5400000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-08",
        loanType: "Personal Loan",
        loanAmount: 650000,
        status: "Disbursed",
        loginAmount: 650000,
        sanctionedAmount: 600000,
        disbursedAmount: 600000,
    },
    {
        applicationDate: "2026-06-11",
        loanType: "Car Loan",
        loanAmount: 1100000,
        status: "In Process",
        loginAmount: 1100000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-14",
        loanType: "Gold Loan",
        loanAmount: 400000,
        status: "Disbursed",
        loginAmount: 400000,
        sanctionedAmount: 380000,
        disbursedAmount: 380000,
    },
    {
        applicationDate: "2026-06-17",
        loanType: "Education Loan",
        loanAmount: 1000000,
        status: "Login",
        loginAmount: 1000000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-20",
        loanType: "Loan Against Property",
        loanAmount: 3000000,
        status: "Disbursed",
        loginAmount: 3000000,
        sanctionedAmount: 2800000,
        disbursedAmount: 2800000,
    },
    {
        applicationDate: "2026-06-23",
        loanType: "Business Loan",
        loanAmount: 2200000,
        status: "Rejected",
        loginAmount: 2200000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-26",
        loanType: "Medical Loan",
        loanAmount: 700000,
        status: "Sanctioned",
        loginAmount: 700000,
        sanctionedAmount: 650000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-29",
        loanType: "Personal Loan",
        loanAmount: 800000,
        status: "Disbursed",
        loginAmount: 800000,
        sanctionedAmount: 740000,
        disbursedAmount: 740000,
    },

    {
        applicationDate: "2026-07-02",
        loanType: "Business Loan",
        loanAmount: 2400000,
        status: "Disbursed",
        loginAmount: 2400000,
        sanctionedAmount: 2200000,
        disbursedAmount: 2200000,
    },
    {
        applicationDate: "2026-07-05",
        loanType: "Home Loan",
        loanAmount: 7500000,
        status: "In Process",
        loginAmount: 7500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-08",
        loanType: "Personal Loan",
        loanAmount: 550000,
        status: "Sanctioned",
        loginAmount: 550000,
        sanctionedAmount: 500000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-11",
        loanType: "Car Loan",
        loanAmount: 1250000,
        status: "Disbursed",
        loginAmount: 1250000,
        sanctionedAmount: 1150000,
        disbursedAmount: 1150000,
    },
    {
        applicationDate: "2026-07-14",
        loanType: "Gold Loan",
        loanAmount: 320000,
        status: "Login",
        loginAmount: 320000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-17",
        loanType: "Education Loan",
        loanAmount: 1400000,
        status: "Disbursed",
        loginAmount: 1400000,
        sanctionedAmount: 1300000,
        disbursedAmount: 1300000,
    },
    {
        applicationDate: "2026-07-20",
        loanType: "Loan Against Property",
        loanAmount: 4200000,
        status: "Sanctioned",
        loginAmount: 4200000,
        sanctionedAmount: 3900000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-23",
        loanType: "Medical Loan",
        loanAmount: 650000,
        status: "Rejected",
        loginAmount: 650000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-26",
        loanType: "Personal Loan",
        loanAmount: 950000,
        status: "In Process",
        loginAmount: 950000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-29",
        loanType: "Personal Loan",
        loanAmount: 950000,
        status: "Disbursed",
        loginAmount: 950000,
        sanctionedAmount: 880000,
        disbursedAmount: 880000,
    },

    {
        applicationDate: "2026-08-02",
        loanType: "Business Loan",
        loanAmount: 3000000,
        status: "Disbursed",
        loginAmount: 3000000,
        sanctionedAmount: 2750000,
        disbursedAmount: 2750000,
    },
    {
        applicationDate: "2026-08-05",
        loanType: "Home Loan",
        loanAmount: 6200000,
        status: "Sanctioned",
        loginAmount: 6200000,
        sanctionedAmount: 5800000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-08",
        loanType: "Personal Loan",
        loanAmount: 700000,
        status: "In Process",
        loginAmount: 700000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-10",
        loanType: "Car Loan",
        loanAmount: 1400000,
        status: "Disbursed",
        loginAmount: 1400000,
        sanctionedAmount: 1300000,
        disbursedAmount: 1300000,
    },
    {
        applicationDate: "2026-08-12",
        loanType: "Gold Loan",
        loanAmount: 380000,
        status: "Login",
        loginAmount: 380000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-15",
        loanType: "Education Loan",
        loanAmount: 1300000,
        status: "Disbursed",
        loginAmount: 1300000,
        sanctionedAmount: 1200000,
        disbursedAmount: 1200000,
    },
    {
        applicationDate: "2026-08-18",
        loanType: "Loan Against Property",
        loanAmount: 3800000,
        status: "Sanctioned",
        loginAmount: 3800000,
        sanctionedAmount: 3500000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-21",
        loanType: "Medical Loan",
        loanAmount: 750000,
        status: "Rejected",
        loginAmount: 750000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-24",
        loanType: "Business Loan",
        loanAmount: 2600000,
        status: "Disbursed",
        loginAmount: 2600000,
        sanctionedAmount: 2400000,
        disbursedAmount: 2400000,
    },
    {
        applicationDate: "2026-08-28",
        loanType: "Personal Loan",
        loanAmount: 850000,
        status: "In Process",
        loginAmount: 850000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
];

const STATUS_OPTIONS = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
    "Rejected",
];

const getDateValue = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? null
        : date;
};

const isDateInRange = (
    applicationDate,
    fromDate,
    toDate
) => {
    const application =
        getDateValue(applicationDate);

    const from = getDateValue(fromDate);
    const to = getDateValue(toDate);

    if (!application) {
        return false;
    }

    if (from && application < from) {
        return false;
    }

    if (to && application > to) {
        return false;
    }

    return true;
};

const getStatusAmount = (
    application,
    status
) => {
    switch (status) {
        case "In Process":
            return application.loanAmount;

        case "Login":
            return application.loginAmount;

        case "Sanctioned":
            return application.sanctionedAmount;

        case "Disbursed":
            return application.disbursedAmount;

        case "Rejected":
            return application.loginAmount;

        default:
            return 0;
    }
};

const getChartData = (
    applications,
    status
) => {
    const groupedData = new Map();

    applications.forEach((application) => {
        if (application.status !== status) {
            return;
        }

        const existing =
            groupedData.get(
                application.loanType
            ) || {
                loanType: application.loanType,
                count: 0,
                amount: 0,
            };

        existing.count += 1;

        existing.amount += getStatusAmount(
            application,
            status
        );

        groupedData.set(
            application.loanType,
            existing
        );
    });

    return Array.from(
        groupedData.values()
    ).sort(
        (a, b) => b.count - a.count
    );
};

const getSummary = (
    applications,
    status
) => {
    const selectedApplications =
        applications.filter(
            (application) =>
                application.status === status
        );

    return {
        totalApplications:
            selectedApplications.length,

        totalAmount:
            selectedApplications.reduce(
                (total, application) =>
                    total +
                    getStatusAmount(
                        application,
                        status
                    ),
                0
            ),
    };
};

export const getLoanTypeDistributionData =
    async ({
        fromDate = "",
        toDate = "",
        status = "In Process",
    } = {}) => {
        await new Promise((resolve) =>
            setTimeout(resolve, 250)
        );

        const normalizedStatus =
            STATUS_OPTIONS.includes(status)
                ? status
                : "In Process";

        const filteredApplications =
            MOCK_APPLICATIONS.filter(
                (application) =>
                    isDateInRange(
                        application.applicationDate,
                        fromDate,
                        toDate
                    )
            );

        const data = getChartData(
            filteredApplications,
            normalizedStatus
        );

        const summary = getSummary(
            filteredApplications,
            normalizedStatus
        );

        return {
            data,

            totalApplications:
                summary.totalApplications,

            totalAmount:
                summary.totalAmount,

            status: normalizedStatus,

            dateRange: {
                fromDate: fromDate || null,
                toDate: toDate || null,
            },
        };
    };