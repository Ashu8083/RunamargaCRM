// admin-react/src/components/GlobalModels/Filters/RmDropdown.jsx
import { useEffect, useState } from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { useCommonData } from '../../../context/CommonDataContext'

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
  const {
    activeContext,
    getRms,
  } = useCommonData()

  const [rms, setRms] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // =========================================================
  // LOAD RMS FROM SHARED DATA PROVIDER
  // =========================================================

  useEffect(() => {
    let isMounted = true

    const loadRms = async () => {
      if (!activeContext?.id) {
        setRms([])
        setLoading(false)
        return
      }

      setLoading(true)
      setFetchError('')

      try {
        const data = await getRms(
          teamLeadContextId
        )

        if (!isMounted) return

        setRms(data)
      } catch (error) {
        if (!isMounted) return

        console.error(
          'Failed to load RMs:',
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

    loadRms()

    return () => {
      isMounted = false
    }
  }, [
    activeContext?.id,
    teamLeadContextId,
    getRms,
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