# backend/app/services/shuffle_loans_service.py

from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, aliased

from app.models.loan_applications import LoanApplication
from app.models.employees import Employee
from app.models.loan_types import LoanType


class ShuffleLoansService:

    # =========================================================
    # GET SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        search: Optional[str] = None,
        agent_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,
    ):
        Agent = aliased(Employee)
        RM = aliased(Employee)

        query = (
            db.query(
                LoanApplication,
                Agent.name.label("agent_name"),
                RM.name.label("rm_name"),
                LoanType.name.label("loan_type"),
            )
            .outerjoin(
                Agent,
                Agent.id == LoanApplication.agent_id,
            )
            .outerjoin(
                RM,
                RM.id == LoanApplication.rm_id,
            )
            .outerjoin(
                LoanType,
                LoanType.id == LoanApplication.loan_type_id,
            )
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        # =====================================================
        # SEARCH
        # =====================================================

        if search and search.strip():

            value = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    LoanApplication.name.ilike(value),
                    LoanApplication.phone.ilike(value),
                    LoanApplication.email.ilike(value),
                    LoanApplication.unique_id.ilike(value),
                    Agent.name.ilike(value),
                    RM.name.ilike(value),
                    LoanType.name.ilike(value),
                )
            )

        # =====================================================
        # AGENT FILTER
        # =====================================================

        if agent_id is not None:

            query = query.filter(
                LoanApplication.agent_id == agent_id
            )

        # =====================================================
        # RM FILTER
        # =====================================================

        if rm_id is not None:

            query = query.filter(
                LoanApplication.rm_id == rm_id
            )

        # =====================================================
        # LOAN TYPE FILTER
        # =====================================================

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id == loan_type_id
            )

        # =====================================================
        # STATUS FILTER
        # =====================================================

        if status:

            query = query.filter(
                LoanApplication.status == status
            )

        # =====================================================
        # ORDER
        # =====================================================

        query = query.order_by(
            LoanApplication.id.desc()
        )

        rows = query.all()

        return [
            ShuffleLoansService._format_application(
                application,
                agent_name,
                rm_name,
                loan_type,
            )
            for (
                application,
                agent_name,
                rm_name,
                loan_type,
            ) in rows
        ]


    # =========================================================
    # ASSIGN / SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def assign_shuffle_loans(
        db: Session,
        application_ids: list[int],
        agent_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
    ):
        # =====================================================
        # VALIDATION
        # =====================================================

        if not application_ids:
            raise ValueError(
                "At least one application must be selected."
            )

        if (
            agent_id is None
            and rm_id is None
            and loan_type_id is None
        ):
            raise ValueError(
                "Select at least one value to update."
            )

        # =====================================================
        # VALIDATE AGENT
        # =====================================================

        if agent_id is not None:

            agent = (
                db.query(Employee)
                .filter(
                    Employee.id == agent_id,
                    Employee.deleted_at.is_(None),
                )
                .first()
            )

            if not agent:
                raise ValueError(
                    "Selected Agent was not found."
                )

        # =====================================================
        # VALIDATE RM
        # =====================================================

        if rm_id is not None:

            rm = (
                db.query(Employee)
                .filter(
                    Employee.id == rm_id,
                    Employee.deleted_at.is_(None),
                )
                .first()
            )

            if not rm:
                raise ValueError(
                    "Selected RM was not found."
                )

        # =====================================================
        # VALIDATE LOAN TYPE
        # =====================================================

        if loan_type_id is not None:

            loan_type = (
                db.query(LoanType)
                .filter(
                    LoanType.id == loan_type_id
                )
                .first()
            )

            if not loan_type:
                raise ValueError(
                    "Selected Loan Type was not found."
                )

        # =====================================================
        # FETCH APPLICATIONS
        # =====================================================

        applications = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.id.in_(
                    application_ids
                ),
                LoanApplication.deleted_at.is_(None),
            )
            .all()
        )

        if not applications:
            raise ValueError(
                "No valid loan applications were found."
            )

        # =====================================================
        # ENSURE ALL REQUESTED IDS EXIST
        # =====================================================

        found_ids = {
            application.id
            for application in applications
        }

        missing_ids = [
            application_id
            for application_id in application_ids
            if application_id not in found_ids
        ]

        if missing_ids:
            raise ValueError(
                "Some selected applications were not found."
            )

        # =====================================================
        # PARTIAL UPDATE
        # =====================================================
        #
        # IMPORTANT:
        #
        # Only a field that is NOT None is changed.
        #
        # None means:
        # "User did not select this field."
        #
        # It does NOT mean:
        # "Set this database column to NULL."
        #
        # =====================================================

        for application in applications:

            if agent_id is not None:
                application.agent_id = agent_id

            if rm_id is not None:
                application.rm_id = rm_id

            if loan_type_id is not None:
                application.loan_type_id = loan_type_id

        # =====================================================
        # SAVE
        # =====================================================

        db.commit()

        # =====================================================
        # RETURN UPDATED DATA
        # =====================================================

        return ShuffleLoansService.get_shuffle_loans_by_ids(
            db=db,
            application_ids=application_ids,
        )


    # =========================================================
    # GET UPDATED APPLICATIONS
    # =========================================================

    @staticmethod
    def get_shuffle_loans_by_ids(
        db: Session,
        application_ids: list[int],
    ):

        Agent = aliased(Employee)
        RM = aliased(Employee)

        rows = (
            db.query(
                LoanApplication,
                Agent.name.label("agent_name"),
                RM.name.label("rm_name"),
                LoanType.name.label("loan_type"),
            )
            .outerjoin(
                Agent,
                Agent.id == LoanApplication.agent_id,
            )
            .outerjoin(
                RM,
                RM.id == LoanApplication.rm_id,
            )
            .outerjoin(
                LoanType,
                LoanType.id == LoanApplication.loan_type_id,
            )
            .filter(
                LoanApplication.id.in_(
                    application_ids
                ),
                LoanApplication.deleted_at.is_(None),
            )
            .order_by(
                LoanApplication.id.desc()
            )
            .all()
        )

        return [
            ShuffleLoansService._format_application(
                application,
                agent_name,
                rm_name,
                loan_type,
            )
            for (
                application,
                agent_name,
                rm_name,
                loan_type,
            ) in rows
        ]


    # =========================================================
    # FORMAT APPLICATION
    # =========================================================

    @staticmethod
    def _format_application(
        application,
        agent_name,
        rm_name,
        loan_type,
    ):

        status = (
            application.status.value
            if application.status
            else None
        )

        return {
            "id": application.id,
            "loanId": application.unique_id,
            "unique_id": application.unique_id,

            "name": application.name,
            "email": application.email,
            "phone": application.phone,

            "loanType": loan_type,
            "loan_type": loan_type,
            "loan_type_id": application.loan_type_id,

            "amount": (
                float(application.loan_amt)
                if application.loan_amt is not None
                else None
            ),
            "loan_amt": (
                float(application.loan_amt)
                if application.loan_amt is not None
                else None
            ),

            "agentId": application.agent_id,
            "agent_id": application.agent_id,
            "agentName": agent_name,
            "agent_name": agent_name,

            "rmId": application.rm_id,
            "rm_id": application.rm_id,
            "rmName": rm_name,
            "rm_name": rm_name,

            "status": status,

            "appliedDate": (
                application.applied_date.isoformat()
                if application.applied_date
                else None
            ),

            "applied_date": (
                application.applied_date.isoformat()
                if application.applied_date
                else None
            ),

            "created_at": (
                application.created_at.isoformat()
                if application.created_at
                else None
            ),

            "updated_at": (
                application.updated_at.isoformat()
                if application.updated_at
                else None
            ),
        }