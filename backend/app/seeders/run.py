# backend\app\seeders\run.py
from app.config.database import SessionLocal
from app.seeders.permissions import seed_all


def main():
    db = SessionLocal()

    try:
        seed_all(
            db=db,
            admin_employee_id=1,
        )

        print("RBAC seeding completed successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()