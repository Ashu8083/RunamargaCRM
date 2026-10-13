# backend/app/schemas/CallAnalytics/Trends/call_performance_trend_schema.py

# =============================================================
# Performance SUMMARY
# =============================================================

class CallAnalyticsPerformanceTrendSummary(BaseModel):
    total: int = 0
    received: int = 0
    called: int = 0
    missed: int = 0
    unique: int = 0
