from datetime import date, time

from database import SessionLocal
from models import Doctor, Patient, Appointment


db = SessionLocal()


# Synthetic doctors
doctors = [
    Doctor(
        name="Dr. Arjun Sharma",
        specialization="General Medicine",
        email="arjun.sharma@example.com"
    ),
    Doctor(
        name="Dr. Meera Reddy",
        specialization="Dermatology",
        email="meera.reddy@example.com"
    ),
    Doctor(
        name="Dr. Vikram Rao",
        specialization="Cardiology",
        email="vikram.rao@example.com"
    ),
]


# Synthetic patients
patients = [
    Patient(
        name="Ananya Rao",
        date_of_birth=date(1998, 4, 15),
        blood_group="O+",
        allergies="None",
        phone="9000000001"
    ),
    Patient(
        name="Rahul Mehta",
        date_of_birth=date(1992, 8, 22),
        blood_group="A+",
        allergies="Peanuts",
        phone="9000000002"
    ),
    Patient(
        name="Priya Nair",
        date_of_birth=date(2000, 1, 10),
        blood_group="B+",
        allergies="None",
        phone="9000000003"
    ),
    Patient(
        name="Karan Patel",
        date_of_birth=date(1987, 11, 5),
        blood_group="AB+",
        allergies="Penicillin",
        phone="9000000004"
    ),
    Patient(
        name="Sneha Iyer",
        date_of_birth=date(1995, 6, 18),
        blood_group="O-",
        allergies="None",
        phone="9000000005"
    ),
]


appointment = Appointment(
    patient_id=1,
    doctor_id=1,
    appointment_date=date(2026, 10, 10),
    appointment_time=time(10, 30),
    status="Scheduled"
)

db.add(appointment)
db.commit()
db.close()

print("Synthetic doctors and patients added successfully.")