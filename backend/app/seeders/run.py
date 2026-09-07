# backend/app/seeders/run.py

from app.seeders.permissions import seed as seed_permissions
from app.seeders.employee_rbac_seeder import seed as seed_employee_rbac


def main():

    print("=" * 60)
    print("Starting RBAC seed")
    print("=" * 60)

    # --------------------------------------------------------
    # 1. Base RBAC
    #    Roles
    #    Permissions
    #    Contexts
    # --------------------------------------------------------

    print()
    print("Step 1: Seeding roles, permissions and contexts...")

    seed_permissions()

    # --------------------------------------------------------
    # 2. Employee RBAC
    #    Employees
    #    Employee contexts
    #    Employee-context permissions
    # --------------------------------------------------------

    print()
    print("Step 2: Seeding employees and RBAC assignments...")

    seed_employee_rbac()

    # --------------------------------------------------------
    # Complete
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("RBAC seed completed successfully.")
    print("=" * 60)


if __name__ == "__main__":
    main()