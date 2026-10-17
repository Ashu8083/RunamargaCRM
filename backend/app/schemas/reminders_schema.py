# backend/app/schemas/reminders_schema.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# CREATE REMINDER
# ============================================================

class ReminderCreateSchema(BaseModel):
    application_id: int = Field(
        ...,
        gt=0,
    )

    reminder_at: datetime

    note: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


# ============================================================
# REMINDER STATUS
# ============================================================

class ReminderStatusSchema(BaseModel):
    status: str


# ============================================================
# REMINDER RESPONSE
# ============================================================

class ReminderResponseSchema(BaseModel):
    id: int

    employee_id: int

    application_id: int

    reminder_at: datetime

    note: str

    status: str

    completed_at: datetime | None = None

    created_at: datetime

    updated_at: datetime

    deleted_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# REMINDER LIST RESPONSE
# ============================================================

class ReminderListResponseSchema(BaseModel):
    items: list[ReminderResponseSchema]

    total: int


# ============================================================
# NEW - REMINDER MANAGEMENT EMPLOYEE
# ============================================================

class ReminderManagementEmployeeSchema(BaseModel):
    id: int

    name: str

    employee_code: str | None = None

    phone: str | None = None


# ============================================================
# NEW - REMINDER MANAGEMENT APPLICATION
# ============================================================

class ReminderManagementApplicationSchema(BaseModel):
    id: int

    unique_id: str | None = None

    name: str | None = None

    phone: str | None = None


# ============================================================
# NEW - REMINDER MANAGEMENT ITEM
# ============================================================

class ReminderManagementItemSchema(BaseModel):
    id: int

    employee: ReminderManagementEmployeeSchema

    application: ReminderManagementApplicationSchema

    reminder_at: datetime

    note: str

    status: str

    completed_at: datetime | None = None

    created_at: datetime

    updated_at: datetime | None = None


# ============================================================
# NEW - REMINDER MANAGEMENT PAGINATION
# ============================================================

class ReminderManagementPaginationSchema(BaseModel):
    page: int

    page_size: int

    total: int

    total_pages: int

    has_next: bool

    has_previous: bool


# ============================================================
# NEW - REMINDER MANAGEMENT RESPONSE
# ============================================================

class ReminderManagementResponseSchema(BaseModel):
    items: list[ReminderManagementItemSchema]

    pagination: ReminderManagementPaginationSchema


# ============================================================
# NOTIFICATION RESPONSE
# ============================================================

class ReminderNotificationSchema(BaseModel):
    id: int

    application_id: int

    reminder_at: datetime

    note: str

    status: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# NOTIFICATION LIST RESPONSE
# ============================================================

class ReminderNotificationListSchema(BaseModel):
    items: list[ReminderNotificationSchema]

    total: int

    unread_count: int