// admin-react/src/components/GlobalModels/Filters/StatusDropdown.jsx

import SearchableFilterDropdown from './SearchableFilterDropdown'

function StatusDropdown({
  label = '',
  value = '',
  onChange,
  options = [],
  allLabel = 'All Statuses',
  placeholder = allLabel,
  searchPlaceholder = 'Search status',
  emptyMessage = 'No statuses found',
  className = '',
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
      className={`box-border w-full min-w-0 ${className}`}
      {...props}
    />
  )
}

export default StatusDropdown