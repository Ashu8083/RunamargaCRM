// src/components/Filters/ActiveAdNumberDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'


// =============================================================
// API
// =============================================================

const fetchActiveAdNumbers = async () => {

    const response = await apiClient.get(
        '/call-analytics/active-ad-numbers'
    )
    // console.log(response);
    return response.data

}


// =============================================================
// COMPONENT
// =============================================================

function ActiveAdNumberDropdown({
    label = 'Active Ad Number',
    value = '',
    onChange,
    options,
    allLabel = 'All Ad Numbers',
    placeholder = allLabel,
    searchPlaceholder = 'Search ad number',
    emptyMessage = 'No ad numbers found',
    ...props
}) {

    const [defaultOptions, setDefaultOptions] = useState([])

    const [loading, setLoading] = useState(false)


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        const loadAdNumbers = async () => {

            setLoading(true)

            try {

                const data =
                    await fetchActiveAdNumbers()

                setDefaultOptions(
                    Array.isArray(data)
                        ? data
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load active ad numbers:',
                    error
                )

                setDefaultOptions([])

            } finally {

                setLoading(false)

            }

        }

        loadAdNumbers()

    }, [])


    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={defaultOptions}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            loading={loading}
            getOptionValue={(option) => option.phone}
            getOptionLabel={(option) => option.phone}
            {...props}
        />

    )

}


export default ActiveAdNumberDropdown