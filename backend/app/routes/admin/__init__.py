# app/routes/admin/__init__.py
from fastapi import APIRouter

# Auth and Common
from .auth_routes import router as auth_router
from .Loans.application_routes import router as application_router
from .Loans.edit_application_routes import router as edit_application_router
from .employee_routes import router as employee_router
from .common_routes import router as common_router
from .state_routes import router as state_router
from .city_routes import router as city_router
from .Loans.team_chat import router as team_chat_router
from .common_routes import router as common_router
from .state_routes import router as state_router
from .city_routes import router as city_router

# Roles and Teams
from .context_routes import router as context_router
from .team_leads_routes import router as team_leads_router
from .agents_routes import router as agents_router
from .admins_routes import router as admins_router

# Loan Management
from .Loans.application_routes import router as application_router
from .Loans.shuffle_loans_routes import router as shuffle_loans_router


from app.routes.admin.bank_routes import router as bank_router
from app.routes.admin.dsa_routes import router as dsa_router
from app.routes.admin.banker_directory_routes import router as banker_directory_router
from .team_leads_routes import router as team_leads_router
from .agents_routes import router as agents_router
from .Loans.duplicate_approval_routes import router as duplicate_approval_router

# Banks and DSA Directory
from app.routes.admin.bank_routes import router as bank_router
from app.routes.admin.dsa_routes import router as dsa_router
from app.routes.admin.banker_directory_routes import router as banker_directory_router

# Employee Management
from .employee_routes import router as employee_router
from .attendance_routes import router as attendance_router

# Face Enrollment
from .employee_management.face_enrollment_routes import router as face_enrollment_router
from .employee_management.attendance_routes import router as attendance_router

# Call Management
from .phone_number_routes import router as phone_num_router
from .CallManagement.call_logs import router as call_logs_router
from .CallManagement.call_assignments import router as call_assignment_router


router = APIRouter()

# Auth and Common
router.include_router(auth_router)
router.include_router(application_router)
router.include_router(edit_application_router)
router.include_router(employee_router)
router.include_router(common_router)
router.include_router(state_router)
router.include_router(city_router)

# Roles and Teams
router.include_router(context_router)
router.include_router(team_leads_router)
router.include_router(agents_router)
router.include_router(admins_router)

# Loan Management
router.include_router(application_router)
router.include_router(shuffle_loans_router)

# Call Management
router.include_router(phone_num_router)

# Banks and DSA Directory
router.include_router(bank_router)
router.include_router(dsa_router)
router.include_router(banker_directory_router)
router.include_router(team_leads_router)
router.include_router(agents_router)
router.include_router(duplicate_approval_router)
router.include_router(team_chat_router)

# Employee Management
router.include_router(employee_router)
router.include_router(attendance_router)

# Face Enrollment
router.include_router(face_enrollment_router)
router.include_router(attendance_router)

# Call Management
router.include_router(call_logs_router)
router.include_router(call_assignment_router)
