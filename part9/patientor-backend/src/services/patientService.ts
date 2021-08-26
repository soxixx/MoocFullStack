// import patients from '../../data/patients';
// import { patients } from '../../data/patients_for_9.16';
import {Patient, NonSensitivePatient, NewPatient, PublicPatient, NewEntry } from '../types';
import {v1 as uuid} from 'uuid';

import  patients  from '../../data/patients_with_entries';

const getPatients = (): Array<Patient> => {
    return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
      }));
};

const getPublicPatients = (): PublicPatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
      }));
};

const addPatient = (patient: NewPatient) : Patient =>{
  const id = uuid();
  const newPatient = {
    id: id,
    entries:[],
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

const findPatientById = (id: string): Patient | undefined=> {
  const patient = patients.find(patient => patient.id === id);
  return patient;
};

const addEntry = (id:string, entry:NewEntry) : Patient | undefined => {
  const patient = patients.find(patient => patient.id === id);
  if (patient){
    const newEntry = {
      id: uuid(),
      ...entry
    };
    patient.entries.push(newEntry);
  }
  return patient;

};

export default {
  getPatients,
  addPatient,
  getNonSensitivePatients,
  getPublicPatients,
  findPatientById,
  addEntry
};