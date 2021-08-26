// import { Container, Table, Button } from "semantic-ui-react";
import React from "react";
import { HealthCheckEntryCSS, HospitalEntryCSS, OccupationalHealthcareCSS } from "../styledCSS/entryView";

import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";

interface GeneralProps {
  entry: Entry,
  code2name: (code:string) => string | null
}

interface HospitalEntryProps {
  entry: HospitalEntry
}

interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntry
}

interface HealthCheckEntryProps {
  entry:HealthCheckEntry
}

const assertNever = (value: never): never => {
  throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const OccupationalHealthcare = ({ entry }: OccupationalHealthcareEntryProps) => {
  return (
    <div>
      employer: {entry.employerName}
      {entry.sickLeave &&
        <p>
          date: {entry.sickLeave.startDate} ~ {entry.sickLeave.endDate}
        </p>
      }
    </div>
  );
};

const Hospital = ({entry}:HospitalEntryProps) => {
  return (
    <div>
      <b>discharge: </b>
      <div>
        date: {entry.discharge.date}
        <div>criteria: {entry.discharge.criteria}</div>
      </div>
    </div>
  );
};

const HealthCheck = ({entry} : HealthCheckEntryProps) => {
  return (
    <div>
      <i>healthCheckRating: {entry.healthCheckRating}</i>
    </div>
  );
};

const GeneralEntry = ({ entry, code2name }: GeneralProps) => {
  return (
    <div key={entry.id}>
      {entry.date}
      <div>
        <i>{entry.description}</i>
      </div>
      <ul>
        {entry.diagnosisCodes && 
          entry.diagnosisCodes.map(code => 
          <li key={code}>
            {code} {code2name(code)}
          </li>)}
      </ul>
    </div>
  );
};

const ShowEntries = ({ entry, code2name }: GeneralProps) => {
  switch (entry.type) {
    case "Hospital":
        return (
          <div>
            <HospitalEntryCSS>
              <GeneralEntry entry={entry} code2name={code2name} />
              <Hospital entry={entry} />
            </HospitalEntryCSS>
          <br></br>
        </div>
        );
    case "HealthCheck":
      return (
        <div>
          <HealthCheckEntryCSS>
            <GeneralEntry entry={entry} code2name={code2name} />
            <HealthCheck entry={entry} />
          </HealthCheckEntryCSS>
          <br></br>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <OccupationalHealthcareCSS>
            <GeneralEntry entry={entry} code2name={code2name} />
            <OccupationalHealthcare entry={entry} />
            <br></br>
          </OccupationalHealthcareCSS>
          <br></br>
        </div>
      );
    default:
        return assertNever(entry);
  }
};

export default ShowEntries;