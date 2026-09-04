from sqlalchemy import select

from app.config.database import SessionLocal
from app.models.states import State
from app.models.cities import City


CITIES = {
    "Andhra Pradesh": [
        "Visakhapatnam",
        "Vijayawada",
        "Guntur",
        "Nellore",
        "Kurnool",
        "Rajahmundry",
        "Tirupati",
    ],

    "Arunachal Pradesh": [
        "Itanagar",
        "Naharlagun",
        "Tawang",
        "Pasighat",
    ],

    "Assam": [
        "Guwahati",
        "Dibrugarh",
        "Silchar",
        "Jorhat",
        "Nagaon",
    ],

    "Bihar": [
        "Patna",
        "Gaya",
        "Bhagalpur",
        "Muzaffarpur",
        "Darbhanga",
    ],

    "Chhattisgarh": [
        "Raipur",
        "Bhilai",
        "Bilaspur",
        "Korba",
        "Durg",
    ],

    "Goa": [
        "Panaji",
        "Vasco da Gama",
        "Margao",
        "Mapusa",
    ],

    "Gujarat": [
        "Ahmedabad",
        "Surat",
        "Vadodara",
        "Rajkot",
        "Bhavnagar",
        "Jamnagar",
        "Junagadh",
        "Gandhinagar",
    ],

    "Haryana": [
        "Gurugram",
        "Faridabad",
        "Panipat",
        "Ambala",
        "Hisar",
        "Rohtak",
        "Karnal",
    ],

    "Himachal Pradesh": [
        "Shimla",
        "Dharamshala",
        "Mandi",
        "Solan",
        "Kullu",
    ],

    "Jharkhand": [
        "Ranchi",
        "Jamshedpur",
        "Dhanbad",
        "Bokaro",
        "Deoghar",
    ],

    "Karnataka": [
        "Bengaluru",
        "Mysuru",
        "Mangaluru",
        "Hubballi",
        "Dharwad",
        "Belagavi",
        "Shivamogga",
        "Tumakuru",
        "Davangere",
        "Ballari",
        "Kalaburagi",
        "Udupi",
        "Hassan",
        "Mandya",
        "Raichur",
        "Vijayapura",
        "Chitradurga",
        "Kolar",
        "Chikkaballapur",
    ],

    "Kerala": [
        "Thiruvananthapuram",
        "Kochi",
        "Kozhikode",
        "Thrissur",
        "Kollam",
        "Kannur",
        "Alappuzha",
        "Kottayam",
        "Palakkad",
        "Malappuram",
    ],

    "Madhya Pradesh": [
        "Bhopal",
        "Indore",
        "Jabalpur",
        "Gwalior",
        "Ujjain",
        "Sagar",
        "Dewas",
        "Satna",
    ],

    "Maharashtra": [
        "Mumbai",
        "Pune",
        "Nagpur",
        "Nashik",
        "Thane",
        "Navi Mumbai",
        "Kolhapur",
        "Solapur",
        "Amravati",
        "Nanded",
    ],

    "Manipur": [
        "Imphal",
        "Thoubal",
        "Churachandpur",
    ],

    "Meghalaya": [
        "Shillong",
        "Tura",
        "Nongpoh",
    ],

    "Mizoram": [
        "Aizawl",
        "Lunglei",
        "Champhai",
    ],

    "Nagaland": [
        "Kohima",
        "Dimapur",
        "Mokokchung",
    ],

    "Odisha": [
        "Bhubaneswar",
        "Cuttack",
        "Rourkela",
        "Berhampur",
        "Sambalpur",
        "Puri",
    ],

    "Punjab": [
        "Amritsar",
        "Ludhiana",
        "Jalandhar",
        "Patiala",
        "Bathinda",
        "Mohali",
    ],

    "Rajasthan": [
        "Jaipur",
        "Jodhpur",
        "Udaipur",
        "Kota",
        "Ajmer",
        "Bikaner",
        "Alwar",
        "Bharatpur",
    ],

    "Sikkim": [
        "Gangtok",
        "Namchi",
        "Gyalshing",
    ],

    "Tamil Nadu": [
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Tiruchirappalli",
        "Salem",
        "Tirunelveli",
        "Erode",
        "Vellore",
        "Thoothukudi",
        "Dindigul",
        "Thanjavur",
        "Hosur",
    ],

    "Telangana": [
        "Hyderabad",
        "Warangal",
        "Nizamabad",
        "Karimnagar",
        "Khammam",
        "Ramagundam",
    ],

    "Tripura": [
        "Agartala",
        "Udaipur",
        "Dharmanagar",
    ],

    "Uttar Pradesh": [
        "Lucknow",
        "Kanpur",
        "Ghaziabad",
        "Agra",
        "Varanasi",
        "Prayagraj",
        "Meerut",
        "Bareilly",
        "Aligarh",
        "Moradabad",
        "Saharanpur",
        "Gorakhpur",
        "Noida",
    ],

    "Uttarakhand": [
        "Dehradun",
        "Haridwar",
        "Rishikesh",
        "Haldwani",
        "Nainital",
        "Roorkee",
    ],

    "West Bengal": [
        "Kolkata",
        "Howrah",
        "Durgapur",
        "Asansol",
        "Siliguri",
        "Darjeeling",
    ],
}


def seed_cities():
    db = SessionLocal()

    try:
        created_count = 0
        skipped_count = 0
        missing_state_count = 0

        for state_name, city_names in CITIES.items():

            # Find the state from the states table
            state = db.scalar(
                select(State).where(
                    State.name == state_name,
                    State.deleted_at.is_(None),
                )
            )

            if not state:
                print(
                    f"[ERROR] State not found: {state_name}"
                )
                missing_state_count += 1
                continue

            print()
            print(f"Processing {state_name}")

            for city_name in city_names:

                # Check if this city already exists
                # under this particular state.
                existing_city = db.scalar(
                    select(City).where(
                        City.name == city_name,
                        City.state_id == state.id,
                        City.deleted_at.is_(None),
                    )
                )

                if existing_city:
                    skipped_count += 1
                    print(f"    [SKIP] {city_name}")
                    continue

                city = City(
                    name=city_name,
                    state_id=state.id,
                )

                db.add(city)

                created_count += 1

                print(f"    [CREATE] {city_name}")

        db.commit()

        print()
        print("=" * 60)
        print("CITY SEEDER COMPLETED")
        print("=" * 60)
        print(f"Created        : {created_count}")
        print(f"Skipped        : {skipped_count}")
        print(f"Missing states : {missing_state_count}")
        print("=" * 60)

    except Exception as e:
        db.rollback()

        print()
        print("=" * 60)
        print("CITY SEEDER FAILED")
        print("=" * 60)
        print(f"Error: {e}")
        print("=" * 60)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_cities()