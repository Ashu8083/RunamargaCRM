// admin-react/src/components/GlobalModels/Filters/TeamLeadDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'
import { getActiveContext } from '../../../app/auth'
import { hasPermission, PERMISSIONS } from '../../../app/permissions'

const TeamLeadDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Team Lead',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
}) => {
  const [teamLeads, setTeamLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const canSelectTeamLeads = hasPermission(PERMISSIONS.TEAM_LEADS_VIEW)

  // Current active EmployeeContext
  const [activeContext, setActiveContext] = useState(
    () => getActiveContext()
  )

  // Listen for active context changes
  useEffect(() => {
    const handleAuthChanged = () => {
      setActiveContext(getActiveContext())
    }

    window.addEventListener('auth:changed', handleAuthChanged)

    return () => {
      window.removeEventListener('auth:changed', handleAuthChanged)
    }
  }, [])

  // Fetch team leads only when the user has permission
  useEffect(() => {
    let isMounted = true

    const fetchTeamLeads = async () => {
      setLoading(true)
      setFetchError('')

      try {
        const params = {}

        if (
          activeContext?.id !== null &&
          activeContext?.id !== undefined &&
          activeContext?.id !== ''
        ) {
          params.context_id = activeContext.id
        }

        const response = await apiClient({
          method: 'GET',
          url: '/common/team-leads',
          params,
        })

        const data = response.data

        const formattedTeamLeads = Array.isArray(data)
          ? data
              .filter(
                (teamLead) =>
                  teamLead &&
                  teamLead.id !== undefined &&
                  teamLead.id !== null &&
                  teamLead.name
              )
              .map((teamLead) => ({
                id: Number(teamLead.id),
                name: teamLead.name,
              }))
          : []

        if (!isMounted) return

        setTeamLeads(formattedTeamLeads)
      } catch (error) {
        if (!isMounted) return

        console.error('Failed to fetch team leads:', error)

        setTeamLeads([])
        setFetchError('Unable to load team leads.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Do not fetch without permission or an active EmployeeContext
    if (!canSelectTeamLeads || !activeContext?.id) {
      setTeamLeads([])
      setLoading(false)
      setFetchError('')

      return () => {
        isMounted = false
      }
    }

    fetchTeamLeads()

    return () => {
      isMounted = false
    }
  }, [activeContext?.id, canSelectTeamLeads])

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

          {required && (
            <span className="ml-1 text-error">
              *
            </span>
          )}
        </label>
      )}

      <SearchableFilterDropdown
        value={value}
        options={teamLeads}
        onChange={handleChange}
        includeAllOption={false}
        searchPlaceholder="Search Team Lead"
        placeholder={
          !canSelectTeamLeads
            ? 'Permission Required'
            : loading
              ? 'Loading Team Leads...'
              : placeholder
        }
        disabled={disabled || loading || !canSelectTeamLeads}
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

export default TeamLeadDropdown