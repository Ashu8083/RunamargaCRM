// admin-react/src/components/GlobalModels/Filters/TeamLeadDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'


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


  useEffect(() => {

    let isMounted = true


    const fetchTeamLeads = async () => {

      setLoading(true)

      setFetchError('')


      try {

        /*
         * Authentication, cookies, token refresh,
         * retry and baseURL are handled by apiClient.
         */
        const response = await apiClient({

          method: 'GET',

          url: '/common/team-leads',

        })


        const data = response.data


        /*
         * Backend response:
         *
         * [
         *   { id: 1, name: 'Team Lead Name' },
         *   { id: 2, name: 'Another Team Lead' }
         * ]
         *
         * Only use Team Leads returned by
         * the backend.
         */

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


        console.error(
          'Failed to fetch team leads:',
          error
        )


        setTeamLeads([])


        setFetchError(
          'Unable to load team leads.'
        )

      } finally {

        if (isMounted) {

          setLoading(false)

        }
      }
    }


    fetchTeamLeads()


    return () => {

      isMounted = false

    }

  }, [])


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
          className="mb-1.5 block text-sm font-medium text-base-content"
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

        options={teamLeads}

        onChange={handleChange}


        /*
         * Do not show ALL option.
         */
        includeAllOption={false}


        searchPlaceholder="Search Team Lead"


        placeholder={
          loading
            ? 'Loading Team Leads...'
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


export default TeamLeadDropdown