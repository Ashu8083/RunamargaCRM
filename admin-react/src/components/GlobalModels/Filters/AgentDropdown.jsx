import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_AGENTS = [
    {
        id: 101,
        name: 'Rahul Sharma',
    },
    {
        id: 102,
        name: 'Anil Kumar',
    },
    {
        id: 103,
        name: 'Vikram Singh',
    },
    {
        id: 104,
        name: 'Arjun Rao',
    },
    {
        id: 105,
        name: 'Kiran Kumar',
    },
]


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
            defaultOptions={DEFAULT_AGENTS}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default AgentDropdown
