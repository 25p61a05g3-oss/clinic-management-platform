from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes.appointments import router as appointments_router
from routes.patients import router as patients_router
from routes.doctors import router as doctors_router

import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Clinic Management Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appointments_router)
app.include_router(patients_router)
app.include_router(doctors_router)