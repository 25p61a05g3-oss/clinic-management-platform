from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import patients, doctors, appointments


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()


# Allow the deployed React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://clinic-management-platform-1.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)


@app.get("/")
def root():
    return {
        "message": "Clinic Management API is running"
    }