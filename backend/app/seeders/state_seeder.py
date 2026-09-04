from sqlalchemy import select

from app.config.database import SessionLocal
from app.models.states import State


STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
]


def seed_states():
    db = SessionLocal()

    try:
        created_count = 0
        skipped_count = 0

        for state_name in STATES:

            existing_state = db.scalar(
                select(State).where(
                    State.name == state_name,
                    State.deleted_at.is_(None),
                )
            )

            if existing_state:
                skipped_count += 1
                print(f"[SKIP] State already exists: {state_name}")
                continue

            state = State(
                name=state_name
            )

            db.add(state)
            created_count += 1

            print(f"[CREATE] State: {state_name}")

        db.commit()

        print()
        print("=" * 60)
        print("STATE SEEDER COMPLETED")
        print("=" * 60)
        print(f"Created : {created_count}")
        print(f"Skipped : {skipped_count}")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print()
        print("=" * 60)
        print("STATE SEEDER FAILED")
        print("=" * 60)
        print(f"Error: {e}")
        print("=" * 60)
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_states()