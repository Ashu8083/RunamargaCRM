from sqlalchemy import Column, Integer, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base


class AdminPermission(Base):
    __tablename__ = "admin_permissions"

    id = Column(Integer, primary_key=True, index=True)

    admin_id = Column(
        Integer,
        ForeignKey("admins.id", ondelete="CASCADE"),
        nullable=False,
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id", ondelete="CASCADE"),
        nullable=False,
    )

    permission_id = Column(
        Integer,
        ForeignKey("permissions.id", ondelete="CASCADE"),
        nullable=False,
    )

    status = Column(
        Enum(
            "allow",
            "deny",
            name="permission_status_enum",
        ),
        nullable=False,
        default="allow",
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    admin = relationship(
        "Admin",
        backref="admin_permissions",
        lazy="joined",
    )

    role = relationship(
        "Role",
        lazy="joined",
    )

    permission = relationship(
        "Permission",
        lazy="joined",
    )