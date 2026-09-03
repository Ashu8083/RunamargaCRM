from app.config.database import SessionLocal

from app.seeders.permissions import seed_all as seed_permissions
from app.seeders.employee_rbac_seeder import seed as seed_employees


def main():
    db = SessionLocal()

    try:
        # Seed permissions first
        seed_permissions(
            db=db,
            admin_employee_id=1,
        )

        # Seed roles, employees, contexts,
        # employee_contexts and employee_context_permissions
        seed_employees()

        db.commit()

        print("RBAC seeding completed successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()