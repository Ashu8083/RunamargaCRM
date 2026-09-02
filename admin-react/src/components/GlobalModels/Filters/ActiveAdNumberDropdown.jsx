// src/components/Filters/ActiveAdNumberDropdown.jsx
import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'


// =============================================================
// MOCK API
// Replace this with your actual API call later.
// =============================================================

const fetchActiveAdNumbers = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 501,
                    number: '9876543210',
                },
                {
                    id: 502,
                    number: '9876543211',
                },
                {
                    id: 503,
                    number: '9876543212',
                },
                {
                    id: 504,
                    number: '9876543213',
                },
                {
                    id: 505,
                    number: '9876543214',
                },
            ])

        }, 300)

    })

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
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.number}
            {...props}
        />

    )

}


export default ActiveAdNumberDropdown