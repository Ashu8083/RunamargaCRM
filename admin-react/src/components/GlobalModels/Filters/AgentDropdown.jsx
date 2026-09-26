// admin-react/src/components/GlobalModels/Filters/AgentDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'
import { getActiveContext } from '../../../app/auth'

const AgentDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Agent',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,

  // Optional Team Lead EmployeeContext ID
  teamLeadContextId = null,
}) => {
  const [agents, setAgents] = useState([])

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
  // FETCH AGENTS
  // =========================================================

  useEffect(() => {
    let isMounted = true

    const fetchAgents = async () => {
      setLoading(true)
      setFetchError('')

      try {
        /*
         * The active context is obtained internally.
         *
         * Example:
         *
         * /common/agents?context_id=59
         *
         * If a Team Lead context is provided:
         *
         * /common/agents
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
          url: '/common/agents',
          params,
        })

        const data = response.data
        /*
         * Backend response:
         *
         * [
         *   { id: 1, name: 'Agent Name' },
         *   { id: 2, name: 'Another Agent' }
         * ]
         */

        const formattedAgents = Array.isArray(data)
          ? data
              .filter(
                (agent) =>
                  agent &&
                  agent.id !== undefined &&
                  agent.id !== null &&
                  agent.name
              )
              .map((agent) => ({
                id: Number(agent.id),
                name: agent.name,
              }))
          : []

        if (!isMounted) return

        

        setAgents(formattedAgents)
      } catch (error) {
        if (!isMounted) return

        console.error(
          'Failed to fetch agents:',
          error
        )

        setAgents([])

        setFetchError(
          'Unable to load agents.'
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    /*
     * If there is no active context,
     * don't make a request without context.
     */
    if (!activeContext?.id) {
      setAgents([])
      setLoading(false)
      return
    }

    fetchAgents()

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
        options={agents}
        onChange={handleChange}
        includeAllOption={false}
        searchPlaceholder="Search Agent"
        placeholder={
          loading
            ? 'Loading Agents...'
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

export default AgentDropdown