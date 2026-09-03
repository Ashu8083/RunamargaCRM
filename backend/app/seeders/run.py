# app/seeders/run.py
from app.config.database import SessionLocal

from app.seeders.permissions import seed_all as seed_permissions
from app.seeders.employees import seed_all as seed_employees


def main():
    db = SessionLocal()

    try:
        # Seed permissions first
        seed_permissions(
            db=db,
            admin_employee_id=1,
        )

        # Seed roles, employees, contexts,
        # employee_contexts and permissions
        seed_employees(
            db=db,
        )

        db.commit()

        print("RBAC seeding completed successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()