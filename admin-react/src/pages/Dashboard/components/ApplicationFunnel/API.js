// admin-react/src/pages/Dashboard/components/ApplicationFunnel/API.js

const APPLICATIONS = [
    {
        applicationDate: "2026-01-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 500000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-05",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 2500000,
        loginAmount: 2500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-08",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 1800000,
        loginAmount: 1800000,
        sanctionedAmount: 1650000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-10",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 700000,
        loginAmount: 700000,
        sanctionedAmount: 650000,
        disbursedAmount: 620000,
    },
    {
        applicationDate: "2026-01-12",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 900000,
        loginAmount: 900000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-15",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 350000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-18",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3200000,
        loginAmount: 3200000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-21",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2200000,
        loginAmount: 2200000,
        sanctionedAmount: 2000000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-01-24",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 450000,
        loginAmount: 450000,
        sanctionedAmount: 420000,
        disbursedAmount: 400000,
    },
    {
        applicationDate: "2026-01-27",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1200000,
        loginAmount: 1200000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-02-02",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 600000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-05",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 2800000,
        loginAmount: 2800000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-08",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 1500000,
        loginAmount: 1500000,
        sanctionedAmount: 1400000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-11",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 800000,
        loginAmount: 800000,
        sanctionedAmount: 750000,
        disbursedAmount: 720000,
    },
    {
        applicationDate: "2026-02-14",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 750000,
        loginAmount: 750000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-17",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 1000000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-20",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3500000,
        loginAmount: 3500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-23",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2500000,
        loginAmount: 2500000,
        sanctionedAmount: 2300000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-02-25",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 550000,
        loginAmount: 550000,
        sanctionedAmount: 520000,
        disbursedAmount: 500000,
    },
    {
        applicationDate: "2026-02-27",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1100000,
        loginAmount: 1100000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-03-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 400000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-06",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 4200000,
        loginAmount: 4200000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-09",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 1900000,
        loginAmount: 1900000,
        sanctionedAmount: 1750000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-12",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 650000,
        loginAmount: 650000,
        sanctionedAmount: 610000,
        disbursedAmount: 580000,
    },
    {
        applicationDate: "2026-03-15",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 850000,
        loginAmount: 850000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-18",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 850000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-21",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3000000,
        loginAmount: 3000000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-24",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2100000,
        loginAmount: 2100000,
        sanctionedAmount: 1950000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-03-27",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 900000,
        loginAmount: 900000,
        sanctionedAmount: 850000,
        disbursedAmount: 800000,
    },
    {
        applicationDate: "2026-03-29",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 950000,
        loginAmount: 950000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-04-02",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 550000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-05",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3800000,
        loginAmount: 3800000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-08",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2400000,
        loginAmount: 2400000,
        sanctionedAmount: 2200000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-11",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 750000,
        loginAmount: 750000,
        sanctionedAmount: 700000,
        disbursedAmount: 660000,
    },
    {
        applicationDate: "2026-04-14",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1050000,
        loginAmount: 1050000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-17",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 1200000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-20",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 2700000,
        loginAmount: 2700000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-23",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2800000,
        loginAmount: 2800000,
        sanctionedAmount: 2550000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-04-26",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 500000,
        loginAmount: 500000,
        sanctionedAmount: 470000,
        disbursedAmount: 450000,
    },
    {
        applicationDate: "2026-04-28",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1250000,
        loginAmount: 1250000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-05-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 450000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-06",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3100000,
        loginAmount: 3100000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-09",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 1700000,
        loginAmount: 1700000,
        sanctionedAmount: 1550000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-12",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 600000,
        loginAmount: 600000,
        sanctionedAmount: 560000,
        disbursedAmount: 530000,
    },
    {
        applicationDate: "2026-05-15",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 800000,
        loginAmount: 800000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-18",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 900000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-21",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 2900000,
        loginAmount: 2900000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-24",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2300000,
        loginAmount: 2300000,
        sanctionedAmount: 2100000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-05-27",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 700000,
        loginAmount: 700000,
        sanctionedAmount: 660000,
        disbursedAmount: 620000,
    },
    {
        applicationDate: "2026-05-29",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1150000,
        loginAmount: 1150000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-06-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 650000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-06",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 4500000,
        loginAmount: 4500000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-09",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2600000,
        loginAmount: 2600000,
        sanctionedAmount: 2400000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-12",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 850000,
        loginAmount: 850000,
        sanctionedAmount: 800000,
        disbursedAmount: 750000,
    },
    {
        applicationDate: "2026-06-15",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 950000,
        loginAmount: 950000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-18",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 1100000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-21",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3600000,
        loginAmount: 3600000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-24",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2000000,
        loginAmount: 2000000,
        sanctionedAmount: 1850000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-06-27",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 500000,
        loginAmount: 500000,
        sanctionedAmount: 470000,
        disbursedAmount: 440000,
    },
    {
        applicationDate: "2026-06-29",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1300000,
        loginAmount: 1300000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-07-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 700000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-06",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 4000000,
        loginAmount: 4000000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-09",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2900000,
        loginAmount: 2900000,
        sanctionedAmount: 2700000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-12",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 900000,
        loginAmount: 900000,
        sanctionedAmount: 850000,
        disbursedAmount: 800000,
    },
    {
        applicationDate: "2026-07-15",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1000000,
        loginAmount: 1000000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-18",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 950000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-21",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3300000,
        loginAmount: 3300000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-24",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2200000,
        loginAmount: 2200000,
        sanctionedAmount: 2050000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-07-27",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 650000,
        loginAmount: 650000,
        sanctionedAmount: 610000,
        disbursedAmount: 570000,
    },
    {
        applicationDate: "2026-07-29",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1400000,
        loginAmount: 1400000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },

    {
        applicationDate: "2026-08-03",
        loanType: "Personal Loan",
        status: "In Process",
        loanAmount: 500000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-06",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3700000,
        loginAmount: 3700000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-09",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2700000,
        loginAmount: 2700000,
        sanctionedAmount: 2500000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-12",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 800000,
        loginAmount: 800000,
        sanctionedAmount: 750000,
        disbursedAmount: 700000,
    },
    {
        applicationDate: "2026-08-15",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 900000,
        loginAmount: 900000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-18",
        loanType: "Education Loan",
        status: "In Process",
        loanAmount: 1050000,
        loginAmount: 0,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-21",
        loanType: "Home Loan",
        status: "Login",
        loanAmount: 3400000,
        loginAmount: 3400000,
        sanctionedAmount: 0,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-24",
        loanType: "Business Loan",
        status: "Sanctioned",
        loanAmount: 2300000,
        loginAmount: 2300000,
        sanctionedAmount: 2150000,
        disbursedAmount: 0,
    },
    {
        applicationDate: "2026-08-27",
        loanType: "Personal Loan",
        status: "Disbursed",
        loanAmount: 600000,
        loginAmount: 600000,
        sanctionedAmount: 560000,
        disbursedAmount: 520000,
    },
    {
        applicationDate: "2026-08-29",
        loanType: "Vehicle Loan",
        status: "Rejected",
        loanAmount: 1200000,
        loginAmount: 1200000,
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
    const application = getDateValue(
        applicationDate
    );

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

const getStageAmount = (
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

const getFunnelData = (
    applications
) => {
    return STATUS_OPTIONS.map((status) => {
        const statusApplications =
            applications.filter(
                (application) =>
                    application.status === status
            );

        return {
            status,
            count: statusApplications.length,
            amount: statusApplications.reduce(
                (total, application) =>
                    total +
                    getStageAmount(
                        application,
                        status
                    ),
                0
            ),
        };
    });
};

export const getApplicationFunnelData = async ({
    fromDate = "",
    toDate = "",
    loanType = "",
} = {}) => {
    await new Promise((resolve) =>
        setTimeout(resolve, 250)
    );

    const filteredApplications =
        APPLICATIONS.filter(
            (application) => {
                const matchesDate =
                    isDateInRange(
                        application.applicationDate,
                        fromDate,
                        toDate
                    );

                const matchesLoanType =
                    !loanType ||
                    application.loanType ===
                        loanType;

                return (
                    matchesDate &&
                    matchesLoanType
                );
            }
        );

    const data = getFunnelData(
        filteredApplications
    );

    const totalApplications =
        filteredApplications.length;

    const totalAmount =
        filteredApplications.reduce(
            (total, application) =>
                total + application.loanAmount,
            0
        );

    return {
        data,
        totalApplications,
        totalAmount,
        filters: {
            fromDate: fromDate || null,
            toDate: toDate || null,
            loanType: loanType || null,
        },
    };
};