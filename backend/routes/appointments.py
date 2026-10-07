from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import date, time
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Appointment


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()


@router.post("/")
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        status="Scheduled"
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment