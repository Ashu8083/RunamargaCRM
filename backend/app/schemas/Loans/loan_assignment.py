# backend/app/schemas/Loans/loan_assignment.py

from pydantic import BaseModel

from app.models.loan_assignments import LoanAssignmentStatus


# ============================================================================
# LOAN ASSIGNMENT TOGGLE REQUEST
# ============================================================================
#
# employee_context_id and loan_type_id come from the URL:
#
#     /loans-assignment/{employee_context_id}/{loan_type_id}
#
# Therefore only status is required in the request body.
#
# ============================================================================

class LoanAssignmentToggleRequest(BaseModel):
    status: LoanAssignmentStatus


# ============================================================================
# LOAN ASSIGNMENT AGENT RESPONSE
# ============================================================================

class LoanAssignmentAgentResponse(BaseModel):
    employee_context_id: int
    employee_id: int
    name: str
    assigned: bool


# ============================================================================
# LOAN ASSIGNMENT LOAN TYPE RESPONSE
# ============================================================================

class LoanAssignmentLoanTypeResponse(BaseModel):
    id: int
    name: str
    permission: str | None
    agents: list[LoanAssignmentAgentResponse]