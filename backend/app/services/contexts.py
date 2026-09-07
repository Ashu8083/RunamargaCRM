# backend/app/services/contexts.py
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contexts import Context

# ============================================================================
# Get All Contexts
# ============================================================================


def get_contexts(db: Session) -> list[Context]:
    """
    Return all contexts ordered by ID.

    The current Context model does not contain a deleted/deleted_at field,
    so only existing context records are returned.
    """

    statement = (
        select(Context)
        .where(Context.code.notin_(("GLOBAL", "AGENT", "RM")))
        .order_by(Context.id.asc())
    )

    return list(db.scalars(statement).all())


# ============================================================================
# Get Context By ID
# ============================================================================


def get_context_by_id(
    db: Session,
    context_id: int,
) -> Context | None:
    """
    Find a single context by ID.
    """

    statement = select(Context).where(Context.id == context_id)

    return db.scalar(statement)


# ============================================================================
# Get Context By Code
# ============================================================================


def get_context_by_code(
    db: Session,
    code: str,
) -> Context | None:
    """
    Find a context by its unique code.

    Code comparison is normalized to uppercase.
    """

    normalized_code = code.strip().upper()

    statement = select(Context).where(Context.code == normalized_code)

    return db.scalar(statement)


# ============================================================================
# Get Context By Name
# ============================================================================


def get_context_by_name(
    db: Session,
    name: str,
) -> Context | None:
    """
    Find a context by name.

    Name comparison is case-insensitive.
    """

    normalized_name = name.strip()

    statement = select(Context).where(Context.name.ilike(normalized_name))

    return db.scalar(statement)


# ============================================================================
# Create Context
# ============================================================================


def create_context(
    db: Session,
    name: str,
    code: str,
    description: str | None = None,
    is_active: bool = True,
) -> Context:
    """
    Create a new context.

    Frontend terminology:
        Role

    Backend terminology:
        Context
    """

    normalized_name = name.strip()

    normalized_code = code.strip().upper()

    normalized_description = description.strip() if description else None

    # ------------------------------------------------------------------------
    # Duplicate Code Check
    # ------------------------------------------------------------------------

    existing_code = get_context_by_code(
        db=db,
        code=normalized_code,
    )

    if existing_code:
        raise ValueError(f'A role with code "{normalized_code}" already exists.')

    # ------------------------------------------------------------------------
    # Duplicate Name Check
    # ------------------------------------------------------------------------

    existing_name = get_context_by_name(
        db=db,
        name=normalized_name,
    )

    if existing_name:
        raise ValueError(f'A role with name "{normalized_name}" already exists.')

    # ------------------------------------------------------------------------
    # Create Context
    # ------------------------------------------------------------------------

    context = Context(
        name=normalized_name,
        code=normalized_code,
        description=normalized_description,
        is_active=bool(is_active),
    )

    db.add(context)

    db.commit()

    db.refresh(context)

    return context


# ============================================================================
# Update Context
# ============================================================================


def update_context(
    db: Session,
    context: Context,
    name: str | None = None,
    code: str | None = None,
    description: str | None = None,
    is_active: bool | None = None,
) -> Context:
    """
    Update an existing context.

    Only fields supplied by the caller are changed.
    """

    # ------------------------------------------------------------------------
    # Name
    # ------------------------------------------------------------------------

    if name is not None:

        normalized_name = name.strip()

        if not normalized_name:
            raise ValueError("Role name cannot be empty.")

        statement = select(Context).where(
            Context.name.ilike(normalized_name),
            Context.id != context.id,
        )

        existing_name = db.scalar(statement)

        if existing_name:
            raise ValueError(f'A role with name "{normalized_name}" already exists.')

        context.name = normalized_name

    # ------------------------------------------------------------------------
    # Code
    # ------------------------------------------------------------------------

    if code is not None:

        normalized_code = code.strip().upper()

        statement = select(Context).where(
            Context.code == normalized_code,
            Context.id != context.id,
        )

        existing_code = db.scalar(statement)

        if existing_code:
            raise ValueError(f'A role with code "{normalized_code}" already exists.')

        context.code = normalized_code

    # ------------------------------------------------------------------------
    # Description
    # ------------------------------------------------------------------------

    if description is not None:

        normalized_description = description.strip()

        context.description = normalized_description if normalized_description else None

    # ------------------------------------------------------------------------
    # Active Status
    # ------------------------------------------------------------------------

    if is_active is not None:

        context.is_active = bool(is_active)

    # ------------------------------------------------------------------------
    # Save
    # ------------------------------------------------------------------------

    db.commit()

    db.refresh(context)

    return context


# ============================================================================
# Delete Context
# ============================================================================


def delete_context(
    db: Session,
    context: Context,
) -> bool:
    """
    Permanently delete a context.

    IMPORTANT:
    The current Context model does not contain deleted/deleted_at fields.

    Therefore this performs a real database DELETE.
    """

    db.delete(context)

    db.commit()

    return True


# ============================================================================
# Activate Context
# ============================================================================


def activate_context(
    db: Session,
    context: Context,
) -> Context:
    """
    Activate a context.
    """

    context.is_active = True

    db.commit()

    db.refresh(context)

    return context


# ============================================================================
# Deactivate Context
# ============================================================================


def deactivate_context(
    db: Session,
    context: Context,
) -> Context:
    """
    Deactivate a context.
    """

    context.is_active = False

    db.commit()

    db.refresh(context)

    return context
