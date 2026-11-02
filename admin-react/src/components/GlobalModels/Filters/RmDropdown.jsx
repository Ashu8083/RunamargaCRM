// admin-react/src/components/GlobalModels/Filters/RmDropdown.jsx

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import SearchableFilterDropdown from './SearchableFilterDropdown'
import { useCommonData } from '../../../context/CommonDataContext'
import { PERMISSIONS, hasPermission } from '../../../app/permissions'

const RmDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select RM',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
  fallbackLabel = '',
  teamLeadContextId = null,
}) => {
  const {
    activeContext,
    getRms,
  } = useCommonData()

  const [rms, setRms] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // Check RM view permission
  const canSelectRM = hasPermission(
    PERMISSIONS.RM_VIEW
  )

  // Load RMs from the shared data provider
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
        const data = await getRms(teamLeadContextId)

        if (!isMounted) return

        setRms(data)
      } catch (error) {
        if (!isMounted) return

        console.error('Failed to load RMs:', error)

        setRms([])
        setFetchError('Unable to load RMs.')
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

  // Include the selected RM if it is missing from the loaded options
  const dropdownRms = useMemo(() => {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      !fallbackLabel
    ) {
      return rms
    }

    const exists = rms.some(
      (rm) => String(rm.id) === String(value)
    )

    if (exists) {
      return rms
    }

    return [
      {
        id: value,
        name: fallbackLabel,
      },
      ...rms,
    ]
  }, [
    rms,
    value,
    fallbackLabel,
  ])

  // Handle selection
  const handleChange = (
    selectedValue,
    selectedOption
  ) => {
    if (
      !canSelectRM ||
      disabled ||
      loading
    ) {
      return
    }

    if (typeof onChange === 'function') {
      onChange(
        selectedValue,
        selectedOption
      )
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
        options={dropdownRms}
        onChange={handleChange}
        includeAllOption={false}
        searchPlaceholder="Search RM"
        placeholder={
          loading
            ? 'Loading RMs...'
            : placeholder
        }
        disabled={
          disabled ||
          loading ||
          !canSelectRM
        }
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

export default RmDropdown