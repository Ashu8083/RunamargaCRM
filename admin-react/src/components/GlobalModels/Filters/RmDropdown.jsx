// admin-react/src/components/GlobalModels/Filters/RmDropdown.jsx

import {
  useEffect,
  useMemo,
  useRef,
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
  const autoSelectedContextKeys = useRef(new Set())
  const loadedOptionsKey = useRef(null)

  // Check RM view permission
  const canSelectRM = hasPermission(
    PERMISSIONS.RM_VIEW
  )

  // Load RMs from the shared data provider
  useEffect(() => {
    let isMounted = true
    const optionsKey = [
      activeContext?.id ?? 'none',
      teamLeadContextId ?? 'none',
    ].join(':')

    loadedOptionsKey.current = null

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
        loadedOptionsKey.current = optionsKey
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

  // Automatically select the logged-in user's RM EmployeeContext once
  // when it is present in the loaded options. Parent values always win.
  useEffect(() => {
    const activeContextCode = String(
      activeContext?.code || ''
    ).trim().toUpperCase()

    const isRmContext =
      activeContextCode === 'RM' ||
      activeContextCode.startsWith('RM_')

    const hasParentValue =
      value !== '' &&
      value !== null &&
      value !== undefined

    const selectionKey = [
      activeContext?.id,
      teamLeadContextId ?? 'none',
    ].join(':')

    if (
      !isRmContext ||
      activeContext?.id === undefined ||
      activeContext?.id === null ||
      hasParentValue ||
      loading ||
      disabled ||
      !canSelectRM ||
      loadedOptionsKey.current !== selectionKey
    ) {
      return
    }

    if (autoSelectedContextKeys.current.has(selectionKey)) {
      return
    }

    autoSelectedContextKeys.current.add(selectionKey)

    const loggedInRm = rms.find(
      (rm) =>
        String(rm.id) ===
        String(activeContext.id)
    )

    if (!loggedInRm) {
      return
    }

    if (typeof onChange === 'function') {
      onChange(
        loggedInRm.id,
        loggedInRm
      )
    }
  }, [
    activeContext?.code,
    activeContext?.id,
    canSelectRM,
    disabled,
    loading,
    onChange,
    rms,
    teamLeadContextId,
    value,
  ])

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
