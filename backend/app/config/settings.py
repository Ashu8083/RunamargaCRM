import os

from dotenv import load_dotenv

load_dotenv()


class Settings:

    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_PORT = os.getenv("DATABASE_PORT")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    DATABASE_USER = os.getenv("DATABASE_USER")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

    RESEND_API_KEY = os.getenv("RESEND_API_KEY")

    MAIL_FROM_ADDRESS = os.getenv(
        "MAIL_FROM_ADDRESS",
        "noreply@runamarga.com",
    )

    MAIL_FROM_NAME = os.getenv(
        "MAIL_FROM_NAME",
        "Runamarga Team",
    )

    # ----------------------------------------------------------------
    # Office Geofence
    # Update the values in .env with your actual office coordinates.
    # OFFICE_RADIUS_METERS = maximum allowed distance from office (meters)
    # ----------------------------------------------------------------
    OFFICE_LATITUDE: float = float(
        os.getenv("OFFICE_LATITUDE", "18.5204")
    )
    OFFICE_LONGITUDE: float = float(
        os.getenv("OFFICE_LONGITUDE", "73.8567")
    )
    OFFICE_RADIUS_METERS: float = float(
        os.getenv("OFFICE_RADIUS_METERS", "200")
    )


settings = Settings()