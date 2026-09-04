import React, { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { API_BASE_URL } from '../../../config/url'


function LoanTypeDropdown({
    label = 'Loan Type',
    value = '',
    onChange,
    options,
    placeholder = 'Select loan type',
    searchPlaceholder = 'Search loan type',
    emptyMessage = 'No loan types found',
    ...props
}) {

    const [loanTypes, setLoanTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    // =============================================================
    // FETCH LOAN TYPES
    // =============================================================

    useEffect(() => {

        let isMounted = true

        const fetchLoanTypes = async () => {

            try {

                setLoading(true)
                setError('')

                const response = await fetch(
                    `${API_BASE_URL}/common/loan-types`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch loan types (${response.status})`
                    )
                }

                const data = await response.json()

                if (!isMounted) {
                    return
                }

                const formattedLoanTypes = Array.isArray(data)
                    ? data.map((loanType) => ({
                        id: Number(loanType.id),
                        name: loanType.name,
                    }))
                    : []

                setLoanTypes(formattedLoanTypes)

            } catch (err) {

                console.error(
                    'Failed to fetch loan types:',
                    err
                )

                if (isMounted) {
                    setError('Unable to load loan types')
                    setLoanTypes([])
                }

            } finally {

                if (isMounted) {
                    setLoading(false)
                }

            }
        }

        fetchLoanTypes()

        return () => {
            isMounted = false
        }

    }, [])


    // =============================================================
    // OPTIONS
    // =============================================================

    const dropdownOptions = options ?? loanTypes


    // =============================================================
    // COMPONENT
    // =============================================================

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={dropdownOptions}
            placeholder={
                loading
                    ? 'Loading loan types...'
                    : error
                        ? error
                        : placeholder
            }
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            disabled={loading || !!error}
            {...props}
        />

    )

}


export default LoanTypeDropdown