# app/routes/admin/__init__.py
from fastapi import APIRouter

from .auth_routes import router as auth_router
from .Loans.application_routes import router as application_router
from .employee_routes import router as employee_router
from .common_routes import router as common_router
from .state_routes import router as state_router
from .city_routes import router as city_router
from .context_routes import router as context_router
from .attendance_routes import router as attendance_router
from .phone_number_routes import router as phone_num_router

from app.routes.admin.bank_routes import router as bank_router
from app.routes.admin.dsa_routes import router as dsa_router
from app.routes.admin.banker_directory_routes import router as banker_directory_router

from .team_leads_routes import router as team_leads_router
from .agents_routes import router as agents_router
from .admins_routes import router as admins_router

from app.routes.admin.bank_routes import router as bank_router
from app.routes.admin.dsa_routes import router as dsa_router
from app.routes.admin.banker_directory_routes import router as banker_directory_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(application_router)
router.include_router(employee_router)
router.include_router(common_router)
router.include_router(state_router)
router.include_router(city_router)
router.include_router(context_router)
router.include_router(attendance_router)
router.include_router(phone_num_router)



router.include_router(team_leads_router)
router.include_router(agents_router)
router.include_router(admins_router)


router.include_router(bank_router)
router.include_router(dsa_router)
router.include_router(banker_directory_router)


