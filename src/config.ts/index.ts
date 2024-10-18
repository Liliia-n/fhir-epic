const clientId = "95226556-c6eb-4a0b-b861-c2d1619def23";
const redirect = "http://localhost:3000";

const authorizeLink = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=${redirect}&client_id=${clientId}&state=1234&scope=patient.read,patient.search,observation.read`;

export const config = {
  clientId,
  redirect,
  authorizeLink,
};
