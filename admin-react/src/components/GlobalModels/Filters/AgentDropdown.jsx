// admin-react/src/components/GlobalModels/Filters/AgentDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { useCommonData } from '../../../context/CommonDataContext'

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
  const {
    activeContext,
    getAgents,
  } = useCommonData()

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // =========================================================
  // LOAD AGENTS FROM SHARED DATA PROVIDER
  // =========================================================

  useEffect(() => {
    let isMounted = true

    const loadAgents = async () => {
      if (!activeContext?.id) {
        setAgents([])
        setLoading(false)
        return
      }

      setLoading(true)
      setFetchError('')

      try {
        const data = await getAgents(
          teamLeadContextId
        )

        if (!isMounted) return

        setAgents(data)
      } catch (error) {
        if (!isMounted) return

        console.error(
          'Failed to load agents:',
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

    loadAgents()

    return () => {
      isMounted = false
    }
  }, [
    activeContext?.id,
    teamLeadContextId,
    getAgents,
  ])

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

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