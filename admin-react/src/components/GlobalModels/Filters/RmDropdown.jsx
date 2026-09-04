import SearchableFilterDropdown from './SearchableFilterDropdown'

// =============================================================
// COMPONENT
// =============================================================

function RmDropdown({
    label = 'RM',
    value = '',
    onChange,
    options = [],
    loading = false,
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
            loading={loading}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}

export default RmDropdown
