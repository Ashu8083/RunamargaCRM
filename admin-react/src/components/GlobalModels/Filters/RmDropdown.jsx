// admin-react/src/components/GlobalModels/Filters/RmDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'
import { getActiveContext } from '../../../app/auth'

const RmDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select RM',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,

  // Optional Team Lead EmployeeContext ID
  teamLeadContextId = null,
}) => {
  const [rms, setRms] = useState([])

  const [loading, setLoading] = useState(false)

  const [fetchError, setFetchError] = useState('')

  // Current active EmployeeContext
  const [activeContext, setActiveContext] = useState(
    () => getActiveContext()
  )

  // =========================================================
  // LISTEN FOR ACTIVE CONTEXT CHANGES
  // =========================================================

  useEffect(() => {
    const handleAuthChanged = () => {
      const currentContext = getActiveContext()

      setActiveContext(currentContext)
    }

    window.addEventListener(
      'auth:changed',
      handleAuthChanged
    )

    return () => {
      window.removeEventListener(
        'auth:changed',
        handleAuthChanged
      )
    }
  }, [])

  // =========================================================
  // FETCH RMS
  // =========================================================

  useEffect(() => {
    let isMounted = true

    const fetchRms = async () => {
      setLoading(true)
      setFetchError('')

      try {
        /*
         * Active context is handled internally.
         *
         * Example:
         *
         * GET /common/rms?context_id=59
         *
         * If Team Lead context is also provided:
         *
         * GET /common/rms
         *   ?context_id=59
         *   &team_lead_context_id=123
         */

        const params = {}

        // -----------------------------------------------------
        // ACTIVE EMPLOYEE CONTEXT
        // -----------------------------------------------------

        if (
          activeContext?.id !== null &&
          activeContext?.id !== undefined &&
          activeContext?.id !== ''
        ) {
          params.context_id = activeContext.id
        }

        // -----------------------------------------------------
        // TEAM LEAD CONTEXT
        // -----------------------------------------------------

        if (
          teamLeadContextId !== null &&
          teamLeadContextId !== undefined &&
          teamLeadContextId !== ''
        ) {
          params.team_lead_context_id =
            teamLeadContextId
        }

        const response = await apiClient({
          method: 'GET',
          url: '/common/rms',
          params,
        })

        const data = response.data

        

        /*
         * Backend response:
         *
         * [
         *   { id: 1, name: 'RM Name' },
         *   { id: 2, name: 'Another RM' }
         * ]
         *
         * Only use RMs returned by
         * the backend.
         */

        const formattedRms = Array.isArray(data)
          ? data
              .filter(
                (rm) =>
                  rm &&
                  rm.id !== undefined &&
                  rm.id !== null &&
                  rm.name
              )
              .map((rm) => ({
                id: Number(rm.id),
                name: rm.name,
              }))
          : []

        if (!isMounted) return

        setRms(formattedRms)
      } catch (error) {
        if (!isMounted) return

        console.error(
          'Failed to fetch RMs:',
          error
        )

        setRms([])

        setFetchError(
          'Unable to load RMs.'
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    /*
     * Do not make the request without an
     * active EmployeeContext.
     */
    if (!activeContext?.id) {
      setRms([])
      setLoading(false)
      return
    }

    fetchRms()

    return () => {
      isMounted = false
    }
  }, [
    activeContext?.id,
    teamLeadContextId,
  ])

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  /*
   * SearchableFilterDropdown returns:
   *
   * onChange(value, originalOption)
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

  // =========================================================
  // ERROR
  // =========================================================

  /*
   * Parent error takes priority.
   *
   * If there is no parent error,
   * show API fetch error.
   */

  const dropdownError =
    error || fetchError

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={`w-full ${className}`}
    >
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
            <span className="ml-1 text-error">
              *
            </span>
          )}
        </label>
      )}

      <SearchableFilterDropdown
        value={value}
        options={rms}
        onChange={handleChange}
        includeAllOption={false}
        searchPlaceholder="Search RM"
        placeholder={
          loading
            ? 'Loading RMs...'
            : placeholder
        }
        disabled={
          disabled || loading
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

export default RmDropdown