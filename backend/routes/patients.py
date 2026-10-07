from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date

from database import SessionLocal
from models import Patient


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


class PatientCreate(BaseModel):
    name: str
    date_of_birth: date
    blood_group: str
    allergies: str | None = None
    phone: str


@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()

    return patients


@router.post("/")
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    new_patient = Patient(
        name=patient.name,
        date_of_birth=patient.date_of_birth,
        blood_group=patient.blood_group,
        allergies=patient.allergies,
        phone=patient.phone
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient