// admin-react/src/pages/Analytics/AgentAnalytics/Overview/components/PipelineStages.jsx

import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import CurrencyRupeeIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'


// =============================================================
// VIEW TYPES
// =============================================================

const VIEW_TYPES = {
    AGENT: 'agent',
    RM: 'rm',
}


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (
    value
) => {

    return Number(
        value || 0
    ).toLocaleString('en-IN')

}


// =============================================================
// GET VIEW LABEL
// =============================================================

const getViewLabel = (
    viewType
) => {

    return viewType === VIEW_TYPES.RM
        ? 'RM'
        : 'Agent'

}


// =============================================================
// PIPELINE STAGE
// =============================================================

function PipelineStage({
    number,
    title,
    description,
    value,
    icon: Icon,
    iconClass,
    numberClass,
    borderClass,
}) {

    return (

        <div
            className={`
                relative
                min-w-0
                flex-1
                rounded-2xl
                border
                bg-base-100
                p-4
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                ${borderClass}
            `}
        >

            {/* =================================================
                STAGE NUMBER
            ================================================= */}

            <div
                className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-base-200
                    px-1.5
                    text-[10px]
                    font-bold
                    text-base-content/40
                "
            >
                {number}
            </div>


            {/* =================================================
                ICON
            ================================================= */}

            <div
                className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    ${iconClass}
                `}
            >

                <Icon
                    className="
                        h-5
                        w-5
                    "
                />

            </div>


            {/* =================================================
                COUNT
            ================================================= */}

            <div
                className="
                    mt-4
                "
            >

                <p
                    className={`
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                        ${numberClass}
                    `}
                >
                    {formatNumber(
                        value
                    )}
                </p>


                <p
                    className="
                        mt-1
                        text-sm
                        font-semibold
                        text-base-content
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        min-h-[32px]
                        text-[11px]
                        leading-4
                        text-base-content/50
                    "
                >
                    {description}
                </p>

            </div>

        </div>

    )

}


// =============================================================
// CONNECTOR
// =============================================================

function PipelineConnector() {

    return (

        <div
            className="
                hidden
                shrink-0
                items-center
                justify-center
                text-base-content/20
                xl:flex
            "
        >

            <ArrowRightIcon
                className="
                    h-5
                    w-5
                "
            />

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function PipelineStages({
    pipeline = {},
    viewType = VIEW_TYPES.AGENT,
}) {

    // =========================================================
    // VIEW LABEL
    // =========================================================

    const viewLabel =
        getViewLabel(
            viewType
        )


    // =========================================================
    // APPLICATION PIPELINE COUNTS
    // =========================================================

    const totalLeads =
        Number(
            pipeline?.totalLeads || 0
        )


    const inProcess =
        Number(
            pipeline?.inProcess || 0
        )


    const login =
        Number(
            pipeline?.login || 0
        )


    const sanctioned =
        Number(
            pipeline?.sanctioned || 0
        )


    const disbursed =
        Number(
            pipeline?.disbursed || 0
        )


    const rejected =
        Number(
            pipeline?.rejected || 0
        )


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section
            className="
                w-full
                min-w-0
            "
        >

            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <div
                className="
                    mb-4
                    flex
                    min-w-0
                    flex-wrap
                    items-end
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <div
                            className="
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full
                                bg-primary
                            "
                        />


                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-base-content
                                sm:text-base
                            "
                        >
                            Application Pipeline
                        </h2>

                    </div>


                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-base-content/50
                        "
                    >
                        {viewLabel} application cohort and
                        application-processing activity
                    </p>

                </div>


                {/* =================================================
                    ANALYTICS TYPE
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                        px-3
                        py-2
                    "
                >

                    <span
                        className="
                            h-2
                            w-2
                            rounded-full
                            bg-primary
                        "
                    />


                    <span
                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-base-content/50
                        "
                    >
                        {viewLabel} View
                    </span>

                </div>

            </div>


            {/* =================================================
                PIPELINE CONTAINER
            ================================================= */}

            <div
                className="
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-200/20
                    p-3
                    sm:p-4
                    lg:p-5
                "
            >

                {/* =================================================
                    COHORT TOTAL
                ================================================= */}

                <div
                    className="
                        mb-4
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-primary/10
                        bg-primary/5
                        p-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary/10
                                text-primary
                            "
                        >

                            <DocumentTextIcon
                                className="
                                    h-5
                                    w-5
                                "
                            />

                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-base-content
                                "
                            >
                                Selected Application Cohort
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    leading-4
                                    text-base-content/50
                                "
                            >
                                Applications whose applied date falls within
                                the selected period and the visible
                                {` ${viewLabel.toLowerCase()}`} scope.
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-xl
                            bg-base-100
                            px-4
                            py-2.5
                            sm:min-w-[150px]
                        "
                    >

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/45
                            "
                        >
                            Total
                        </span>


                        <span
                            className="
                                text-xl
                                font-bold
                                tracking-tight
                                text-primary
                            "
                        >
                            {formatNumber(
                                totalLeads
                            )}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    APPLICATION PROCESSING GRID
                ================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-3
                        xl:flex-row
                        xl:items-stretch
                        xl:gap-2
                    "
                >

                    {/* =================================================
                        IN PROCESS
                    ================================================= */}

                    <PipelineStage
                        number="01"
                        title="In Process"
                        description="Applications in in-process or document-pending status within the selected cohort."
                        value={
                            inProcess
                        }
                        icon={
                            ClockIcon
                        }
                        iconClass="
                            bg-warning/10
                            text-warning
                        "
                        numberClass="
                            text-warning
                        "
                        borderClass="
                            border-warning/15
                        "
                    />


                    <PipelineConnector />


                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <PipelineStage
                        number="02"
                        title="Login"
                        description="Qualifying BankProcessing login rows belonging to the selected application cohort."
                        value={
                            login
                        }
                        icon={
                            ArrowRightOnRectangleIcon
                        }
                        iconClass="
                            bg-info/10
                            text-info
                        "
                        numberClass="
                            text-info
                        "
                        borderClass="
                            border-info/15
                        "
                    />


                    <PipelineConnector />


                    {/* =================================================
                        SANCTIONED
                    ================================================= */}

                    <PipelineStage
                        number="03"
                        title="Sanctioned"
                        description="Qualifying BankProcessing sanction rows belonging to the selected application cohort."
                        value={
                            sanctioned
                        }
                        icon={
                            CheckCircleIcon
                        }
                        iconClass="
                            bg-success/10
                            text-success
                        "
                        numberClass="
                            text-success
                        "
                        borderClass="
                            border-success/15
                        "
                    />


                    <PipelineConnector />


                    {/* =================================================
                        DISBURSED
                    ================================================= */}

                    <PipelineStage
                        number="04"
                        title="Disbursed"
                        description="Qualifying BankProcessing disbursement rows belonging to the selected application cohort."
                        value={
                            disbursed
                        }
                        icon={
                            CurrencyRupeeIcon
                        }
                        iconClass="
                            bg-secondary/10
                            text-secondary
                        "
                        numberClass="
                            text-secondary
                        "
                        borderClass="
                            border-secondary/15
                        "
                    />

                </div>


                {/* =================================================
                    REJECTED
                ================================================= */}

                <div
                    className="
                        mt-3
                        border-t
                        border-base-300
                        pt-3
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        {/* =================================================
                            REJECTED LABEL
                        ================================================= */}

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-error/10
                                    text-error
                                "
                            >

                                <XCircleIcon
                                    className="
                                        h-5
                                        w-5
                                    "
                                />

                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    "
                                >
                                    Rejected
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[11px]
                                        leading-4
                                        text-base-content/50
                                    "
                                >
                                    Applications with rejected status
                                    within the selected application cohort.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            REJECTED COUNT
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                rounded-xl
                                border
                                border-error/15
                                bg-error/5
                                px-4
                                py-2.5
                                sm:min-w-[150px]
                            "
                        >

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-error/70
                                "
                            >
                                Applications
                            </span>


                            <span
                                className="
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-error
                                "
                            >
                                {formatNumber(
                                    rejected
                                )}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PIPELINE SEMANTICS
                ================================================= */}

                <div
                    className="
                        mt-4
                        rounded-xl
                        bg-base-100
                        px-4
                        py-3
                    "
                >

                    <p
                        className="
                            text-[11px]
                            leading-5
                            text-base-content/50
                        "
                    >
                        The application cohort is selected by applied date.
                        In Process and Rejected count applications, while
                        Login, Sanctioned, and Disbursed count qualifying
                        BankProcessing rows. These categories are independent,
                        so one application can contribute to more than one
                        processing category.
                    </p>

                </div>

            </div>

        </section>

    )

}


export default PipelineStages