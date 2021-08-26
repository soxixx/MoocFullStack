import { NewPatient, Gender, NewEntry, EntryType, HealthCheckRating } from './types';

type NewPatientFields = { 
    name : unknown, 
    dateOfBirth: unknown, 
    gender: unknown, 
    ssn: unknown,
    occupation: unknown
};

const toNewPatient = ({name, dateOfBirth, gender, ssn, occupation}: NewPatientFields): NewPatient => {
  const newPatient: NewPatient  = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    ssn: parseSSN(ssn),
    occupation: parseOccupation(occupation)
  };
  
  return newPatient;
};

export const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (object: any): NewEntry => {
    const halfWayEntry = {
        type: parseEntryType(object.type),
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        diagnosisCodes: object.diagnosisCodes
      };
    
    switch(halfWayEntry.type){
        case EntryType.HospitalEntryType:
            const parsedDischarge = parseDischarge(object.discharge);
            const newHospitalEntry = {
                ...halfWayEntry, 
                discharge: parsedDischarge
            };
            return newHospitalEntry as NewEntry;
        case EntryType.HealthCheckEntryType:
            const parsedHealthCheckRating = parseHealthCheckRating(object.healthCheckRating);
            const newHealthCheckEntry = {
                ...halfWayEntry, 
                healthCheckRating: parsedHealthCheckRating
            };
            return newHealthCheckEntry as NewEntry;
        case EntryType.OccupationalHealthcareEntryType:
            const parsedEmployerName = parseName(object.employerName);
            const parsedSickLeave = parseSickLeave(object.sickLeave);
            if(parsedSickLeave){
                const newOccupationalHealcareEntry = {
                    ...halfWayEntry, 
                    employerName: parsedEmployerName,
                    sickLeave: parsedSickLeave
                };
                return newOccupationalHealcareEntry as NewEntry;
            }
            else{
                const newOccupationalHealcareEntry = {
                    ...halfWayEntry, 
                    employerName: parsedEmployerName
                };
                return newOccupationalHealcareEntry as NewEntry;
            }
        default:
            return assertNever(halfWayEntry.type);
    }
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
      throw new Error('Incorrect or missing name: ' + name);
    }
    return name;
};

const parseSSN = (ssn: unknown): string => {
    if (!ssn || !isString(ssn)) {
      throw new Error('Incorrect or missing ssn: ' + ssn);
    }
    return ssn;
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation)) {
      throw new Error('Incorrect or missing occupation: ' + occupation);
    }
    return occupation;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};
  
const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    } 
    return gender;
};

const parseDescription = (description: unknown): string => {
    if (!description || !isString(description)) {
      throw new Error('Incorrect or missing entry description: ' + description);
    }
    return description;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist)) {
      throw new Error('Incorrect or missing specialist: ' + specialist);
    }
    return specialist;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (param: any): param is EntryType => {
    return Object.values(EntryType).includes(param);
};

const parseEntryType = (entryType: unknown): EntryType => {
    if (!entryType || !isEntryType(entryType)) {
        throw new Error('Incorrect or missing entry type: ' + entryType);
    } 
    return entryType;
};

const parseCriteria = (criteria: unknown): string => {
    if(!criteria || !isString(criteria)){
        throw new Error('Incorrect or missing criteria: ' + criteria);
    }
    return criteria;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (sickLeave: any): Record<string, unknown> | null => {
    if(!sickLeave){
        return null;
    }
    else{
        // console.log(sickLeave.startDate,sickLeave.endDate,sickLeave);
        const parsedSickLeave = {
            startDate: parseDate(sickLeave.startDate),
            endDate: parseDate(sickLeave.endDate)
        };
        return parsedSickLeave;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (healthCheckRating:unknown): HealthCheckRating => {
    if(!isHealthCheckRating(healthCheckRating)){
        throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
    }
    return healthCheckRating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (discharge:any): Record<string, unknown> => {
    if(!discharge){
        throw new Error('Incorrect or missing discharge: ' + discharge);
    }
    const parsedDischarge = {
        date: parseDate(discharge.date),
        criteria: parseCriteria(discharge.criteria)
    };
    return parsedDischarge;
};

export default toNewPatient;