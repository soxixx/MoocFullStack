// import diagnosesData from '../../data/diagnoses.json';
import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getDiagnoses = (): Array<Diagnosis> => {
    return diagnoses;
};

// const addEntry = () => {
//   return [];
// };


export default {
  getDiagnoses,
  // addEntry
};