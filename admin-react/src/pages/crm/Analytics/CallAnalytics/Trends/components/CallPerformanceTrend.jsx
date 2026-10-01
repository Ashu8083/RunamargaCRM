// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/CallPerformanceTrend.jsx

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";

import AgentDropdown from "../../../../../../components/GlobalModels/Filters/AgentDropdown";
import RmDropdown from "../../../../../../components/GlobalModels/Filters/RmDropdown";
import TeamLeadDropdown from "../../../../../../components/GlobalModels/Filters/TeamLeadDropdown";

import fetchCallPerformanceTrend from "../api/CallPerformanceTrend";

// ============================================================
// CONSTANTS
// ============================================================

const GRAPH_HEIGHT = 340;
const MIN_GRAPH_WIDTH = 760;
const DAY_WIDTH = 115;

const SECTION_CLASS =
  "w-full min-w-0 overflow-visible rounded-xl border border-base-300 bg-base-100 shadow-sm";

const COLORS = {
  line: "#64748B",
  lineHover: "#475569",
  incoming: "#3B82F6",
  outgoing: "#8B5CF6",
  received: "#22C55E",
  missed: "#EF4444",
  unique: "#F59E0B",
};

// ============================================================
// VIEWS
// ============================================================

const VIEWS = [
  {
    key: "agent",
    tab: "Agent",
    plural: "agents",
    singular: "agent",
  },
  {
    key: "rm",
    tab: "RM",
    plural: "RMs",
    singular: "RM",
  },
];

const VIEW_META = Object.fromEntries(
  VIEWS.map((item) => [item.key, item]),
);

// ============================================================
// HELPERS
// ============================================================

const cn = (...classes) => classes.filter(Boolean).join(" ");

const createEmptyMetrics = () => ({
  total: 0,
  incoming: 0,
  outgoing: 0,
  received: 0,
  missed: 0,
  unique: 0,
});

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const toISODate = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const getToday = () => toISODate(new Date());

const addDays = (dateString, amount) => {
  const date = new Date(`${dateString}T00:00:00`);

  date.setDate(date.getDate() + amount);

  return toISODate(date);
};

const formatDateLabel = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatLongDateLabel = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDateRange = (fromDate, toDate) => {
  if (!fromDate || !toDate || fromDate > toDate) {
    return [];
  }

  const dates = [];

  const current = new Date(`${fromDate}T00:00:00`);

  const end = new Date(`${toDate}T00:00:00`);

  while (current <= end) {
    dates.push(toISODate(current));

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const getInclusiveDayCount = (fromDate, toDate) => {
  if (!fromDate || !toDate || fromDate > toDate) {
    return 0;
  }

  return getDateRange(fromDate, toDate).length;
};

// ============================================================
// CALL DATA HELPERS
// ============================================================

const getCallDate = (call) =>
  call?.callDate ||
  call?.date ||
  call?.createdAt?.slice(0, 10) ||
  call?.created_at?.slice(0, 10) ||
  "";

const getType = (call) =>
  normalize(
    call?.callType ||
      call?.call_type ||
      call?.type ||
      call?.direction,
  );

const getStatus = (call) =>
  normalize(
    call?.callStatus ||
      call?.call_status ||
      call?.status,
  );

const getEntityId = (call, view) => {
  if (view === "agent") {
    return (
      call?.agentId ??
      call?.agent_id ??
      call?.agentContextId ??
      call?.agent_context_id ??
      ""
    );
  }

  return (
    call?.rmId ??
    call?.rm_id ??
    call?.rmContextId ??
    call?.rm_context_id ??
    ""
  );
};

const getEntityName = (call, view) => {
  const id = getEntityId(call, view);

  if (view === "agent") {
    return (
      call?.agentName ||
      call?.agent_name ||
      `Agent ${id}`
    );
  }

  return (
    call?.rmName ||
    call?.rm_name ||
    `RM ${id}`
  );
};

const getSecondaryName = (call, view) => {
  if (view === "agent") {
    return (
      call?.rmName ||
      call?.rm_name ||
      ""
    );
  }

  return (
    call?.teamLeadName ||
    call?.team_lead_name ||
    ""
  );
};

// ============================================================
// CALL METRIC CALCULATION
// ============================================================

const applyCallToMetrics = (metrics, call) => {
  const type = getType(call);
  const status = getStatus(call);

  const isMissed =
    type === "missed" ||
    status === "missed";

  const isIncoming =
    type === "incoming" ||
    type === "received";

  const isOutgoing =
    type === "outgoing" ||
    type === "called";

  metrics.total += 1;

  if (isIncoming) {
    metrics.incoming += 1;
  }

  if (isOutgoing) {
    metrics.outgoing += 1;
  }

  if (isIncoming && !isMissed) {
    metrics.received += 1;
  }

  if (isMissed) {
    metrics.missed += 1;
  }

  if (
    call?.uniqueMissed === true ||
    call?.unique_missed === true ||
    call?.uniqueCall === true ||
    call?.unique_call === true ||
    call?.isUnique === true ||
    call?.is_unique === true
  ) {
    metrics.unique += 1;
  }
};

// ============================================================
// TREND MODEL
// ============================================================

const buildTrendModel = (calls, view, dates) => {
  const entityMap = {};
  const byDate = {};

  calls.forEach((call) => {
    const date = getCallDate(call);

    const entityId = getEntityId(call, view);

    if (
      !date ||
      entityId === "" ||
      entityId === null ||
      entityId === undefined
    ) {
      return;
    }

    const id = String(entityId);

    if (!entityMap[id]) {
      entityMap[id] = {
        id,
        name: getEntityName(call, view),
        secondaryName: getSecondaryName(call, view),
      };
    }

    if (!byDate[date]) {
      byDate[date] = {};
    }

    if (!byDate[date][id]) {
      byDate[date][id] = createEmptyMetrics();
    }

    applyCallToMetrics(
      byDate[date][id],
      call,
    );
  });

  const entities = Object.values(entityMap);

  const trendData = dates.map((date) => {
    const entityMetrics = byDate[date] || {};

    const summary = createEmptyMetrics();

    Object.values(entityMetrics).forEach(
      (metrics) => {
        summary.total += metrics.total;
        summary.incoming += metrics.incoming;
        summary.outgoing += metrics.outgoing;
        summary.received += metrics.received;
        summary.missed += metrics.missed;
        summary.unique += metrics.unique;
      },
    );

    return {
      date,
      metrics: entityMetrics,
      summary,
    };
  });

  const maxValue = Math.max(
    1,
    ...trendData.map((day) =>
      Number(day.summary.total || 0),
    ),
  );

  const yStep = Math.max(
    Math.ceil(maxValue / 5),
    1,
  );

  const yMax = yStep * 5;

  return {
    entities,
    trendData,
    yStep,
    yMax,
  };
};

// ============================================================
// DATE INPUT
// ============================================================

const DateInput = memo(function DateInput({
  label,
  value,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[10px] font-medium text-base-content/50">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="input input-bordered h-10 min-h-10 w-full min-w-0 text-xs"
      />
    </div>
  );
});

// ============================================================
// VIEW TABS
// ============================================================

const ViewTabs = memo(function ViewTabs({
  view,
  onChange,
}) {
  return (
    <div
      role="tablist"
      aria-label="Call activity view"
      className="flex shrink-0 rounded-lg border border-base-300 bg-base-200/40 p-1"
    >
      {VIEWS.map(({ key, tab }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={view === key}
          onClick={() => onChange(key)}
          className={cn(
            "rounded-md px-6 py-2 text-xs font-medium transition",
            view === key
              ? "bg-base-100 text-base-content shadow-sm"
              : "text-base-content/50 hover:text-base-content",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

// ============================================================
// TOOLTIP METRIC
// ============================================================

const TooltipMetric = memo(function TooltipMetric({
  label,
  value,
  color,
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span className="truncate text-[10px] text-base-content/55">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-[10px] font-semibold text-base-content">
        {formatNumber(value)}
      </span>
    </div>
  );
});

// ============================================================
// ENTITY TOOLTIP CARD
// ============================================================

const EntityTooltipCard = memo(function EntityTooltipCard({
  entity,
  metrics,
}) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-200/20 p-2.5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-base-content">
            {entity.name}
          </p>

          {entity.secondaryName && (
            <p className="truncate text-[8px] text-base-content/40">
              {entity.secondaryName}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-md bg-base-200 px-2 py-1 text-[9px] font-bold text-base-content">
          {formatNumber(metrics.total)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-5">
        <TooltipMetric
          label="Incoming"
          value={metrics.incoming}
          color={COLORS.incoming}
        />

        <TooltipMetric
          label="Outgoing"
          value={metrics.outgoing}
          color={COLORS.outgoing}
        />

        <TooltipMetric
          label="Received"
          value={metrics.received}
          color={COLORS.received}
        />

        <TooltipMetric
          label="Missed"
          value={metrics.missed}
          color={COLORS.missed}
        />

        <TooltipMetric
          label="Unique"
          value={metrics.unique}
          color={COLORS.unique}
        />
      </div>
    </div>
  );
});

// ============================================================
// DAY TOOLTIP
// ============================================================

const DayTooltip = memo(function DayTooltip({
  day,
  entities,
  view,
  index,
  totalDays,
}) {
  const activeEntities = entities
    .map((entity) => ({
      entity,
      metrics: day.metrics[entity.id],
    }))
    .filter(
      ({ metrics }) =>
        metrics && metrics.total > 0,
    );

  const isFirst = index === 0;
  const isLast = index === totalDays - 1;

  const horizontalClass = isFirst
    ? "left-0"
    : isLast
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-2 z-[100] w-[390px] max-w-[calc(100vw-40px)]",
        horizontalClass,
      )}
    >
      <div
        className="
          hidden
          max-h-[330px]
          overflow-hidden
          rounded-xl
          border
          border-base-300
          bg-base-100
          shadow-2xl
          group-hover:block
        "
      >
        {/* HEADER */}

        <div className="border-b border-base-300 px-3.5 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-base-content">
                {formatLongDateLabel(day.date)}
              </p>

              <p className="mt-0.5 text-[9px] text-base-content/40">
                Daily Call Activity
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold leading-none text-base-content">
                {formatNumber(day.summary.total)}
              </p>

              <p className="mt-1 text-[8px] text-base-content/40">
                Total Calls
              </p>
            </div>
          </div>
        </div>

        {/* DAILY SUMMARY */}

        <div className="border-b border-base-300 px-3.5 py-2.5">
          <div className="grid grid-cols-2 gap-x-6">
            <TooltipMetric
              label="Incoming"
              value={day.summary.incoming}
              color={COLORS.incoming}
            />

            <TooltipMetric
              label="Outgoing"
              value={day.summary.outgoing}
              color={COLORS.outgoing}
            />

            <TooltipMetric
              label="Received"
              value={day.summary.received}
              color={COLORS.received}
            />

            <TooltipMetric
              label="Missed"
              value={day.summary.missed}
              color={COLORS.missed}
            />

            <TooltipMetric
              label="Unique"
              value={day.summary.unique}
              color={COLORS.unique}
            />
          </div>
        </div>

        {/* ENTITY BREAKDOWN */}

        <div className="px-3.5 py-2.5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-base-content/40">
              {view === "agent"
                ? "Agent-wise"
                : "RM-wise"}
            </p>

            <span className="text-[8px] text-base-content/30">
              {activeEntities.length} active
            </span>
          </div>

          {activeEntities.length > 0 ? (
            <div
              className="
                max-h-[205px]
                space-y-2
                overflow-y-auto
                pr-1
                pointer-events-auto
              "
              onMouseEnter={(event) =>
                event.stopPropagation()
              }
            >
              {activeEntities.map(
                ({ entity, metrics }) => (
                  <EntityTooltipCard
                    key={entity.id}
                    entity={entity}
                    metrics={metrics}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-base-200/40 px-3 py-5 text-center text-[10px] text-base-content/40">
              No call activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ============================================================
// GRAPH LEGEND
// ============================================================

const GraphLegend = memo(function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: COLORS.line,
          }}
        />

        <span className="text-[10px] font-medium text-base-content/55">
          Total Calls
        </span>
      </div>

      <span className="text-[10px] text-base-content/35">
        Hover a point for detailed call metrics
      </span>
    </div>
  );
});

// ============================================================
// LINE CHART
// ============================================================

const TrendChart = memo(function TrendChart({
  dates,
  trendData,
  entities,
  yMax,
  yStep,
  view,
}) {
  const [hoveredIndex, setHoveredIndex] =
    useState(null);

  const graphWidth = Math.max(
    MIN_GRAPH_WIDTH,
    dates.length * DAY_WIDTH,
  );

  const chartWidth = graphWidth - 20;

  const chartHeight = GRAPH_HEIGHT;

  const paddingTop = 25;
  const paddingBottom = 35;

  const usableHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  const ticks = Array.from(
    {
      length: 6,
    },
    (_, index) =>
      yMax - index * yStep,
  );

  const getX = (index) => {
    if (dates.length === 1) {
      return chartWidth / 2;
    }

    return (
      10 +
      (index / (dates.length - 1)) *
        (chartWidth - 20)
    );
  };

  const getY = (value) => {
    const numericValue = Number(value || 0);

    const ratio =
      yMax > 0
        ? numericValue / yMax
        : 0;

    return (
      paddingTop +
      (1 - ratio) * usableHeight
    );
  };

  const points = trendData.map(
    (day, index) => ({
      x: getX(index),
      y: getY(day.summary.total),
      value: day.summary.total,
    }),
  );

  const linePoints = points
    .map(
      (point) =>
        `${point.x},${point.y}`,
    )
    .join(" ");

  const areaPoints = [
    `${points[0]?.x || 10},${chartHeight - paddingBottom}`,
    ...points.map(
      (point) =>
        `${point.x},${point.y}`,
    ),
    `${points[points.length - 1]?.x || chartWidth},${
      chartHeight - paddingBottom
    }`,
  ].join(" ");

  return (
    <div className="relative">
      {/* LEGEND */}

      <div className="mb-5">
        <GraphLegend />
      </div>

      {/* CHART SCROLL AREA */}

      <div className="overflow-x-auto overflow-y-visible pb-2">
        <div
          className="relative overflow-visible"
          style={{
            width: `${graphWidth}px`,
            minWidth: `${graphWidth}px`,
          }}
        >
          <div
            className="relative"
            style={{
              height: `${GRAPH_HEIGHT}px`,
            }}
          >
            {/* Y AXIS */}

            <div className="absolute bottom-0 left-0 top-0 w-10">
              <div className="flex h-full flex-col justify-between pb-[35px] pt-[25px] text-right text-[10px] text-base-content/35">
                {ticks.map((tick) => (
                  <span key={tick}>
                    {formatNumber(tick)}
                  </span>
                ))}
              </div>
            </div>

            {/* SVG GRAPH */}

            <svg
              width={chartWidth}
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="absolute left-[50px] top-0 overflow-visible"
              onMouseLeave={() =>
                setHoveredIndex(null)
              }
            >
              {/* GRID */}

              {ticks.map((tick, index) => {
                const y = getY(tick);

                return (
                  <line
                    key={tick}
                    x1="0"
                    x2={chartWidth}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    className="text-base-300"
                  />
                );
              })}

              {/* AREA */}

              {points.length > 1 && (
                <polygon
                  points={areaPoints}
                  fill={COLORS.line}
                  fillOpacity="0.035"
                />
              )}

              {/* LINE */}

              {points.length > 1 && (
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke={COLORS.line}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* POINTS */}

              {points.map((point, index) => {
                const isHovered =
                  hoveredIndex === index;

                return (
                  <g
                    key={dates[index]}
                    onMouseEnter={() =>
                      setHoveredIndex(index)
                    }
                    className="cursor-pointer"
                  >
                    {/* Invisible large hover area */}

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="15"
                      fill="transparent"
                    />

                    {/* Outer point */}

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHovered ? 7 : 5}
                      fill="white"
                      stroke={
                        isHovered
                          ? COLORS.lineHover
                          : COLORS.line
                      }
                      strokeWidth={
                        isHovered ? 4 : 3
                      }
                    />

                    {/* Inner point */}

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHovered ? 3 : 2}
                      fill={
                        isHovered
                          ? COLORS.lineHover
                          : COLORS.line
                      }
                    />

                    {/* VALUE */}

                    {point.value > 0 && (
                      <text
                        x={point.x}
                        y={point.y - 13}
                        textAnchor="middle"
                        className={cn(
                          "fill-current text-[10px] font-semibold",
                          isHovered
                            ? "text-base-content"
                            : "text-base-content/45",
                        )}
                      >
                        {formatNumber(
                          point.value,
                        )}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* HOVER TOOLTIP */}

            {trendData.map((day, index) => {
              if (hoveredIndex !== index) {
                return null;
              }

              const point =
                points[index];

              const tooltipLeft =
                point.x + 50;

              return (
                <div
                  key={`tooltip-${day.date}`}
                  className="pointer-events-none absolute inset-y-0 left-0"
                  style={{
                    width: `${graphWidth}px`,
                  }}
                >
                  <div
                    className="pointer-events-auto absolute top-0"
                    style={{
                      left: `${tooltipLeft}px`,
                    }}
                  >
                    <DayTooltip
                      day={day}
                      entities={entities}
                      view={view}
                      index={index}
                      totalDays={
                        trendData.length
                      }
                    />
                  </div>
                </div>
              );
            })}

            {/* X AXIS */}

            <div
              className="absolute bottom-0 left-[50px] flex"
              style={{
                width: `${chartWidth}px`,
              }}
            >
              {dates.map((date, index) => (
                <div
                  key={date}
                  className="relative shrink-0 text-center"
                  style={{
                    width:
                      dates.length === 1
                        ? `${chartWidth}px`
                        : `${chartWidth / (dates.length - 1)}px`,
                  }}
                >
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      hoveredIndex === index
                        ? "text-base-content"
                        : "text-base-content/45",
                    )}
                  >
                    {formatDateLabel(
                      date,
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = memo(function EmptyState({
  view,
}) {
  return (
    <div className="flex h-[340px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-base-200">
          <PhoneIcon className="h-5 w-5 text-base-content/30" />
        </div>

        <p className="text-sm font-medium text-base-content/60">
          No call activity
        </p>

        <p className="mt-1 text-xs text-base-content/40">
          Try changing the team lead,{" "}
          {VIEW_META[view].singular}, or date
          range.
        </p>
      </div>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================

function CallPerformanceTrend() {
  // ==========================================================
  // TODAY
  // ==========================================================

  const today = useMemo(
    () => getToday(),
    [],
  );

  // ==========================================================
  // DEFAULT 3-DAY RANGE
  // ==========================================================

  const defaultFromDate = useMemo(
    () => addDays(today, -2),
    [today],
  );

  // ==========================================================
  // VIEW
  // ==========================================================

  const [view, setView] =
    useState("agent");

  // ==========================================================
  // DATA
  // ==========================================================

  const [calls, setCalls] = useState([]);

  // ==========================================================
  // LOADING
  // ==========================================================

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [teamLead, setTeamLead] =
    useState("");

  const [agent, setAgent] =
    useState("");

  const [rm, setRm] =
    useState("");

  // DEFAULT:
  // LAST 3 DAYS INCLUDING TODAY
  //
  // Example:
  // Today      = 30 Sep
  // From       = 28 Sep
  // To         = 30 Sep
  //

  const [fromDate, setFromDate] =
    useState(defaultFromDate);

  const [toDate, setToDate] =
    useState(today);

  // ==========================================================
  // REQUEST CONTROL
  // ==========================================================

  const requestId = useRef(0);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = useCallback(
    async ({
      isRefresh = false,
    } = {}) => {
      const currentRequest =
        ++requestId.current;

      const isLatest = () =>
        currentRequest ===
        requestId.current;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await fetchCallPerformanceTrend({
            teamLeadId: teamLead,

            agentId:
              view === "agent"
                ? agent
                : "",

            rmId:
              view === "rm"
                ? rm
                : "",

            fromDate,
            toDate,
          });

        if (!isLatest()) {
          return;
        }

        setCalls(
          Array.isArray(response)
            ? response
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to load call performance trend:",
          error,
        );

        if (isLatest()) {
          setCalls([]);
        }
      } finally {
        if (isLatest()) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [
      teamLead,
      agent,
      rm,
      view,
      fromDate,
      toDate,
    ],
  );

  // ==========================================================
  // EFFECT
  // ==========================================================

  useEffect(() => {
    loadData();

    return () => {
      requestId.current += 1;
    };
  }, [loadData]);

  // ==========================================================
  // DATES
  // ==========================================================

  const dates = useMemo(
    () =>
      getDateRange(
        fromDate,
        toDate,
      ),
    [fromDate, toDate],
  );

  // ==========================================================
  // TREND MODEL
  // ==========================================================

  const {
    entities,
    trendData,
    yStep,
    yMax,
  } = useMemo(
    () =>
      buildTrendModel(
        calls,
        view,
        dates,
      ),
    [calls, view, dates],
  );

  // ==========================================================
  // META
  // ==========================================================

  const viewMeta =
    VIEW_META[view];

  const hasData =
    trendData.length > 0;

  const totalCalls = useMemo(
    () =>
      trendData.reduce(
        (total, day) =>
          total +
          Number(
            day.summary.total || 0,
          ),
        0,
      ),
    [trendData],
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset =
    useCallback(() => {
      setTeamLead("");
      setAgent("");
      setRm("");
      setFromDate(defaultFromDate);
      setToDate(today);
    }, [
      defaultFromDate,
      today,
    ]);

  // ==========================================================
  // VIEW CHANGE
  // ==========================================================

  const handleViewChange =
    useCallback((nextView) => {
      setView(nextView);
      setAgent("");
      setRm("");
    }, []);

  // ==========================================================
  // TEAM LEAD CHANGE
  // ==========================================================

  const handleTeamLeadChange =
    useCallback((value) => {
      setTeamLead(value);
      setAgent("");
      setRm("");
    }, []);

  // ==========================================================
  // FROM DATE CHANGE
  // MINIMUM 3 DAYS
  // ==========================================================

  const handleFromDateChange =
    useCallback(
      (nextFromDate) => {
        if (!nextFromDate) {
          return;
        }

        const minimumToDate =
          addDays(
            nextFromDate,
            2,
          );

        setFromDate(
          nextFromDate,
        );

        if (
          !toDate ||
          toDate <
            minimumToDate
        ) {
          setToDate(
            minimumToDate,
          );
        }
      },
      [toDate],
    );

  // ==========================================================
  // TO DATE CHANGE
  // MINIMUM 3 DAYS
  // ==========================================================

  const handleToDateChange =
    useCallback(
      (nextToDate) => {
        if (!nextToDate) {
          return;
        }

        const minimumFromDate =
          addDays(
            nextToDate,
            -2,
          );

        setToDate(
          nextToDate,
        );

        if (
          !fromDate ||
          fromDate >
            minimumFromDate
        ) {
          setFromDate(
            minimumFromDate,
          );
        }
      },
      [fromDate],
    );

  // ==========================================================
  // DATE RANGE VALIDATION
  // ==========================================================

  const selectedDayCount =
    getInclusiveDayCount(
      fromDate,
      toDate,
    );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section
        className={SECTION_CLASS}
        aria-busy="true"
      >
        <div className="space-y-4 p-5">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-base-200" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from(
              {
                length: 5,
              },
              (_, index) => (
                <div
                  key={index}
                  className="h-10 animate-pulse rounded-lg bg-base-200"
                />
              ),
            )}
          </div>

          <div className="h-[340px] animate-pulse rounded-xl bg-base-200/60" />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className={SECTION_CLASS}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 border-b border-base-300 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8BCF00]/10">
            <PhoneIcon className="h-5 w-5 text-[#6FA800]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-base-content">
              Call Activity Trend
            </h2>

            <p className="mt-0.5 text-xs text-base-content/45">
              Daily call activity with{" "}
              {view === "agent"
                ? "agent-wise"
                : "RM-wise"}{" "}
              breakdown.
            </p>
          </div>
        </div>

        <ViewTabs
          view={view}
          onChange={
            handleViewChange
          }
        />
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-3 border-b border-base-300 px-5 py-4 sm:grid-cols-2 lg:grid-cols-5">
        <TeamLeadDropdown
          label="Team Lead"
          value={teamLead}
          onChange={
            handleTeamLeadChange
          }
        />

        {view === "agent" ? (
          <AgentDropdown
            label="Agent"
            value={agent}
            teamLeadId={teamLead}
            onChange={setAgent}
          />
        ) : (
          <RmDropdown
            label="RM"
            value={rm}
            teamLeadId={teamLead}
            onChange={setRm}
          />
        )}

        <DateInput
          label="From"
          value={fromDate}
          onChange={
            handleFromDateChange
          }
        />

        <DateInput
          label="To"
          value={toDate}
          onChange={
            handleToDateChange
          }
        />

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={refreshing}
            className="
              h-10
              flex-1
              rounded-lg
              border
              border-base-300
              bg-base-100
              px-3
              text-xs
              font-medium
              text-base-content/60
              transition
              hover:bg-base-200
              hover:text-base-content
              disabled:opacity-60
            "
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() =>
              loadData({
                isRefresh: true,
              })
            }
            disabled={refreshing}
            className="
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#8BCF00]
              px-3
              text-xs
              font-medium
              text-white
              transition
              hover:bg-[#78B300]
              disabled:opacity-60
            "
          >
            <ArrowPathIcon
              className={cn(
                "h-4 w-4",
                refreshing &&
                  "animate-spin",
              )}
            />

            Refresh
          </button>
        </div>
      </div>

      {/* ======================================================
          FILTER INFORMATION
      ====================================================== */}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-base-300 px-5 py-2.5 text-[10px] text-base-content/45">
        <span>
          View:{" "}
          <b className="text-base-content/70">
            {viewMeta.tab}
          </b>
        </span>

        <span>
          Period:{" "}
          <b className="text-base-content/70">
            {formatDateLabel(
              fromDate,
            )}{" "}
            —{" "}
            {formatDateLabel(
              toDate,
            )}
          </b>
        </span>

        <span>
          {selectedDayCount} days
        </span>

        <span>
          Total calls:{" "}
          <b className="text-base-content/70">
            {formatNumber(
              totalCalls,
            )}
          </b>
        </span>

        <span className="text-base-content/35">
          Hover a point for detailed{" "}
          {viewMeta.singular} metrics
        </span>
      </div>

      {/* ======================================================
          GRAPH
      ====================================================== */}

      <div className="overflow-visible px-5 py-5">
        {hasData ? (
          <TrendChart
            dates={dates}
            trendData={trendData}
            entities={entities}
            yMax={yMax}
            yStep={yStep}
            view={view}
          />
        ) : (
          <EmptyState
            view={view}
          />
        )}
      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="flex items-center justify-center gap-1.5 border-t border-base-300 py-3 text-[10px] text-base-content/35">
        <CalendarDaysIcon className="h-3.5 w-3.5" />

        Call Activity
      </div>
    </section>
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default CallPerformanceTrend;