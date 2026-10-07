import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://clinic-management-platform-eoto.onrender.com";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentDateFilter, setAppointmentDateFilter] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("");

  const [patientForm, setPatientForm] = useState({
    name: "",
    date_of_birth: "",
    blood_group: "",
    allergies: "",
    phone: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "",
    email: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        fetch(`${API_URL}/patients/`),
        fetch(`${API_URL}/doctors/`),
        fetch(`${API_URL}/appointments/`),
      ]);

      if (!patientsRes.ok || !doctorsRes.ok || !appointmentsRes.ok) {
        throw new Error("Failed to load data");
      }

      setPatients(await patientsRes.json());
      setDoctors(await doctorsRes.json());
      setAppointments(await appointmentsRes.json());
    } catch (error) {
      console.error(error);
      alert(
        "Could not connect to the clinic backend. Please make sure the backend is running."
      );
    }
  }

  async function addPatient(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientForm),
      });

      if (!response.ok) {
        throw new Error("Could not add patient");
      }

      setPatientForm({
        name: "",
        date_of_birth: "",
        blood_group: "",
        allergies: "",
        phone: "",
      });

      setShowPatientForm(false);
      loadData();
      alert("Patient added successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not add patient.");
    }
  }

  async function addDoctor(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/doctors/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorForm),
      });

      if (!response.ok) {
        throw new Error("Could not add doctor");
      }

      setDoctorForm({
        name: "",
        specialization: "",
        email: "",
      });

      setShowDoctorForm(false);
      loadData();
      alert("Doctor added successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not add doctor.");
    }
  }

  async function addAppointment(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: Number(appointmentForm.patient_id),
          doctor_id: Number(appointmentForm.doctor_id),
          appointment_date: appointmentForm.appointment_date,
          appointment_time: appointmentForm.appointment_time,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not add appointment");
      }

      setAppointmentForm({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
      });

      setShowAppointmentForm(false);
      loadData();
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not book appointment.");
    }
  }

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.phone} ${patient.blood_group}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.specialization} ${doctor.email}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patient_id);
    const doctor = doctors.find((d) => d.id === appointment.doctor_id);

    const searchText = `
      ${patient?.name || ""}
      ${doctor?.name || ""}
      ${appointment.appointment_date}
      ${appointment.appointment_time}
      ${appointment.status}
    `.toLowerCase();

    const matchesSearch = searchText.includes(
      appointmentSearch.toLowerCase()
    );

    const matchesDate =
      !appointmentDateFilter ||
      appointment.appointment_date === appointmentDateFilter;

    const matchesStatus =
      !appointmentStatusFilter ||
      appointment.status === appointmentStatusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  function getPatientName(id) {
    return patients.find((p) => p.id === id)?.name || "Unknown";
  }

  function getDoctorName(id) {
    return doctors.find((d) => d.id === id)?.name || "Unknown";
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>ClinicCare</h1>
        <p className="subtitle">Management System</p>

        <button
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          className={activePage === "patients" ? "active" : ""}
          onClick={() => setActivePage("patients")}
        >
          👤 Patients
        </button>

        <button
          className={activePage === "doctors" ? "active" : ""}
          onClick={() => setActivePage("doctors")}
        >
          👨‍⚕️ Doctors
        </button>

        <button
          className={activePage === "appointments" ? "active" : ""}
          onClick={() => setActivePage("appointments")}
        >
          📅 Appointments
        </button>
      </aside>

      <main className="main-content">
        {activePage === "dashboard" && (
          <>
            <h2>Dashboard</h2>
            <p className="welcome">
              Welcome to the Clinic Management System
            </p>

            <div className="cards">
              <div className="card">
                <h3>Total Patients</h3>
                <strong>{patients.length}</strong>
              </div>

              <div className="card">
                <h3>Total Doctors</h3>
                <strong>{doctors.length}</strong>
              </div>

              <div className="card">
                <h3>Total Appointments</h3>
                <strong>{appointments.length}</strong>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>

              <button
                onClick={() => {
                  setActivePage("patients");
                  setShowPatientForm(true);
                }}
              >
                + Add Patient
              </button>

              <button
                onClick={() => {
                  setActivePage("doctors");
                  setShowDoctorForm(true);
                }}
              >
                + Add Doctor
              </button>

              <button
                onClick={() => {
                  setActivePage("appointments");
                  setShowAppointmentForm(true);
                }}
              >
                + Book Appointment
              </button>
            </div>
          </>
        )}

        {activePage === "patients" && (
          <>
            <div className="page-header">
              <div>
                <h2>Patients</h2>
                <p>Manage clinic patients</p>
              </div>

              <button onClick={() => setShowPatientForm(true)}>
                + Add Patient
              </button>
            </div>

            <input
              className="search"
              placeholder="Search patients..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />

            {showPatientForm && (
              <form className="form-card" onSubmit={addPatient}>
                <h3>Add Patient</h3>

                <input
                  placeholder="Full name"
                  required
                  value={patientForm.name}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  required
                  value={patientForm.date_of_birth}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      date_of_birth: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Blood group"
                  required
                  value={patientForm.blood_group}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      blood_group: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Allergies"
                  value={patientForm.allergies}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      allergies: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Phone"
                  required
                  value={patientForm.phone}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      phone: e.target.value,
                    })
                  }
                />

                <button type="submit">Save Patient</button>

                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowPatientForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Blood Group</th>
                    <th>Allergies</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.name}</td>
                      <td>{patient.date_of_birth}</td>
                      <td>{patient.blood_group}</td>
                      <td>{patient.allergies || "None"}</td>
                      <td>{patient.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activePage === "doctors" && (
          <>
            <div className="page-header">
              <div>
                <h2>Doctors</h2>
                <p>Manage clinic doctors</p>
              </div>

              <button onClick={() => setShowDoctorForm(true)}>
                + Add Doctor
              </button>
            </div>

            <input
              className="search"
              placeholder="Search doctors..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
            />

            {showDoctorForm && (
              <form className="form-card" onSubmit={addDoctor}>
                <h3>Add Doctor</h3>

                <input
                  placeholder="Doctor name"
                  required
                  value={doctorForm.name}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Specialization"
                  required
                  value={doctorForm.specialization}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      specialization: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={doctorForm.email}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      email: e.target.value,
                    })
                  }
                />

                <button type="submit">Save Doctor</button>

                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowDoctorForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activePage === "appointments" && (
          <>
            <div className="page-header">
              <div>
                <h2>Appointments</h2>
                <p>Manage clinic appointments</p>
              </div>

              <button onClick={() => setShowAppointmentForm(true)}>
                + Book Appointment
              </button>
            </div>

            <div className="filters">
              <input
                className="search"
                placeholder="Search appointments..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
              />

              <input
                type="date"
                value={appointmentDateFilter}
                onChange={(e) => setAppointmentDateFilter(e.target.value)}
              />

              <select
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {showAppointmentForm && (
              <form className="form-card" onSubmit={addAppointment}>
                <h3>Book Appointment</h3>

                <select
                  required
                  value={appointmentForm.patient_id}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      patient_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Patient</option>

                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>

                <select
                  required
                  value={appointmentForm.doctor_id}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      doctor_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Doctor</option>

                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  required
                  value={appointmentForm.appointment_date}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      appointment_date: e.target.value,
                    })
                  }
                />

                <input
                  type="time"
                  required
                  value={appointmentForm.appointment_time}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      appointment_time: e.target.value,
                    })
                  }
                />

                <button type="submit">Book Appointment</button>

                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowAppointmentForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{getPatientName(appointment.patient_id)}</td>
                      <td>{getDoctorName(appointment.doctor_id)}</td>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;