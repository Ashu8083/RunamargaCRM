# app/schemas/team_lead_schema.py

from pydantic import BaseModel, Field


# ============================================================================
# CREATE TEAM LEAD
# ============================================================================

class TeamLeadCreate(BaseModel):
    employee_id: int = Field(..., gt=0)
    context_id: int = Field(..., gt=0)

    # Frontend uses:
    # Active / Inactive
    #
    # Backend converts this to:
    # True / False
    status: str = "Active"


# ============================================================================
# UPDATE TEAM LEAD
# ============================================================================
#
# Employee cannot be changed.
# Status cannot be changed through the edit API.
#
# Only the Team Lead role/context can be changed.
#
# ============================================================================

class TeamLeadUpdate(BaseModel):
    context_id: int = Field(..., gt=0)


# ============================================================================
# UPDATE TEAM LEAD STATUS
# ============================================================================
#
# Dedicated API for the Active / Inactive control in the table.
#
# Frontend sends:
#
# {
#     "status": "Active"
# }
#
# or
#
# {
#     "status": "Inactive"
# }
#
# Backend converts this to:
#
# Active   -> is_active = True
# Inactive -> is_active = False
#
# ============================================================================

class TeamLeadStatusUpdate(BaseModel):
    status: str