/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { Diagnosis, Entry, HealthCheckEntry, Patient } from "../types";

import { addPatient, setPatient, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import ShowEntries from "./EntryDetails";
import { apiBaseUrl } from "../constants";
import AddEntryModal from "../AddEntryEntryModal";
import { EntryFormValues } from "../AddEntryEntryModal/AddEntryForm";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const [diagnoses, setDiagnoses] = React.useState<Array<Diagnosis>>([]);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const getPatientDetails = async (id: string) => {
    try {
      const { data: patient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      openModal();
      dispatch(setPatient(patient));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  useEffect(()=>{
    void getPatientDetails(id);
  },[id, dispatch]);

  const getDiagnosesData = async () => {
    try {
      const { data: received_diagnoses } = await axios.get<Array<Diagnosis>>(
        `${apiBaseUrl}/diagnoses`
      );
      openModal();
      setDiagnoses(received_diagnoses);
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  useEffect(()=>{
    if(diagnoses.length===0){
      void getDiagnosesData();
    }
  },[diagnoses]);


  const submitEntry = async (values: EntryFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addPatient(newPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const code2name = (code:string) => {
    const res = diagnoses.find(diag=>diag.code===code);
    if(res) return res.name;
    else return null;
  };

  const patient_to_show = patients[id];
  if(!patient_to_show || diagnoses.length===0){
    return null;
  }

  return (
    <div>
      <h2>{patient_to_show.name}</h2>
      <div>gender: {patient_to_show.gender}</div>
      <div>ssn: {patient_to_show.ssn}</div>
      <div>occupation: {patient_to_show.occupation}</div>
      <h3>entries</h3>
      
      {patient_to_show.entries.map((entry, index) => 
        <ShowEntries 
          key={index} 
          entry={entry}
          code2name={code2name}
        />
      )}

      <AddEntryModal 
        modalOpen={modalOpen}
        onSubmit={submitEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetailsPage;
