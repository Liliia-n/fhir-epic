export type IPatientData = {
  name: Array<{
    text: string;
  }>;
  birthDate: string;
  gender: string;
  deceasedBoolean: boolean;
  maritalStatus: {
    text: string;
  };
  telecom: Array<{
    system: string;
    use: string;
    value: string;
  }>;
  address: Array<{
    use: string;
    line: string[];
    city: string;
    district: string;
    state: string;
    postalCode: string;
    country: string;
    period: {
      start: string;
    };
  }>;
  communication: Array<{
    language: {
      coding: Array<{
        display: string;
      }>;
    };
  }>;
  generalPractitioner: Array<{
    display: string;
  }>;
  managingOrganization: {
    display: string;
  };
};
