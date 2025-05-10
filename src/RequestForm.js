import React, { useEffect, useState } from "react";

function RequestForm() {
  const [hospitalName, setHospitalName] = useState("");
  const [patientID, setPatientID] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusChecking, setStatusChecking] = useState(false); // Track if status polling should start

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    const url = "https://centralized-hospital-db.onrender.com/request_access";

    const requestBody = {
      hospital_name: hospitalName,
      patient_id: patientID,
      reason: "Access requested via React app",
    };

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit the request");
      }

      const data = await res.json();
      setResponse(data);
      setStatusChecking(true); // Start checking the status
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusChecking) {
      const interval = setInterval(async () => {
        const url = `https://centralized-hospital-db.onrender.com/check_access/${patientID}`; // Corrected endpoint

        try {
          const res = await fetch(url, {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            throw new Error("Failed to check access status");
          }

          const data = await res.json();
          if (data.status === "approved") {
            clearInterval(interval); // Stop polling
            window.location.href = `/medical_records/${patientID}`; // Redirect to medical records page
          }
        } catch (err) {
          console.error(err.message); 
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [statusChecking, patientID]);

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">
            Hospital Data Request Portal
          </h1>
          <form onSubmit={handleRequestAccess}>
            <div className="form-group mb-3">
              <label htmlFor="hospitalName" className="form-label">
                Hospital Name
              </label>
              <input
                type="text"
                id="hospitalName"
                className="form-control"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Enter Hospital Name"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="patientID" className="form-label">
                Patient ID
              </label>
              <input
                type="text"
                id="patientID"
                className="form-control"
                value={patientID}
                onChange={(e) => setPatientID(e.target.value)}
                placeholder="Enter Patient ID"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              Error: {error}
            </div>
          )}

          {response && (
            <div className="alert alert-success mt-3" role="alert">
              <h5 className="alert-heading">Response:</h5>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
