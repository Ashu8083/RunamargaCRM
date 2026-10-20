// admin-react/src/context/CommonDataContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import apiClient from '../app/apiClient'
import { getActiveContext } from '../app/auth'

const CommonDataContext = createContext(null)

export const CommonDataProvider = ({ children }) => {
  const [activeContext, setActiveContext] = useState(
    () => getActiveContext()
  )

  // ---------------------------------------------------------
  // COMPLETED DATA CACHE
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // LOAN TYPES CACHE
  // ---------------------------------------------------------

  const loanTypesCache = useRef(new Map())

  // ---------------------------------------------------------
  // LOAN TYPES REQUESTS CURRENTLY RUNNING
  // ---------------------------------------------------------

  const loanTypesInFlight = useRef(new Map())

  // ---------------------------------------------------------
  // LOAN TYPES LOADING / ERROR STATE
  // ---------------------------------------------------------

  const [loadingLoanTypes, setLoadingLoanTypes] = useState(false)

  const [loanTypesError, setLoanTypesError] = useState('')
  const agentsCache = useRef(new Map())
  const rmsCache = useRef(new Map())

  // ---------------------------------------------------------
  // REQUESTS CURRENTLY RUNNING
  // ---------------------------------------------------------

  const agentsInFlight = useRef(new Map())
  const rmsInFlight = useRef(new Map())

  // ---------------------------------------------------------
  // UI LOADING / ERROR STATE
  // ---------------------------------------------------------

  const [loadingAgents, setLoadingAgents] = useState(false)
  const [loadingRms, setLoadingRms] = useState(false)

  const [agentsError, setAgentsError] = useState('')
  const [rmsError, setRmsError] = useState('')

  // ---------------------------------------------------------
  // ACTIVE CONTEXT CHANGES
  // ---------------------------------------------------------

  useEffect(() => {
    const handleAuthChanged = () => {
      const currentContext = getActiveContext()

      setActiveContext(currentContext)

      /*
       * Important:
       *
       * Data is scoped by context anyway.
       * Clearing here also prevents old context data
       * from hanging around unnecessarily.
       */

      agentsCache.current.clear()
      rmsCache.current.clear()

      agentsInFlight.current.clear()
      rmsInFlight.current.clear()
      loanTypesCache.current.clear()
      loanTypesInFlight.current.clear()

      setLoanTypesError('')
      setAgentsError('')
      setRmsError('')
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

  // ---------------------------------------------------------
  // CACHE KEY
  // ---------------------------------------------------------

  const getCacheKey = (teamLeadContextId = null) => {
    return [
      activeContext?.id ?? 'none',
      teamLeadContextId ?? 'none',
    ].join(':')
  }

  // =========================================================
  // AGENTS
  // =========================================================

  const getAgents = useCallback(async (
    teamLeadContextId = null
  ) => {
    if (!activeContext?.id) {
      return []
    }

    const cacheKey = getCacheKey(teamLeadContextId)

    // -------------------------------------------------------
    // 1. RETURN COMPLETED CACHE
    // -------------------------------------------------------

    if (agentsCache.current.has(cacheKey)) {
      return agentsCache.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 2. RETURN EXISTING REQUEST
    // -------------------------------------------------------

    if (agentsInFlight.current.has(cacheKey)) {
      return agentsInFlight.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 3. CREATE NEW REQUEST
    // -------------------------------------------------------

    const params = {
      context_id: activeContext.id,
    }

    if (
      teamLeadContextId !== null &&
      teamLeadContextId !== undefined &&
      teamLeadContextId !== ''
    ) {
      params.team_lead_context_id =
        teamLeadContextId
    }

    setLoadingAgents(true)
    setAgentsError('')

    const request = apiClient({
      method: 'GET',
      url: '/common/agents',
      params,
    })
      .then((response) => {
        const data = response.data

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

        // Save completed result
        agentsCache.current.set(
          cacheKey,
          formattedAgents
        )

        return formattedAgents
      })
      .catch((error) => {
        console.error(
          'Failed to fetch agents:',
          error
        )

        setAgentsError(
          'Unable to load agents.'
        )

        throw error
      })
      .finally(() => {
        // Remove from in-flight requests
        agentsInFlight.current.delete(cacheKey)

        setLoadingAgents(false)
      })

    // -------------------------------------------------------
    // Store request immediately
    // -------------------------------------------------------

    agentsInFlight.current.set(
      cacheKey,
      request
    )

    return request
  }, [activeContext?.id])

  // =========================================================
  // RMS
  // =========================================================

  const getRms = useCallback(async (
    teamLeadContextId = null
  ) => {
    if (!activeContext?.id) {
      return []
    }

    const cacheKey = getCacheKey(teamLeadContextId)

    // -------------------------------------------------------
    // 1. RETURN COMPLETED CACHE
    // -------------------------------------------------------

    if (rmsCache.current.has(cacheKey)) {
      return rmsCache.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 2. RETURN EXISTING REQUEST
    // -------------------------------------------------------

    if (rmsInFlight.current.has(cacheKey)) {
      return rmsInFlight.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 3. CREATE NEW REQUEST
    // -------------------------------------------------------

    const params = {
      context_id: activeContext.id,
    }

    if (
      teamLeadContextId !== null &&
      teamLeadContextId !== undefined &&
      teamLeadContextId !== ''
    ) {
      params.team_lead_context_id =
        teamLeadContextId
    }

    setLoadingRms(true)
    setRmsError('')

    const request = apiClient({
      method: 'GET',
      url: '/common/rms',
      params,
    })
      .then((response) => {
        const data = response.data

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

        // Save completed result
        rmsCache.current.set(
          cacheKey,
          formattedRms
        )

        return formattedRms
      })
      .catch((error) => {
        console.error(
          'Failed to fetch RMs:',
          error
        )

        setRmsError(
          'Unable to load RMs.'
        )

        throw error
      })
      .finally(() => {
        // Remove from in-flight requests
        rmsInFlight.current.delete(cacheKey)

        setLoadingRms(false)
      })

    // -------------------------------------------------------
    // Store request immediately
    // -------------------------------------------------------

    rmsInFlight.current.set(
      cacheKey,
      request
    )

    return request
  }, [activeContext?.id])
  // =========================================================
  // LOAN TYPES
  // =========================================================

  const getLoanTypes = useCallback(async () => {
    if (!activeContext?.id) {
      return []
    }

    const cacheKey = String(activeContext.id)

    // -------------------------------------------------------
    // 1. RETURN COMPLETED CACHE
    // -------------------------------------------------------

    if (loanTypesCache.current.has(cacheKey)) {
      return loanTypesCache.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 2. RETURN EXISTING REQUEST
    // -------------------------------------------------------

    if (loanTypesInFlight.current.has(cacheKey)) {
      return loanTypesInFlight.current.get(cacheKey)
    }

    // -------------------------------------------------------
    // 3. CREATE NEW REQUEST
    // -------------------------------------------------------

    setLoadingLoanTypes(true)
    setLoanTypesError('')

    const request = apiClient({
      method: 'GET',
      url: '/common/loan-types',
      params: {
        context_id: activeContext.id,
      },
    })
      .then((response) => {
        const data = response.data

        const formattedLoanTypes = Array.isArray(data)
          ? data
            .filter(
              (loanType) =>
                loanType &&
                loanType.id !== undefined &&
                loanType.id !== null &&
                loanType.name
            )
            .map((loanType) => ({
              id: Number(loanType.id),
              name: loanType.name,
            }))
          : []

        // Save completed result
        loanTypesCache.current.set(
          cacheKey,
          formattedLoanTypes
        )

        return formattedLoanTypes
      })
      .catch((error) => {
        console.error(
          'Failed to fetch loan types:',
          error
        )

        setLoanTypesError(
          'Unable to load loan types.'
        )

        throw error
      })
      .finally(() => {
        loanTypesInFlight.current.delete(cacheKey)

        setLoadingLoanTypes(false)
      })

    // -------------------------------------------------------
    // STORE REQUEST IMMEDIATELY
    // -------------------------------------------------------

    loanTypesInFlight.current.set(
      cacheKey,
      request
    )

    return request
  }, [activeContext?.id])
  // =========================================================
  // CLEAR CACHE
  // =========================================================
  const clearCommonDataCache = () => {
    agentsCache.current.clear()
    rmsCache.current.clear()
    loanTypesCache.current.clear()

    agentsInFlight.current.clear()
    rmsInFlight.current.clear()
    loanTypesInFlight.current.clear()

    setAgentsError('')
    setRmsError('')
    setLoanTypesError('')
  }

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <CommonDataContext.Provider
      value={{
        activeContext,

        getAgents,
        getRms,
        getLoanTypes,

        loadingAgents,
        loadingRms,
        loadingLoanTypes,

        agentsError,
        rmsError,
        loanTypesError,

        clearCommonDataCache,
      }}
    >
      {children}
    </CommonDataContext.Provider>
  )
}

// ===========================================================
// HOOK
// ===========================================================

export const useCommonData = () => {
  const context = useContext(
    CommonDataContext
  )

  if (!context) {
    throw new Error(
      'useCommonData must be used inside CommonDataProvider'
    )
  }

  return context
}


export const useActiveContext = () => {
  const { activeContext } = useCommonData();

  return {
    activeContext,
    contextId: activeContext?.id ?? null,
  };
};