import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'


// =============================================================
// COMPONENT
// =============================================================

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

  // ===========================================================
  // STATE
  // ===========================================================

  const [employees, setEmployees] = useState([])

  const [loading, setLoading] = useState(false)

  const [fetchError, setFetchError] = useState('')


  // ===========================================================
  // FETCH EMPLOYEES
  // ===========================================================

  useEffect(() => {

    let isMounted = true


    const fetchEmployees = async () => {

      setLoading(true)

      setFetchError('')


      try {

        /*
         * Authentication, cookies, token refresh,
         * retry and baseURL are handled by apiClient.
         *
         * Backend:
         *
         * GET /common/employees
         */
        const response = await apiClient({

          method: 'GET',

          url: '/common/employees',

        })


        const data = response.data


        /*
         * Expected backend response:
         *
         * [
         *   {
         *     id: 201,
         *     name: 'Rahul Sharma'
         *   },
         *   {
         *     id: 202,
         *     name: 'Anil Kumar'
         *   }
         * ]
         *
         * Only active employees are returned by
         * the backend.
         *
         * Do not add dummy/default employees here.
         */


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


        setEmployees(
          formattedEmployees
        )


        // =====================================================
        // SEND OPTIONS TO PARENT
        // =====================================================

        if (
          typeof onOptionsLoaded === 'function'
        ) {

          onOptionsLoaded(
            formattedEmployees
          )
        }

      } catch (error) {

        if (!isMounted) return


        console.error(
          'Failed to fetch employees:',
          error
        )


        setEmployees([])


        /*
         * Keep the dropdown error simple.
         *
         * Parent error, when supplied, will take
         * priority below.
         */
        setFetchError(
          'Unable to load employees.'
        )

      } finally {

        if (isMounted) {

          setLoading(false)

        }
      }
    }


    fetchEmployees()


    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {

      isMounted = false

    }

  }, [onOptionsLoaded])


  // ===========================================================
  // HANDLE CHANGE
  // ===========================================================
  /*
   * SearchableFilterDropdown returns:
   *
   * onChange(value, originalOption)
   *
   * Example:
   *
   * onChange(
   *   201,
   *   {
   *     id: 201,
   *     name: 'Rahul Sharma'
   *   }
   * )
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


  // ===========================================================
  // ERROR
  // ===========================================================
  /*
   * Parent error takes priority.
   *
   * If there is no parent error,
   * show the API fetch error.
   */

  const dropdownError =
    error || fetchError


  // ===========================================================
  // RENDER
  // ===========================================================

  return (

    <div
      className={`w-full ${className}`}
    >

      {/* =====================================================
          LABEL
      ===================================================== */}

      {label && (

        <label
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-base-content
          "
        >

          {label}


          {required && (

            <span
              className="
                ml-1
                text-error
              "
            >

              *

            </span>

          )}

        </label>

      )}


      {/* =====================================================
          EMPLOYEE DROPDOWN
      ===================================================== */}

      <SearchableFilterDropdown

        value={value}

        options={employees}

        onChange={handleChange}


        /*
         * Employee dropdown should not show
         * an "All Employees" option unless the
         * parent explicitly implements that behavior.
         *
         * This follows the same behavior as
         * LoanTypeDropdown.
         */
        includeAllOption={false}


        /*
         * Search placeholder.
         */
        searchPlaceholder="Search Employee"


        /*
         * Show loading state while fetching.
         */
        placeholder={
          loading
            ? 'Loading Employees...'
            : placeholder
        }


        /*
         * Disable while loading or when
         * disabled by the parent.
         */
        disabled={
          disabled || loading
        }


        /*
         * Employee ID is the stored value.
         */
        getOptionValue={
          (option) => option.id
        }


        /*
         * Employee name is displayed.
         */
        getOptionLabel={
          (option) => option.name
        }

      />


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {dropdownError && (

        <p
          className="
            mt-1
            text-xs
            text-error
          "
        >

          {dropdownError}

        </p>

      )}

    </div>

  )
}


export default EmployeeDropdown