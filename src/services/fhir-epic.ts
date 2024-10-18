import axios from "axios";

export default class FhirService {
  static baseUrl = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";

  static async login(clientId: string, redirectUri: string, code: string) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
      client_id: clientId,
      state: "1234",
    });

    try {
      const response = await axios.post(
        "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  static async getPatient(accessToken: string, patientId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/Patient/${patientId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data:", error);
      throw error;
    }
  }

  static async getObservationByPatient(
    accessToken: string,
    patientId: string,
    category: string = "vital-signs"
  ) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/Observation?patient=${patientId}&category=${category}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching observation data:", error);
      throw error;
    }
  }

  static async getObservation(accessToken: string, observationId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/Observation/${observationId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching observation data:", error);
      throw error;
    }
  }

  static async getDiagnosticReport(accessToken: string, patientId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/DiagnosticReport?patient=${patientId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching diagnostic report:", error);
      throw error;
    }
  }
}
