// admin-react/src/components/GlobalModels/Filters/RmDropdown.jsx

import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import apiClient from '../../../app/apiClient'


const RmDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select RM',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
}) => {

  const [rms, setRms] = useState([])

  const [loading, setLoading] = useState(false)

  const [fetchError, setFetchError] = useState('')


  useEffect(() => {

    let isMounted = true


    const fetchRms = async () => {

      setLoading(true)

      setFetchError('')


      try {

        /*
         * Authentication, cookies, token refresh,
         * retry and baseURL are handled by apiClient.
         */
        const response = await apiClient({

          method: 'GET',

          url: '/common/rms',

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


    fetchRms()


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

        options={rms}

        onChange={handleChange}


        /*
         * Do not show ALL option.
         */
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