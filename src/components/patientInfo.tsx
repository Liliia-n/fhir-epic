import { useEffect, useState } from "react";
import { IPatientData } from "../types/patient-data";
import FhirService from "../services/fhir-epic";
import { config } from "../config.ts";

const { clientId, redirect, authorizeLink } = config;

const PatientInfo = () => {
  const [code, setCode] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [patient, setPatient] = useState<string>("");
  const [patientData, setPatientData] = useState<IPatientData>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    setCode(codeParam);

    if (codeParam && !loaded) {
      const fetchAccessToken = async () => {
        try {
          const tokenData = await FhirService.login(
            clientId,
            redirect,
            codeParam
          );
          setAccessToken(tokenData.access_token);
          setPatient(tokenData.patient);
          setLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      };
      fetchAccessToken();
    }
  }, [loaded]);

  useEffect(() => {
    if (accessToken && patient) {
      const fetchPatientData = async () => {
        try {
          const data = await FhirService.getPatient(accessToken, patient);
          setPatientData(data);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };

      fetchPatientData();
    }
  }, [accessToken, patient]);

  const fetchDiagnosticReport = async () => {
    if (accessToken && patient) {
      try {
        const data = await FhirService.getDiagnosticReport(
          accessToken,
          patient
        );

        console.log(data);
      } catch (error) {
        console.error("Error fetching diagnostic report:", error);
      }
    }
  };

  const fetchVitalSigns = async () => {
    if (accessToken && patient) {
      try {
        const data = await FhirService.getObservationByPatient(
          accessToken,
          patient,
          "vital-signs"
        );

        console.log("fetched vital signs", data);

        const observationIds: string[] = [];
        if (data.entry && data.entry.length > 0 && observationIds.length < 5) {
          data.entry.forEach((entry) => {
            if (entry.resource?.id) {
              observationIds.push(entry.resource.id);
            }
          });
        }

        // fetch first observation
        const observationData = await FhirService.getObservation(
          accessToken,
          observationIds[0]
        );

        console.log("fetched observation data", observationData);
      } catch (error) {
        console.error("Error fetching vital signs:", error);
      }
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center" }}>
        <h1>Smart on FHIR - Patient Info</h1>
        <p>
          <strong>Username:</strong> fhircamila
        </p>
        <p>
          <strong>Password:</strong> epicepic1
        </p>
        {!code && (
          <a
            className="btn btn-info"
            style={{ textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
            href={authorizeLink}
          >
            Sign in
          </a>
        )}
        <hr />
      </div>

      {accessToken && (
        <>
          <p>
            <strong>Patient Id:</strong> {patient}
          </p>
          <strong>Name: </strong>
          {patientData?.name?.[0]?.text}
          <br />
          <strong>Birth Date: </strong>
          {patientData?.birthDate} <br />
          <strong>Gender: </strong>
          {patientData?.gender} <br />
          <strong>Marital Status: </strong>
          {patientData?.maritalStatus?.text} <br />
          <strong>Telecom: </strong> <br />
          {patientData?.telecom?.map((telecom) => (
            <div key={telecom.value} className="ml-2">
              <strong>{telecom.system}</strong> - {telecom.use} {telecom.value}
            </div>
          ))}
          <strong>Address: </strong> <br />
          {patientData?.address?.map((address) => (
            <div key={address.use} className="ml-2">
              <strong>{address.use} -</strong>
              {address.line?.toString()}, {address.city}, {address.district},
              {address.state}, {address.postalCode}, {address.country}
              {address?.period?.start && (
                <>
                  <strong> From: </strong>
                  {address.period.start}
                </>
              )}
            </div>
          ))}
          <strong>Language: </strong>
          {patientData?.communication?.[0]?.language?.coding?.[0]?.display}{" "}
          <br />
          <strong>General Practitioner: </strong>
          {patientData?.generalPractitioner?.[0]?.display}
          <br />
          <strong>Managing Organization: </strong>
          {patientData?.managingOrganization?.display}
          <br />
          <hr />
        </>
      )}

      <button
        className="btn btn-primary"
        onClick={fetchDiagnosticReport}
        disabled={!accessToken}
      >
        Diagnostic report data
      </button>

      <button
        className="btn btn-primary ml-2"
        onClick={fetchVitalSigns}
        disabled={!accessToken}
      >
        Vital Signs data for username
      </button>
    </div>
  );
};

export default PatientInfo;
