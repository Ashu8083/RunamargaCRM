import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_TEAM_LEADS = [
    {
        id: 301,
        name: 'Suresh Kumar',
    },
    {
        id: 302,
        name: 'Priya Nair',
    },
    {
        id: 303,
        name: 'Rajesh Rao',
    },
    {
        id: 304,
        name: 'Vikram Shetty',
    },
    {
        id: 305,
        name: 'Naveen Kumar',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function TeamLeadDropdown({
    label = 'Team Lead',
    value = '',
    onChange,
    options,
    allLabel = 'All Team Leads',
    placeholder = allLabel,
    searchPlaceholder = 'Search team lead',
    emptyMessage = 'No team leads found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={DEFAULT_TEAM_LEADS}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default TeamLeadDropdown
