from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from models import Doctor


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


class DoctorCreate(BaseModel):
    name: str
    specialization: str
    email: str


@router.get("/")
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()

    return doctors


@router.post("/")
def create_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db)
):
    new_doctor = Doctor(
        name=doctor.name,
        specialization=doctor.specialization,
        email=doctor.email
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return new_doctor