
# backend/app/schemas/holiday_schema.py

from datetime import date as DateType, datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


class HolidayCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    date: DateType
    description: str | None = None
    is_active: bool = True

    @model_validator(mode="after")
    def validate_name(self):
        self.name = self.name.strip()

        if not self.name:
            raise ValueError("Holiday name cannot be empty")

        return self


class HolidayUpdateRequest(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=150)
    date: DateType
    description: str | None = None
    is_active: bool = True

    @model_validator(mode="after")
    def validate_name(self):
        self.name = self.name.strip()

        if not self.name:
            raise ValueError("Holiday name cannot be empty")

        return self


class HolidayFilterRequest(BaseModel):
    # Filter by an exact date
    date: DateType | None = None

    # Filter by a date range
    start_date: DateType | None = None
    end_date: DateType | None = None

    # Filter by month using YYYY-MM format
    month: str | None = Field(
        default=None,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$",
    )

    # Filter by holiday name
    name: str | None = None

    # Defaults to active holidays
    is_active: bool | None = True


class HolidayResponse(BaseModel):
    id: int
    name: str
    date: DateType
    description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
