# backend/app/controllers/contexts_controller.py

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.schemas.contexts import (
    ContextCreate,
    ContextUpdate,
)

from app.services.contexts import (
    get_contexts,
    get_context_by_id,
    create_context,
    update_context,
    delete_context,
)


# ============================================================================
# Get All Contexts
# ============================================================================

def list_contexts(
    db: Session,
):
    """
    Get all roles/contexts.
    """

    return get_contexts(
        db=db,
    )


# ============================================================================
# Get Context By ID
# ============================================================================

def retrieve_context(
    db: Session,
    context_id: int,
):
    """
    Get a single role/context by ID.
    """

    context = get_context_by_id(
        db=db,
        context_id=context_id,
    )


    if context is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found.",
        )


    return context


# ============================================================================
# Create Context
# ============================================================================

def create_new_context(
    db: Session,
    context_data: ContextCreate,
):
    """
    Create a new role/context.
    """

    try:

        context = create_context(
            db=db,
            name=context_data.name,
            code=context_data.code,
            description=context_data.description,
            is_active=context_data.is_active,
        )


        return context


    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A role with the same name or code already exists.",
        )


# ============================================================================
# Update Context
# ============================================================================

def update_existing_context(
    db: Session,
    context_id: int,
    context_data: ContextUpdate,
):
    """
    Update an existing role/context.
    """

    context = get_context_by_id(
        db=db,
        context_id=context_id,
    )


    if context is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found.",
        )


    # Only fields explicitly supplied by the client
    # should be passed to the service.

    update_data = context_data.model_dump(
        exclude_unset=True,
    )


    try:

        context = update_context(
            db=db,
            context=context,
            name=update_data.get("name"),
            code=update_data.get("code"),
            description=update_data.get("description"),
            is_active=update_data.get("is_active"),
        )


        return context


    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A role with the same name or code already exists.",
        )


# ============================================================================
# Delete Context
# ============================================================================

def delete_existing_context(
    db: Session,
    context_id: int,
):
    """
    Delete an existing role/context.
    """

    context = get_context_by_id(
        db=db,
        context_id=context_id,
    )


    if context is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found.",
        )


    try:

        delete_context(
            db=db,
            context=context,
        )


        return {
            "message": "Role deleted successfully.",
        }


    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This role cannot be deleted because it is currently "
                "being used by another record."
            ),
        )