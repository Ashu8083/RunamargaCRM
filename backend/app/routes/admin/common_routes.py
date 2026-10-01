# backend\app\routes\admin\common_routes.py
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config.database import get_db
from app.core.security import get_current_employee
from app.core.access_control import AccessControl
from app.models.roles import Role
from app.models.bank import Bank
from app.models.permissions import Permission
from app.models.states import State
from app.models.cities import City
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.employee_context_permissions import EmployeeContextPermission


router = APIRouter(
    prefix="/common",
    tags=["Common"],
)


# ============================================================================
# GET /common/roles
# ============================================================================

@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
):
    return (
        db.query(Role)
        .order_by(Role.id)
        .all()
    )


# ============================================================================
# GET /common/permissions
# ============================================================================

@router.get("/permissions")
def get_permissions(
    db: Session = Depends(get_db),
):
    return (
        db.query(Permission)
        .filter(Permission.is_active.is_(True))
        .order_by(Permission.id)
        .all()
    )


# ============================================================================
# GET /common/loan-types
# ============================================================================

@router.get("/loan-types")
def get_loan_types(
    db: Session = Depends(get_db),
):
    return (
        db.query(LoanType)
        .filter(LoanType.status == "active")
        .order_by(LoanType.id)
        .all()
    )


# ============================================================================
# GET /common/employees
# ============================================================================

@router.get("/employees")
def get_common_employees(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    employees = (
        db.query(Employee)
        .filter(Employee.status == "active")
        .order_by(Employee.name)
        .all()
    )

    return [
        {
            "id": emp.id,
            "name": emp.name,
        }
        for emp in employees
    ]


# ============================================================================
# GET /common/agent-roles
# ============================================================================

@router.get("/agent-roles")
def get_agent_roles(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    agent_roles = (
        db.query(Context)
        .filter(
            Context.is_active.is_(True),
            (
                (Context.code == "AGENT")
                | (Context.code.like("AGENT_%"))
            ),
        )
        .order_by(Context.name.asc())
        .all()
    )

    return [
        {
            "name": context.name,
            "value": context.id,
        }
        for context in agent_roles
    ]


# ============================================================================
# GET /common/team-lead-roles
# ============================================================================

@router.get("/team-lead-roles")
def get_teamlead_roles(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    teamlead_roles = (
        db.query(Context)
        .filter(
            Context.is_active.is_(True),
            (
                (Context.code == "TEAMLEAD")
                | (Context.code.like("TEAMLEAD_%"))
            ),
        )
        .order_by(Context.name.asc())
        .all()
    )

    return [
        {
            "name": context.name,
            "value": context.id,
        }
        for context in teamlead_roles
    ]


# ============================================================================
# EMPLOYEE CONTEXT PERMISSIONS
# ============================================================================

class EmployeeContextPermissionsUpdate(BaseModel):
    employee_id: int
    context_id: int
    permission_ids: list[int] = Field(default_factory=list)


# ============================================================================
# GET /common/employee-context-permissions
# ============================================================================

@router.get("/employee-context-permissions")
def get_employee_context_permissions(
    employee_id: int = Query(...),
    context_id: int = Query(...),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    target_employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not target_employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found.",
        )

    target_context = (
        db.query(Context)
        .filter(
            Context.id == context_id,
            Context.is_active.is_(True),
        )
        .first()
    )

    if not target_context:
        raise HTTPException(
            status_code=404,
            detail="Context not found.",
        )

    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.context_id == context_id,
            EmployeeContext.is_active.is_(True),
        )
        .first()
    )

    assigned_permission_ids = set()

    if employee_context:
        assigned_permission_ids = {
            row.permission_id
            for row in (
                db.query(
                    EmployeeContextPermission.permission_id
                )
                .filter(
                    EmployeeContextPermission.employee_context_id
                    == employee_context.id
                )
                .all()
            )
        }

    permissions = (
        db.query(Permission)
        .filter(Permission.is_active.is_(True))
        .order_by(Permission.id.asc())
        .all()
    )

    response = []

    for permission in permissions:
        description = getattr(
            permission,
            "description",
            None,
        )

        category = (
            "common"
            if description
            and str(description).strip().lower() == "common"
            else "business"
        )

        response.append(
            {
                "id": permission.id,
                "name": permission.name,
                "code": getattr(permission, "code", None),
                "description": description,
                "category": category,
                "is_assigned": permission.id in assigned_permission_ids,
            }
        )

    response.sort(
        key=lambda item: (
            0 if item["category"] == "common" else 1,
            item["id"],
        )
    )

    return response


# ============================================================================
# PUT /common/employee-context-permissions
# ============================================================================

@router.put("/employee-context-permissions")
def update_employee_context_permissions(
    payload: EmployeeContextPermissionsUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    employee_id = payload.employee_id
    context_id = payload.context_id
    permission_ids = set(payload.permission_ids)

    target_employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not target_employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found.",
        )

    target_context = (
        db.query(Context)
        .filter(
            Context.id == context_id,
            Context.is_active.is_(True),
        )
        .first()
    )

    if not target_context:
        raise HTTPException(
            status_code=404,
            detail="Context not found.",
        )

    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.context_id == context_id,
            EmployeeContext.is_active.is_(True),
        )
        .first()
    )

    if not employee_context:
        raise HTTPException(
            status_code=404,
            detail="Employee is not assigned to the selected context.",
        )

    if permission_ids:
        valid_permission_ids = {
            permission.id
            for permission in (
                db.query(Permission.id)
                .filter(
                    Permission.id.in_(permission_ids),
                    Permission.is_active.is_(True),
                )
                .all()
            )
        }

        invalid_ids = permission_ids - valid_permission_ids

        if invalid_ids:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "One or more permissions are invalid.",
                    "permission_ids": sorted(invalid_ids),
                },
            )

    existing_rows = (
        db.query(EmployeeContextPermission)
        .filter(
            EmployeeContextPermission.employee_context_id
            == employee_context.id
        )
        .all()
    )

    existing_ids = {
        row.permission_id
        for row in existing_rows
    }

    for row in existing_rows:
        if row.permission_id not in permission_ids:
            db.delete(row)

    for permission_id in permission_ids - existing_ids:
        db.add(
            EmployeeContextPermission(
                employee_context_id=employee_context.id,
                permission_id=permission_id,
            )
        )

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to update employee context permissions.",
        )

    final_rows = (
        db.query(EmployeeContextPermission)
        .join(
            Permission,
            Permission.id == EmployeeContextPermission.permission_id,
        )
        .filter(
            EmployeeContextPermission.employee_context_id
            == employee_context.id,
            Permission.is_active.is_(True),
        )
        .order_by(Permission.id.asc())
        .all()
    )

    return {
        "employee_id": employee_id,
        "context_id": context_id,
        "employee_context_id": employee_context.id,
        "permission_ids": [
            row.permission_id
            for row in final_rows
        ],
        "permissions": [
            {
                "id": row.permission.id,
                "name": row.permission.name,
                "code": getattr(row.permission, "code", None),
                "description": getattr(
                    row.permission,
                    "description",
                    None,
                ),
                "category": (
                    "common"
                    if getattr(row.permission, "description", None)
                    and str(row.permission.description).strip().lower()
                    == "common"
                    else "business"
                ),
                "is_assigned": True,
            }
            for row in final_rows
        ],
    }


# ============================================================================
# DELETE /common/employee-context-permissions
# ============================================================================

@router.delete("/employee-context-permissions")
def delete_employee_context_permission(
    employee_id: int = Query(...),
    context_id: int = Query(...),
    permission_id: int = Query(...),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.context_id == context_id,
            EmployeeContext.is_active.is_(True),
        )
        .first()
    )

    if not employee_context:
        raise HTTPException(
            status_code=404,
            detail="Employee is not assigned to the selected context.",
        )

    permission_row = (
        db.query(EmployeeContextPermission)
        .filter(
            EmployeeContextPermission.employee_context_id
            == employee_context.id,
            EmployeeContextPermission.permission_id
            == permission_id,
        )
        .first()
    )

    if not permission_row:
        raise HTTPException(
            status_code=404,
            detail="Permission assignment not found.",
        )

    try:
        db.delete(permission_row)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to remove employee context permission.",
        )

    return {
        "message": "Permission removed successfully.",
        "employee_id": employee_id,
        "context_id": context_id,
        "permission_id": permission_id,
    }
# ============================================================================
# GET /common/rms
# ============================================================================

@router.get("/rms")
def get_rms(
    context_id: int | None = Query(default=None),
    team_lead_context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return [
            {
                "id": rm_context.id,
                "name": rm_context.employee.name,
            }
            for rm_context in rms
        ]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load RMs.",
        ) from exc


# ============================================================================
# GET /common/agents
# ============================================================================

@router.get("/agents")
def get_agents(
    context_id: int | None = Query(default=None),
    team_lead_context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )
        return [
            {
                "id": agent_context.id,
                "name": agent_context.employee.name,
            }
            for agent_context in agents
        ]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load agents.",
        ) from exc
   
# ============================================================================
# GET /common/team-leads
# ============================================================================
@router.get("/team-leads")
def get_team_leads(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        team_leads = AccessControl.get_visible_team_leads(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return [
            {
                "id": team_lead.id,
                "name": team_lead.employee.name,
            }
            for team_lead in team_leads
        ]

    except Exception as exc:
        print("TEAM LEADS ERROR:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc
# ============================================================================
# GET /common/states
# ============================================================================

@router.get("/states")
def get_states(
    db: Session = Depends(get_db),
):
    return (
        db.query(State)
        .filter(
            State.deleted_at.is_(None)
        )
        .order_by(State.id)
        .all()
    )


# ============================================================================
# GET /common/cities
# ============================================================================

@router.get("/cities")
def get_cities(
    state_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):

    query = (
        db.query(City)
        .filter(
            City.deleted_at.is_(None)
        )
    )

    if state_id is not None:

        query = query.filter(
            City.state_id == state_id
        )

    return (
        query
        .order_by(City.id)
        .all()
    )


# ============================================================================
# GET /common/banks
# ============================================================================

@router.get("/banks")
def get_banks(
    db: Session = Depends(get_db),
):
    return (
        db.query(Bank)
         .filter(
            Bank.deleted_at.is_(None),
            Bank.is_active == True
        )
        .order_by(Bank.id)
        .all()
    )

