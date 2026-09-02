import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_LOAN_TYPES = [
    {
        id: 401,
        name: 'Personal Loan',
    },
    {
        id: 402,
        name: 'Home Loan',
    },
    {
        id: 403,
        name: 'Business Loan',
    },
    {
        id: 404,
        name: 'Vehicle Loan',
    },
    {
        id: 405,
        name: 'Education Loan',
    },
    {
        id: 406,
        name: 'Gold Loan',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function LoanTypeDropdown({
    label = 'Loan Type',
    value = '',
    onChange,
    options,
    allLabel = 'All Loan Types',
    placeholder = allLabel,
    searchPlaceholder = 'Search loan type',
    emptyMessage = 'No loan types found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={DEFAULT_LOAN_TYPES}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default LoanTypeDropdown
