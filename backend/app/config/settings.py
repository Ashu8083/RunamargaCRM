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


settings = Settings()