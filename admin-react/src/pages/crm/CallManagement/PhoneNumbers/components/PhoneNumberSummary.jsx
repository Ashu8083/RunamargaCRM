// admin-react/src/pages/CallManagement/PhoneNumbers/components/PhoneNumberSummary.jsx

function PhoneNumberSummary({
    totalNumbers = 0,
    activeNumbers = 0,
    inactiveNumbers = 0,
    trackableNumbers = 0,
}) {

    const summaryCards = [
        {
            label: 'Total Numbers',
            value: totalNumbers,
        },
        {
            label: 'Active',
            value: activeNumbers,
        },
        {
            label: 'Inactive',
            value: inactiveNumbers,
        },
        {
            label: 'Trackable',
            value: trackableNumbers,
        },
    ]


    return (
        <div className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
        ">

            {summaryCards.map((card) => (

                <div
                    key={card.label}
                    className="
                        card
                        border
                        border-base-300
                        bg-base-100
                        shadow-sm
                    "
                >

                    <div className="card-body p-4">

                        <p className="
                            text-sm
                            text-base-content/60
                        ">
                            {card.label}
                        </p>


                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                        ">
                            {card.value}
                        </p>

                    </div>

                </div>

            ))}

        </div>
    )
}


export default PhoneNumberSummary