// admin-react\src\components\GlobalModels\Filters\EmployeeDropdown.jsx
import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_EMPLOYEES = [
    {
        id: 201,
        name: 'Rahul Sharma',
    },
    {
        id: 202,
        name: 'Anil Kumar',
    },
    {
        id: 203,
        name: 'Vikram Singh',
    },
    {
        id: 204,
        name: 'Arjun Rao',
    },
    {
        id: 205,
        name: 'Kiran Kumar',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function EmployeeDropdown({
    label = '',
    value = '',
    onChange,
    options,
    allLabel = 'All Employees',
    placeholder = allLabel,
    searchPlaceholder = 'Search employee',
    emptyMessage = 'No employees found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={DEFAULT_EMPLOYEES}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default EmployeeDropdown