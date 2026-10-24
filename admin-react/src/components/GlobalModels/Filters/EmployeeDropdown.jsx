// admin-react/src/components/GlobalModels/Filters/EmployeeDropdown.jsx

import { useEffect, useState } from 'react'
import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'

const EmployeeDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Employee',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
  onOptionsLoaded,
}) => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // Fetch employees
  useEffect(() => {
    let isMounted = true

    const fetchEmployees = async () => {
      setLoading(true)
      setFetchError('')

      try {
        const response = await apiClient({
          method: 'GET',
          url: '/common/employees',
        })

        const data = response.data

        const formattedEmployees = Array.isArray(data)
          ? data
              .filter(
                (employee) =>
                  employee &&
                  employee.id !== undefined &&
                  employee.id !== null &&
                  employee.name
              )
              .map((employee) => ({
                id: Number(employee.id),
                name: employee.name,
              }))
          : []

        if (!isMounted) return

        setEmployees(formattedEmployees)

        if (typeof onOptionsLoaded === 'function') {
          onOptionsLoaded(formattedEmployees)
        }
      } catch (error) {
        if (!isMounted) return

        console.error('Failed to fetch employees:', error)

        setEmployees([])
        setFetchError('Unable to load employees.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchEmployees()

    return () => {
      isMounted = false
    }
  }, [onOptionsLoaded])

  // Handle selection
  const handleChange = (selectedValue, selectedOption) => {
    if (typeof onChange === 'function') {
      onChange(selectedValue, selectedOption)
    }
  }

  // Parent error takes priority
  const dropdownError = error || fetchError

  return (
    <div className={`box-border w-full min-w-0 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-base-content">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <SearchableFilterDropdown
        value={value}
        options={employees}
        onChange={handleChange}
        includeAllOption={false}
        searchPlaceholder="Search Employee"
        placeholder={
          loading ? 'Loading Employees...' : placeholder
        }
        disabled={disabled || loading}
        className="box-border w-full min-w-0"
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
      />

      {dropdownError && (
        <p className="mt-1 text-xs text-error" role="alert">
          {dropdownError}
        </p>
      )}
    </div>
  )
}

export default EmployeeDropdown