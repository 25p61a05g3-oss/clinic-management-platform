import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("Dashboard");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] =
    useState(false);

  // SEARCH / FILTER
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] =
    useState("");
  const [appointmentDateFilter, setAppointmentDateFilter] =
    useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] =
    useState("");

  // PATIENT FORM
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [phone, setPhone] = useState("");

  // DOCTOR FORM
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] =
    useState("");
  const [doctorEmail, setDoctorEmail] = useState("");

  // APPOINTMENT FORM
  const [appointmentPatient, setAppointmentPatient] =
    useState("");
  const [appointmentDoctor, setAppointmentDoctor] =
    useState("");
  const [appointmentDate, setAppointmentDate] =
    useState("");
  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const patientsResponse = await fetch(
        `${API_URL}/patients/`
      );

      const doctorsResponse = await fetch(
        `${API_URL}/doctors/`
      );

      const appointmentsResponse = await fetch(
        `${API_URL}/appointments/`
      );

      if (!patientsResponse.ok) {
        throw new Error("Patients API failed");
      }

      if (!doctorsResponse.ok) {
        throw new Error("Doctors API failed");
      }

      if (!appointmentsResponse.ok) {
        throw new Error("Appointments API failed");
      }

      const patientsData =
        await patientsResponse.json();

      const doctorsData =
        await doctorsResponse.json();

      const appointmentsData =
        await appointmentsResponse.json();

      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);

      setError("");
    } catch (err) {
      setError(
        "Backend is not connected. Make sure FastAPI is running."
      );
    }
  }

  // -------------------------
  // ADD PATIENT
  // -------------------------

  async function addPatient(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/patients/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: patientName,
            date_of_birth: dateOfBirth,
            blood_group: bloodGroup,
            allergies: allergies,
            phone: phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not add patient");
      }

      setPatientName("");
      setDateOfBirth("");
      setBloodGroup("");
      setAllergies("");
      setPhone("");

      setShowPatientForm(false);

      await loadData();

      alert("Patient added successfully!");
    } catch (err) {
      alert("Could not add patient.");
    }
  }

  // -------------------------
  // ADD DOCTOR
  // -------------------------

  async function addDoctor(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/doctors/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: doctorName,
            specialization: specialization,
            email: doctorEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not add doctor");
      }

      setDoctorName("");
      setSpecialization("");
      setDoctorEmail("");

      setShowDoctorForm(false);

      await loadData();

      alert("Doctor added successfully!");
    } catch (err) {
      alert("Could not add doctor.");
    }
  }

  // -------------------------
  // ADD APPOINTMENT
  // -------------------------

  async function addAppointment(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/appointments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: Number(appointmentPatient),
            doctor_id: Number(appointmentDoctor),
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not book appointment"
        );
      }

      setAppointmentPatient("");
      setAppointmentDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");

      setShowAppointmentForm(false);

      await loadData();

      alert("Appointment booked successfully!");
    } catch (err) {
      alert("Could not book appointment.");
    }
  }

  // -------------------------
  // FIND PATIENT
  // -------------------------

  function patientNameById(id) {
    const patient = patients.find(
      (patient) => patient.id === id
    );

    return patient
      ? patient.name
      : `Patient #${id}`;
  }

  // -------------------------
  // FIND DOCTOR
  // -------------------------

  function doctorNameById(id) {
    const doctor = doctors.find(
      (doctor) => doctor.id === id
    );

    return doctor
      ? doctor.name
      : `Doctor #${id}`;
  }

  // -------------------------
  // FILTER PATIENTS
  // -------------------------

  const filteredPatients = patients.filter(
    (patient) => {
      const search =
        patientSearch.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return (
        patient.name
          .toLowerCase()
          .includes(search) ||
        patient.phone
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // -------------------------
  // FILTER DOCTORS
  // -------------------------

  const filteredDoctors = doctors.filter(
    (doctor) => {
      const search =
        doctorSearch.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return (
        doctor.name
          .toLowerCase()
          .includes(search) ||
        doctor.specialization
          .toLowerCase()
          .includes(search) ||
        doctor.email
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // -------------------------
  // FILTER APPOINTMENTS
  // -------------------------

  const filteredAppointments =
    appointments.filter((appointment) => {
      const search =
        appointmentSearch
          .toLowerCase()
          .trim();

      const patientName =
        patientNameById(
          appointment.patient_id
        ).toLowerCase();

      const doctorName =
        doctorNameById(
          appointment.doctor_id
        ).toLowerCase();

      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        doctorName.includes(search);

      const matchesDate =
        !appointmentDateFilter ||
        appointment.appointment_date ===
          appointmentDateFilter;

      const matchesStatus =
        !appointmentStatusFilter ||
        appointment.status ===
          appointmentStatusFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    });

  return (
    <div style={styles.app}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <h1 style={styles.logo}>
          MediCare
        </h1>

        <p style={styles.subtitle}>
          Clinic Management
        </p>

        <button
          style={
            page === "Dashboard"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => setPage("Dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          style={
            page === "Patients"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => setPage("Patients")}
        >
          👤 Patients
        </button>

        <button
          style={
            page === "Doctors"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => setPage("Doctors")}
        >
          🩺 Doctors
        </button>

        <button
          style={
            page === "Appointments"
              ? styles.activeButton
              : styles.button
          }
          onClick={() =>
            setPage("Appointments")
          }
        >
          📅 Appointments
        </button>

        <div style={styles.bottom}>
          <small>DEMO SYSTEM</small>
          <br />
          <small>Synthetic data only</small>
        </div>

      </aside>

      {/* MAIN */}

      <main style={styles.main}>

        <h1>{page}</h1>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ========================= */}

        {page === "Dashboard" && (
          <>
            <div style={styles.cards}>

              <div style={styles.card}>
                <h3>Patients</h3>

                <strong
                  style={styles.number}
                >
                  {patients.length}
                </strong>
              </div>

              <div style={styles.card}>
                <h3>Doctors</h3>

                <strong
                  style={styles.number}
                >
                  {doctors.length}
                </strong>
              </div>

              <div style={styles.card}>
                <h3>Appointments</h3>

                <strong
                  style={styles.number}
                >
                  {appointments.length}
                </strong>
              </div>

            </div>

            <div style={styles.panel}>

              <h2>
                Recent Appointments
              </h2>

              {appointments.length === 0 ? (
                <p>
                  No appointments found.
                </p>
              ) : (
                <table
                  style={styles.table}
                >

                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Date
                      </th>

                      <th style={styles.th}>
                        Time
                      </th>

                      <th style={styles.th}>
                        Patient
                      </th>

                      <th style={styles.th}>
                        Doctor
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {appointments.map(
                      (appointment) => (
                        <tr
                          key={
                            appointment.id
                          }
                        >

                          <td style={styles.td}>
                            {
                              appointment.appointment_date
                            }
                          </td>

                          <td style={styles.td}>
                            {
                              appointment.appointment_time
                            }
                          </td>

                          <td style={styles.td}>
                            {patientNameById(
                              appointment.patient_id
                            )}
                          </td>

                          <td style={styles.td}>
                            {doctorNameById(
                              appointment.doctor_id
                            )}
                          </td>

                          <td style={styles.td}>
                            {appointment.status}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              )}

            </div>
          </>
        )}

        {/* ========================= */}
        {/* PATIENTS */}
        {/* ========================= */}

        {page === "Patients" && (
          <div style={styles.panel}>

            <div style={styles.headerRow}>

              <h2>
                Patient Records
              </h2>

              <button
                style={styles.addButton}
                onClick={() =>
                  setShowPatientForm(
                    !showPatientForm
                  )
                }
              >
                + Add Patient
              </button>

            </div>

            {/* PATIENT SEARCH */}

            <div style={styles.searchBox}>

              <input
                style={styles.searchInput}
                placeholder="🔍 Search patient by name or phone..."
                value={patientSearch}
                onChange={(e) =>
                  setPatientSearch(
                    e.target.value
                  )
                }
              />

              {patientSearch && (
                <button
                  style={styles.clearButton}
                  onClick={() =>
                    setPatientSearch("")
                  }
                >
                  Clear
                </button>
              )}

            </div>

            {showPatientForm && (
              <form
                onSubmit={addPatient}
                style={styles.form}
              >

                <h3>
                  Add New Patient
                </h3>

                <label style={styles.label}>
                  Name
                </label>

                <input
                  style={styles.input}
                  value={patientName}
                  onChange={(e) =>
                    setPatientName(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Date of Birth
                </label>

                <input
                  style={styles.input}
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) =>
                    setDateOfBirth(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Blood Group
                </label>

                <input
                  style={styles.input}
                  placeholder="Example: O+"
                  value={bloodGroup}
                  onChange={(e) =>
                    setBloodGroup(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Allergies
                </label>

                <input
                  style={styles.input}
                  placeholder="None"
                  value={allergies}
                  onChange={(e) =>
                    setAllergies(
                      e.target.value
                    )
                  }
                />

                <label style={styles.label}>
                  Phone
                </label>

                <input
                  style={styles.input}
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Save Patient
                </button>

              </form>
            )}

            {filteredPatients.length ===
            0 ? (
              <p>
                No patients found.
              </p>
            ) : (
              <table
                style={styles.table}
              >

                <thead>

                  <tr>
                    <th style={styles.th}>
                      ID
                    </th>

                    <th style={styles.th}>
                      Name
                    </th>

                    <th style={styles.th}>
                      Date of Birth
                    </th>

                    <th style={styles.th}>
                      Blood Group
                    </th>

                    <th style={styles.th}>
                      Phone
                    </th>

                    <th style={styles.th}>
                      Allergies
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredPatients.map(
                    (patient) => (
                      <tr
                        key={patient.id}
                      >

                        <td style={styles.td}>
                          {patient.id}
                        </td>

                        <td style={styles.td}>
                          {patient.name}
                        </td>

                        <td style={styles.td}>
                          {
                            patient.date_of_birth
                          }
                        </td>

                        <td style={styles.td}>
                          {
                            patient.blood_group
                          }
                        </td>

                        <td style={styles.td}>
                          {patient.phone}
                        </td>

                        <td style={styles.td}>
                          {
                            patient.allergies ||
                            "None"
                          }
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

        {/* ========================= */}
        {/* DOCTORS */}
        {/* ========================= */}

        {page === "Doctors" && (
          <div style={styles.panel}>

            <div style={styles.headerRow}>

              <h2>
                Doctors
              </h2>

              <button
                style={styles.addButton}
                onClick={() =>
                  setShowDoctorForm(
                    !showDoctorForm
                  )
                }
              >
                + Add Doctor
              </button>

            </div>

            {/* DOCTOR SEARCH */}

            <div style={styles.searchBox}>

              <input
                style={styles.searchInput}
                placeholder="🔍 Search doctor by name, specialization or email..."
                value={doctorSearch}
                onChange={(e) =>
                  setDoctorSearch(
                    e.target.value
                  )
                }
              />

              {doctorSearch && (
                <button
                  style={styles.clearButton}
                  onClick={() =>
                    setDoctorSearch("")
                  }
                >
                  Clear
                </button>
              )}

            </div>

            {showDoctorForm && (
              <form
                onSubmit={addDoctor}
                style={styles.form}
              >

                <h3>
                  Add New Doctor
                </h3>

                <label style={styles.label}>
                  Name
                </label>

                <input
                  style={styles.input}
                  value={doctorName}
                  onChange={(e) =>
                    setDoctorName(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Specialization
                </label>

                <input
                  style={styles.input}
                  placeholder="Example: Cardiology"
                  value={specialization}
                  onChange={(e) =>
                    setSpecialization(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Email
                </label>

                <input
                  style={styles.input}
                  type="email"
                  placeholder="doctor@example.com"
                  value={doctorEmail}
                  onChange={(e) =>
                    setDoctorEmail(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Save Doctor
                </button>

              </form>
            )}

            {filteredDoctors.length ===
            0 ? (
              <p>
                No doctors found.
              </p>
            ) : (
              <table
                style={styles.table}
              >

                <thead>

                  <tr>

                    <th style={styles.th}>
                      ID
                    </th>

                    <th style={styles.th}>
                      Name
                    </th>

                    <th style={styles.th}>
                      Specialization
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredDoctors.map(
                    (doctor) => (
                      <tr
                        key={doctor.id}
                      >

                        <td style={styles.td}>
                          {doctor.id}
                        </td>

                        <td style={styles.td}>
                          {doctor.name}
                        </td>

                        <td style={styles.td}>
                          {
                            doctor.specialization
                          }
                        </td>

                        <td style={styles.td}>
                          {doctor.email}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

        {/* ========================= */}
        {/* APPOINTMENTS */}
        {/* ========================= */}

        {page === "Appointments" && (
          <div style={styles.panel}>

            <div style={styles.headerRow}>

              <h2>
                Appointments
              </h2>

              <button
                style={styles.addButton}
                onClick={() =>
                  setShowAppointmentForm(
                    !showAppointmentForm
                  )
                }
              >
                + Book Appointment
              </button>

            </div>

            {/* APPOINTMENT SEARCH */}

            <div style={styles.filterRow}>

              <input
                style={styles.searchInput}
                placeholder="🔍 Search by patient or doctor..."
                value={appointmentSearch}
                onChange={(e) =>
                  setAppointmentSearch(
                    e.target.value
                  )
                }
              />

              <input
                style={styles.filterInput}
                type="date"
                value={appointmentDateFilter}
                onChange={(e) =>
                  setAppointmentDateFilter(
                    e.target.value
                  )
                }
              />

              <select
                style={styles.filterInput}
                value={appointmentStatusFilter}
                onChange={(e) =>
                  setAppointmentStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Statuses
                </option>

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              <button
                style={styles.clearButton}
                onClick={() => {
                  setAppointmentSearch("");
                  setAppointmentDateFilter("");
                  setAppointmentStatusFilter("");
                }}
              >
                Clear Filters
              </button>

            </div>

            {/* APPOINTMENT FORM */}

            {showAppointmentForm && (
              <form
                onSubmit={addAppointment}
                style={styles.form}
              >

                <h3>
                  Book New Appointment
                </h3>

                <label style={styles.label}>
                  Patient
                </label>

                <select
                  style={styles.input}
                  value={appointmentPatient}
                  onChange={(e) =>
                    setAppointmentPatient(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={patient.id}
                        value={patient.id}
                      >
                        {patient.name}
                      </option>
                    )
                  )}

                </select>

                <label style={styles.label}>
                  Doctor
                </label>

                <select
                  style={styles.input}
                  value={appointmentDoctor}
                  onChange={(e) =>
                    setAppointmentDoctor(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Doctor
                  </option>

                  {doctors.map(
                    (doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.name} -{" "}
                        {
                          doctor.specialization
                        }
                      </option>
                    )
                  )}

                </select>

                <label style={styles.label}>
                  Appointment Date
                </label>

                <input
                  style={styles.input}
                  type="date"
                  value={appointmentDate}
                  onChange={(e) =>
                    setAppointmentDate(
                      e.target.value
                    )
                  }
                  required
                />

                <label style={styles.label}>
                  Appointment Time
                </label>

                <input
                  style={styles.input}
                  type="time"
                  value={appointmentTime}
                  onChange={(e) =>
                    setAppointmentTime(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Book Appointment
                </button>

              </form>
            )}

            {filteredAppointments.length ===
            0 ? (
              <p>
                No appointments found.
              </p>
            ) : (
              <table
                style={styles.table}
              >

                <thead>

                  <tr>

                    <th style={styles.th}>
                      ID
                    </th>

                    <th style={styles.th}>
                      Date
                    </th>

                    <th style={styles.th}>
                      Time
                    </th>

                    <th style={styles.th}>
                      Patient
                    </th>

                    <th style={styles.th}>
                      Doctor
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                      >

                        <td style={styles.td}>
                          {appointment.id}
                        </td>

                        <td style={styles.td}>
                          {
                            appointment.appointment_date
                          }
                        </td>

                        <td style={styles.td}>
                          {
                            appointment.appointment_time
                          }
                        </td>

                        <td style={styles.td}>
                          {patientNameById(
                            appointment.patient_id
                          )}
                        </td>

                        <td style={styles.td}>
                          {doctorNameById(
                            appointment.doctor_id
                          )}
                        </td>

                        <td style={styles.td}>
                          {appointment.status}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },

  sidebar: {
    width: "240px",
    background: "#111827",
    color: "white",
    padding: "25px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    margin: "0",
    color: "#60a5fa",
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: "30px",
  },

  button: {
    border: "none",
    background: "transparent",
    color: "#d1d5db",
    padding: "14px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "6px",
    fontSize: "15px",
  },

  activeButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "14px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "6px",
    fontSize: "15px",
  },

  bottom: {
    marginTop: "auto",
    color: "#6b7280",
  },

  main: {
    flex: 1,
    padding: "35px",
    overflow: "auto",
  },

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    minWidth: "180px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  number: {
    fontSize: "30px",
    display: "block",
    marginTop: "10px",
  },

  panel: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
  },

  addButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  filterInput: {
    padding: "12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    minWidth: "160px",
  },

  clearButton: {
    border: "none",
    background: "#6b7280",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxWidth: "500px",
    padding: "20px",
    marginBottom: "25px",
    background: "#f8fafc",
    borderRadius: "10px",
    border:
      "1px solid #e5e7eb",
  },

  label: {
    fontWeight: "bold",
    marginTop: "5px",
  },

  input: {
    padding: "11px",
    border:
      "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
  },

  saveButton: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom:
      "2px solid #e5e7eb",
    background: "#f8fafc",
  },

  td: {
    padding: "12px",
    borderBottom:
      "1px solid #e5e7eb",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default App;