import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PatientDetails() {
  const { patientID } = useParams();
  const [patientDetails, setPatientDetails] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const url = `https://centralized-hospital-db.onrender.com/medical_records/${patientID}`;

      try {
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          setPatientDetails(data);
        } else {
          setMessage("Error fetching patient details.");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setMessage("An error occurred.");
      }
    };

    fetchPatientDetails();
  }, [patientID]);

  if (message) {
    return <p className="text-danger">{message}</p>;
  }

  if (!patientDetails) {
    return <p>Loading patient details...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Patient Details</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Patient ID:</strong> {patientDetails.patient_id}
        </li>
        <li className="list-group-item">
          <strong>Name:</strong> {patientDetails.name}
        </li>
        <li className="list-group-item">
          <strong>Age:</strong> {patientDetails.age}
        </li>
        <li className="list-group-item">
          <strong>Medical History:</strong> {patientDetails.medical_history}
        </li>
      </ul>
    </div>
  );
}

export default PatientDetails;