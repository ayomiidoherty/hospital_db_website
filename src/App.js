import React from "react";
import { Routes, Route } from "react-router-dom";
import RequestForm from "./RequestForm";
import PatientDetails from "./PatientDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RequestForm />} />
      <Route path="/patient-details/:patientID" element={<PatientDetails />} />
    </Routes>
  );
}

export default App;