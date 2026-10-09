// admin-react/src/pages/Analytics/CallAnalytics/Trends/index.jsx

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AdNumberCallTrend from './components/AdNumberCallTrend'
import RmCallTrend from './components/CallPerformanceTrend'
import TeamCallTrend from './components/TeamCallTrend'
import DailyCallTrend from './components/DailyCallTrend'
import MonthlyCallTrend from './components/MonthlyCallTrend'

// =============================================================
// PAGE
// =============================================================
//
// This page is only the parent/container for Call Analytics
// Trends.
//
// Responsibilities:
// - Connect all trend components
// - Keep the page layout
// - Keep the page header
// - Keep the refresh button
//
// No:
// - Mock data
// - API calls
// - Filters
// - Loading state
// - Data processing
//
// Individual trend components can handle their own logic.
// =============================================================

function Trends() {
  return (
    <div
      className="
        w-full
        max-w-full
        space-y-5
        overflow-x-hidden
        p-4
        sm:p-6
      "
    >



      {/* =====================================================
          1. AD NUMBER CALL ANALYTICS
      ===================================================== */}

      <AdNumberCallTrend />


      {/* =====================================================
          2. CALL PERFORMANCE
      ===================================================== */}

      <RmCallTrend />


      {/* =====================================================
          3. TEAM LEAD CALL PERFORMANCE
      ===================================================== */}

      {/* <TeamCallTrend /> */}


      {/* =====================================================
          4. DAILY CALL TREND
      ===================================================== */}

      <DailyCallTrend />


      {/* =====================================================
          5. MONTHLY CALL OVERVIEW
      ===================================================== */}

      <MonthlyCallTrend />

    </div>
  )
}

export default Trends