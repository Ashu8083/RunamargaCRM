# backend/app/routes/admin/context_routes.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.config.database import get_db

from app.controllers.contexts_controller import (
    list_contexts,
    retrieve_context,
    create_new_context,
    update_existing_context,
    delete_existing_context,
)

from app.schemas.contexts import (
    ContextCreate,
    ContextResponse,
    ContextUpdate,
)


router = APIRouter(
    prefix="/contexts",
    tags=["Contexts"],
)


# ============================================================================
# GET /contexts
# ============================================================================

@router.get(
    "",
    response_model=list[ContextResponse],
    status_code=status.HTTP_200_OK,
)
def get_all_contexts(
    db: Session = Depends(get_db),
):
    """
    Get all roles/contexts.
    """

    return list_contexts(
        db=db,
    )


# ============================================================================
# GET /contexts/{context_id}
# ============================================================================

@router.get(
    "/{context_id}",
    response_model=ContextResponse,
    status_code=status.HTTP_200_OK,
)
def get_context(
    context_id: int,
    db: Session = Depends(get_db),
):
    """
    Get one role/context by ID.
    """

    return retrieve_context(
        db=db,
        context_id=context_id,
    )


# ============================================================================
# POST /contexts
# ============================================================================

@router.post(
    "",
    response_model=ContextResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_context(
    context_data: ContextCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new role/context.
    """

    return create_new_context(
        db=db,
        context_data=context_data,
    )


# ============================================================================
# PATCH /contexts/{context_id}
# ============================================================================

@router.patch(
    "/{context_id}",
    response_model=ContextResponse,
    status_code=status.HTTP_200_OK,
)
def update_context(
    context_id: int,
    context_data: ContextUpdate,
    db: Session = Depends(get_db),
):
    """
    Partially update a role/context.
    """

    return update_existing_context(
        db=db,
        context_id=context_id,
        context_data=context_data,
    )


# ============================================================================
# DELETE /contexts/{context_id}
# ============================================================================

@router.delete(
    "/{context_id}",
    status_code=status.HTTP_200_OK,
)
def delete_context(
    context_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a role/context.
    """

    return delete_existing_context(
        db=db,
        context_id=context_id,
    )