import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_RMS = [
    {
        id: 201,
        name: 'Priya Nair',
    },
    {
        id: 202,
        name: 'Rajesh Rao',
    },
    {
        id: 203,
        name: 'Sneha Reddy',
    },
    {
        id: 204,
        name: 'Manoj Kumar',
    },
    {
        id: 205,
        name: 'Deepa Sharma',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function RmDropdown({
    label = 'RM',
    value = '',
    onChange,
    options,
    allLabel = 'All RMs',
    placeholder = allLabel,
    searchPlaceholder = 'Search RM',
    emptyMessage = 'No RMs found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={DEFAULT_RMS}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default RmDropdown
