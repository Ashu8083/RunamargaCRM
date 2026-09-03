// admin-react\src\components\GlobalModels\Filters\CityDropdown.jsx
import SearchableFilterDropdown from './SearchableFilterDropdown'


const DEFAULT_CITIES = [
    {
        id: 301,
        name: 'Bengaluru',
    },
    {
        id: 302,
        name: 'Mysuru',
    },
    {
        id: 303,
        name: 'Mangaluru',
    },
    {
        id: 304,
        name: 'Hubballi',
    },
    {
        id: 305,
        name: 'Belagavi',
    },
    {
        id: 306,
        name: 'Chennai',
    },
    {
        id: 307,
        name: 'Hyderabad',
    },
    {
        id: 308,
        name: 'Mumbai',
    },
    {
        id: 309,
        name: 'Pune',
    },
    {
        id: 310,
        name: 'Delhi',
    },
    {
        id: 311,
        name: 'Ahmedabad',
    },
    {
        id: 312,
        name: 'Kochi',
    },
    {
        id: 313,
        name: 'Jaipur',
    },
    {
        id: 314,
        name: 'Kolkata',
    },
    {
        id: 315,
        name: 'Lucknow',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function CityDropdown({
    label = 'City',
    value = '',
    onChange,
    options,
    allLabel = 'All Cities',
    placeholder = allLabel,
    searchPlaceholder = 'Search City',
    emptyMessage = 'No cities found',
    ...props
}) {

    return (

        <SearchableFilterDropdown
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            defaultOptions={DEFAULT_CITIES}
            allLabel={allLabel}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
        />

    )

}


export default CityDropdown