import SearchableFilterDropdown from './SearchableFilterDropdown'

// =============================================================
// COMPONENT
// =============================================================

function AgentDropdown({
    label = 'Agent',
    value = '',
    onChange,
    options,
    allLabel = 'All Agents',
    placeholder = allLabel,
    searchPlaceholder = 'Search agent',
    emptyMessage = 'No agents found',
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


export default AgentDropdown
