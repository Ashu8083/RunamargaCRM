import SearchableFilterDropdown from './SearchableFilterDropdown'


// =============================================================
// COMPONENT
// =============================================================

function StatusDropdown({
    label = '',
    value = '',
    onChange,
    options = [],
    allLabel = 'All Statuses',
    placeholder = allLabel,
    searchPlaceholder = 'Search status',
    emptyMessage = 'No statuses found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default StatusDropdown