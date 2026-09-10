// admin-react/src/components/GlobalModels/Filters/LoanTypeDropdown.jsx
import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'


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

  const [loanTypes, setLoanTypes] = useState([])

  const [loading, setLoading] = useState(false)

  const [fetchError, setFetchError] = useState('')


  useEffect(() => {

    let isMounted = true


    const fetchLoanTypes = async () => {

      setLoading(true)

      setFetchError('')


      try {

        /*
         * Authentication, cookies, token refresh,
         * retry and baseURL are handled by apiClient.
         */
        const response = await apiClient({

          method: 'GET',

          url: '/common/loan-types',

        })


        const data = response.data


        /*
         * Backend response:
         *
         * [
         *   { id: 1, name: 'Personal' },
         *   { id: 2, name: 'Business' },
         *   { id: 3, name: 'Home' },
         *   { id: 4, name: 'LAP' },
         *   { id: 5, name: 'Education' },
         *   { id: 6, name: 'Car' },
         *   { id: 7, name: 'Gold' },
         *   { id: 8, name: 'Credit Card' },
         *   { id: 9, name: 'Agricultural' }
         * ]
         *
         * Only use loan types returned by
         * the backend.
         */


        const formattedLoanTypes = Array.isArray(data)

          ? data
              .filter(
                (loanType) =>
                  loanType &&
                  loanType.id !== undefined &&
                  loanType.id !== null &&
                  loanType.name
              )

              .map((loanType) => ({
                id: Number(loanType.id),

                name: loanType.name,
              }))

          : []


        if (!isMounted) return


        setLoanTypes(formattedLoanTypes)


        /*
         * Send loaded options to parent.
         */
        if (
          typeof onOptionsLoaded === 'function'
        ) {

          onOptionsLoaded(
            formattedLoanTypes
          )
        }

      } catch (error) {

        if (!isMounted) return


        console.error(
          'Failed to fetch loan types:',
          error
        )


        setLoanTypes([])


        /*
         * Keep the original error message.
         */
        setFetchError(
          'Unable to load loan types.'
        )

      } finally {

        if (isMounted) {

          setLoading(false)

        }
      }
    }


    fetchLoanTypes()


    return () => {

      isMounted = false

    }

  }, [onOptionsLoaded])


  /*
   * SearchableFilterDropdown returns:
   *
   * onChange(value, originalOption)
   *
   * Example:
   *
   * onChange(3, {
   *   id: 3,
   *   name: 'Home'
   * })
   */
  const handleChange = (
    selectedValue,
    selectedOption
  ) => {

    if (
      typeof onChange === 'function'
    ) {

      onChange(
        selectedValue,
        selectedOption
      )
    }
  }


  /*
   * Parent error takes priority.
   *
   * If there is no parent error,
   * show API fetch error.
   */
  const dropdownError =
    error || fetchError


  return (

    <div
      className={`w-full ${className}`}
    >

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
         * Same design.
         *
         * Do not show ALL option.
         */
        includeAllOption={false}


        /*
         * Prevent:
         *
         * Search undefined
         */
        searchPlaceholder="Search Loan Type"


        /*
         * Show loading text while
         * fetching loan types.
         */
        placeholder={
          loading
            ? 'Loading Loan Types...'
            : placeholder
        }


        /*
         * Disable dropdown while loading
         * or when parent disables it.
         */
        disabled={
          disabled || loading
        }


        /*
         * Value stored in the dropdown.
         */
        getOptionValue={
          (option) => option.id
        }


        /*
         * Text displayed in the dropdown.
         */
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
