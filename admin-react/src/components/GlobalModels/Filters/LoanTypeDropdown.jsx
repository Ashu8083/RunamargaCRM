// admin-react/src/components/GlobalModels/Filters/LoanTypeDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { useCommonData } from '../../../context/CommonDataContext'

const LoanTypeDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Loan Type',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
  onOptionsLoaded,
}) => {

  const {
    getLoanTypes,
    loadingLoanTypes,
    loanTypesError,
  } = useCommonData()

  const [loanTypes, setLoanTypes] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchLoanTypes = async () => {
      try {
        const data = await getLoanTypes()

        if (!isMounted) return

        setLoanTypes(data)

        /*
         * Send loaded options to parent.
         */
        if (typeof onOptionsLoaded === 'function') {
          onOptionsLoaded(data)
        }

      } catch (error) {
        if (!isMounted) return

        console.error(
          'Failed to fetch loan types:',
          error
        )

        setLoanTypes([])
      }
    }

    fetchLoanTypes()

    return () => {
      isMounted = false
    }

  }, [getLoanTypes, onOptionsLoaded])

  /*
   * SearchableFilterDropdown returns:
   *
   * onChange(value, originalOption)
   */
  const handleChange = (
    selectedValue,
    selectedOption
  ) => {
    if (typeof onChange === 'function') {
      onChange(
        selectedValue,
        selectedOption
      )
    }
  }

  /*
   * Parent error takes priority.
   */
  const dropdownError =
    error || loanTypesError

  return (
    <div className={`w-full ${className}`}>

      {label && (
        <label
          className="mb-1.5 block text-xs font-medium text-base-content/60"
        >
          {label}

          {required && (
            <span className="ml-1 text-error">
              *
            </span>
          )}
        </label>
      )}

      <SearchableFilterDropdown
        value={value}
        options={loanTypes}
        onChange={handleChange}

        /*
         * Do not show ALL option.
         */
        includeAllOption={false}

        searchPlaceholder="Search Loan Type"

        placeholder={
          loadingLoanTypes
            ? 'Loading Loan Types...'
            : placeholder
        }

        disabled={
          disabled || loadingLoanTypes
        }

        getOptionValue={
          (option) => option.id
        }

        getOptionLabel={
          (option) => option.name
        }
      />

      {dropdownError && (
        <p className="mt-1 text-xs text-error">
          {dropdownError}
        </p>
      )}

    </div>
  )
}

export default LoanTypeDropdown