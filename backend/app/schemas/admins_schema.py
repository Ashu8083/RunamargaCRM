# app/schemas/admins_schema.py

from pydantic import BaseModel, Field


# ============================================================================
# CREATE ADMIN
# ============================================================================
#
# Creates an Admin EmployeeContext.
#
# employee_id:
#     employees.id
#
# context:
#     ALWAYS resolved by backend using:
#
#         contexts.code == "GLOBAL"
#
# The frontend does NOT send context_id.
#
# status:
#     Active / Inactive
#
# ============================================================================

class AdminCreate(BaseModel):

    employee_id: int = Field(
        ...,
        gt=0,
    )

    status: str = "Active"


# ============================================================================
# UPDATE ADMIN
# ============================================================================
#
# Admin role is fixed.
#
# The GLOBAL context cannot be changed.
#
# Employee cannot be changed.
#
# Therefore the Admin edit operation does not accept employee_id
# or context_id.
#
# Any editable Admin-specific fields can be added here later without
# changing the Admin identity/context relationship.
#
# ============================================================================

class AdminUpdate(BaseModel):
    pass


# ============================================================================
# UPDATE ADMIN STATUS
# ============================================================================
#
# Allowed values:
#
#     Active
#     Inactive
#
# Backend converts this into:
#
#     is_active = True / False
#
# ============================================================================

class AdminStatusUpdate(BaseModel):

    status: str