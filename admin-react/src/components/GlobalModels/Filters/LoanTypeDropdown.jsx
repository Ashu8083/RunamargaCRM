// admin-react/src/components/GlobalModels/Filters/LoanTypeDropdown.jsx


 // admin-react/src/components/GlobalModels/Filters/LoanTypeDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { useCommonData } from '../../../context/CommonDataContext'


const LoanTypeDropdown = ({
    value = '',
    onChange,
    placeholder = 'Select Loan Type',
    disabled = false,
    className = '',
    buttonClassName = '',
    menuClassName = '',
    label = '',
    error = '',
    required = false,
    onOptionsLoaded,
}) => {

    const {
        getLoanTypes,
        loadingLoanTypes,
        loanTypesError,
    } = useCommonData()

    const [loanTypes, setLoanTypes] = useState([])


    // =========================================================
    // FETCH LOAN TYPES
    // =========================================================

    useEffect(() => {
        let isMounted = true

        const fetchLoanTypes = async () => {
            try {
                const data = await getLoanTypes()

                if (!isMounted) return

                const normalizedData = Array.isArray(data)
                    ? data
                    : []

                setLoanTypes(normalizedData)

                if (typeof onOptionsLoaded === 'function') {
                    onOptionsLoaded(normalizedData)
                }

            } catch (fetchError) {
                if (!isMounted) return

                console.error(
                    'Failed to fetch loan types:',
                    fetchError
                )

                setLoanTypes([])
            }
        }

        fetchLoanTypes()

        return () => {
            isMounted = false
        }

    }, [getLoanTypes, onOptionsLoaded])


    // =========================================================
    // HANDLE SELECTION
    // =========================================================

    const handleChange = (
        selectedValue,
        selectedOption
    ) => {
        if (typeof onChange === 'function') {
            onChange(
                selectedValue,
                selectedOption
            )
        }
    }


    // =========================================================
    // ERROR
    // =========================================================

    const dropdownError = error || loanTypesError


    // =========================================================
    // COMPONENT UI
    // =========================================================

    return (
        <div
            className={`
                box-border
                w-full
                min-w-0
                ${className}
            `}
        >
            {/* OPTIONAL LABEL */}

            {label && (
                <label
                    className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    "
                >
                    {label}

                    {required && (
                        <span className="ml-1 text-error">
                            *
                        </span>
                    )}
                </label>
            )}

            {/* LOAN TYPE DROPDOWN */}

            <SearchableFilterDropdown
                label={label || 'Loan Type'}
                value={value}
                options={loanTypes}
                onChange={handleChange}

                includeAllOption={false}
                showLabel={false}

                placeholder={
                    loadingLoanTypes
                        ? 'Loading Loan Types...'
                        : placeholder
                }

                searchPlaceholder="Search Loan Type"

                loading={loadingLoanTypes}

                disabled={
                    disabled || loadingLoanTypes
                }

                className="
                    box-border
                    w-full
                    min-w-0
                "

                buttonClassName={`
                    box-border
                    h-10
                    min-h-10
                    w-full
                    min-w-0
                    rounded-lg
                    ${buttonClassName}
                `}

                menuClassName={menuClassName}

                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.name}
            />

            {/* ERROR MESSAGE */}

            {dropdownError && (
                <p
                    className="
                        mt-1
                        text-xs
                        text-error
                    "
                    role="alert"
                >
                    {dropdownError}
                </p>
            )}
        </div>
    )
}

export default LoanTypeDropdown
