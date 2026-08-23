import React from 'react'

import UserIcon from '@heroicons/react/24/outline/UserIcon'
import BuildingOffice2Icon from '@heroicons/react/24/outline/BuildingOffice2Icon'
import HomeIcon from '@heroicons/react/24/outline/HomeIcon'
import BuildingOfficeIcon from '@heroicons/react/24/outline/BuildingOfficeIcon'
import AcademicCapIcon from '@heroicons/react/24/outline/AcademicCapIcon'
import TruckIcon from '@heroicons/react/24/outline/TruckIcon'
import SparklesIcon from '@heroicons/react/24/outline/SparklesIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
import WrenchScrewdriverIcon from '@heroicons/react/24/outline/WrenchScrewdriverIcon'


const loanTypes = [
    {
        id: 'personal',
        name: 'Personal Loan',
        icon: UserIcon,
    },
    {
        id: 'business',
        name: 'Business Loan',
        icon: BuildingOffice2Icon,
    },
    {
        id: 'home',
        name: 'Home Loan',
        icon: HomeIcon,
    },
    {
        id: 'lap',
        name: 'Loan Against Property',
        icon: BuildingOfficeIcon,
    },
    {
        id: 'education',
        name: 'Education Loan',
        icon: AcademicCapIcon,
    },
    {
        id: 'car',
        name: 'Car Loan',
        icon: TruckIcon,
    },
    {
        id: 'gold',
        name: 'Gold Loan',
        icon: SparklesIcon,
    },
    {
        id: 'credit_card',
        name: 'Credit Card',
        icon: CreditCardIcon,
    },
    {
        id: 'agriculture',
        name: 'Agricultural Loan',
        icon: WrenchScrewdriverIcon,
    },
]


function LoanTypeSelection({
    selectedLoanType,
    onLoanTypeChange,
}) {

    return (
        <div>


            {/* Loan Types */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-10 py-5 gap-4 mt-6">

                {loanTypes.map((loan) => {

                    const Icon = loan.icon

                    const selected =
                        selectedLoanType === loan.id


                    return (
                        <button
                            key={loan.id}
                            type="button"
                            onClick={() =>
                                onLoanTypeChange(loan.id)
                            }
                            className={`
                                relative
                                min-h-[150px]
                                rounded-xl
                                border
                                p-5
                                text-left
                                transition-all
                                duration-150
                                hover:shadow-md
                                ${
                                    selected
                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                                        : 'border-base-300 bg-base-100'
                                }
                            `}
                        >

                            {/* Selected indicator */}

                            {selected && (

                                <span
                                    className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            'rgb(143, 212, 0)',
                                    }}
                                />

                            )}


                            {/* Icon */}

                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                    backgroundColor:
                                        'rgba(143, 212, 0, 0.12)',
                                }}
                            >

                                <Icon
                                    className="w-6 h-6"
                                    style={{
                                        color:
                                            'rgb(143, 212, 0)',
                                    }}
                                />

                            </div>


                            {/* Name */}

                            <h3 className="mt-5 font-semibold text-base-content">
                                {loan.name}
                            </h3>


                            <p className="mt-1 text-sm text-base-content/50">
                                Apply for this loan type
                            </p>

                        </button>
                    )

                })}

            </div>

        </div>
    )
}

export default LoanTypeSelection