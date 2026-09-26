# app/routes/admin/__init__.py

from fastapi import APIRouter


# ============================================================================
# AUTH AND COMMON
# ============================================================================

from .auth_routes import router as auth_router
from .common_routes import router as common_router
from .state_routes import router as state_router
from .city_routes import router as city_router


# ============================================================================
# LOAN MANAGEMENT
# ============================================================================

from .Loans.application_routes import router as application_router
from .Loans.edit_application_routes import router as edit_application_router
from .Loans.shuffle_loans_routes import router as shuffle_loans_router
from .Loans.duplicate_approval_routes import router as duplicate_approval_router
from .Loans.team_chat import router as team_chat_router
from .Loans.loan_assignment_routes import router as loan_assignment_router


# ============================================================================
# ROLES AND TEAMS
# ============================================================================
from .context_routes import router as context_router
from .team_leads_routes import router as team_leads_router
from .agents_routes import router as agents_router
from .admins_routes import router as admins_router



from app.routes.admin.bank_routes import router as bank_router
from app.routes.admin.dsa_routes import router as dsa_router
from app.routes.admin.banker_directory_routes import router as banker_directory_router

from .Loans.duplicate_approval_routes import router as duplicate_approval_router
from .Loans.reverted_loans_routes import router as reverted_loans_router

# ============================================================================
# CALL MANAGEMENT
# ============================================================================

from .phone_number_routes import router as phone_num_router
from .CallManagement.call_logs import router as call_logs_router
from .CallManagement.call_assignments import router as call_assignment_router

# ============================================================================
# Dashboard
# ============================================================================
from .Dashboard.application_status import router as application_status_router
from .Dashboard.loan_type_distribution_routes import router as loan_type_distribution_router
from .Dashboard.monthly_trend_routes import router as monthly_trend_router
from .Dashboard.application_funnel_routes import router as application_funnel_router
from .Dashboard.application_status_applications_routes import (
    router as application_status_applications_router,
)

# ============================================================================
# BANKS AND DSA DIRECTORY
# ============================================================================
from .bank_routes import router as bank_router
from .dsa_routes import router as dsa_router
from .banker_directory_routes import router as banker_directory_router


# ============================================================================
# EMPLOYEE MANAGEMENT
# ============================================================================
from .employee_routes import router as employee_router
from .employee_management.attendance_routes import router as employement_management_attendance_router


# ============================================================================
# My Attendance
# ============================================================================
from .attendance_routes import router as attendance_router

# Face Enrollment
from .employee_management.face_enrollment_routes import router as face_enrollment_router
from .employee_management.attendance_routes import router as attendance_router


# ============================================================================
# EMPLOYEE MANAGEMENT - FACE ENROLLMENT
# ============================================================================

from .employee_management.face_enrollment_routes import (
    router as face_enrollment_router,
)


# ============================================================================
# CALL MANAGEMENT
# ============================================================================

from .phone_number_routes import router as phone_number_router
from .CallManagement.call_logs import router as call_logs_router
from .CallManagement.call_assignments import (
    router as call_assignment_router,
)

# ============================================================================
# CALL Analytics
# ============================================================================
from .CallAnalytics.overview_routes import router as call_analytics_overview_router
from .CallAnalytics.performance_routes import router as call_analytics_performance_router
from .CallAnalytics.Trends.ad_number_trend_routes import router as call_analytics_trends_ad_number_trend_router

# ============================================================================
# Agent Analytics
# ============================================================================
from .AgentAnalytics.overview_routes import router as agent_analytics_overview

# ============================================================================
# Application Filter
# ============================================================================
from app.routes.admin.ApplicationFilter.application_filter_routes import (
    router as application_filter_router,
)

# ============================================================================
# MAIN ADMIN ROUTER
# ============================================================================

router = APIRouter()


# ============================================================================
# AUTH AND COMMON
# ============================================================================

router.include_router(auth_router)
router.include_router(common_router)
router.include_router(state_router)
router.include_router(city_router)


# ============================================================================
# LOAN MANAGEMENT
# ============================================================================

router.include_router(application_router)
router.include_router(edit_application_router)
router.include_router(shuffle_loans_router)
router.include_router(duplicate_approval_router)
router.include_router(team_chat_router)
router.include_router(loan_assignment_router)
router.include_router(reverted_loans_router)

# ============================================================================
# ROLES AND TEAMS
# ============================================================================

router.include_router(context_router)
router.include_router(team_leads_router)
router.include_router(agents_router)
router.include_router(admins_router)


# ============================================================================
# BANKS / BANKERS / DSA DIRECTORY
# ============================================================================

router.include_router(bank_router)
router.include_router(dsa_router)
router.include_router(banker_directory_router)


# ============================================================================
# EMPLOYEE MANAGEMENT
# ============================================================================
router.include_router(employee_router)
router.include_router(employement_management_attendance_router)

# ============================================================================
# My Attendance
# ============================================================================
router.include_router(attendance_router)


# Call Management
router.include_router(call_logs_router)
router.include_router(call_assignment_router)
# ============================================================================
# FACE ENROLLMENT
# ============================================================================
router.include_router(face_enrollment_router)


# ============================================================================
# CALL MANAGEMENT
# ============================================================================
router.include_router(phone_number_router)
router.include_router(call_logs_router)
router.include_router(call_assignment_router)

# ============================================================================
# CALL Analytics
# ============================================================================
router.include_router(call_analytics_overview_router)
router.include_router(call_analytics_performance_router)
router.include_router(call_analytics_trends_ad_number_trend_router)

# ============================================================================
# Agent Analytics
# ============================================================================
router.include_router(agent_analytics_overview)

# ============================================================================
# Dashboard 
# ============================================================================

router.include_router(application_status_router)
router.include_router(loan_type_distribution_router)
router.include_router(monthly_trend_router)
router.include_router(application_funnel_router)
router.include_router(application_status_applications_router)

# ============================================================================
# Application Filter 
# ============================================================================

router.include_router(
    application_filter_router
)