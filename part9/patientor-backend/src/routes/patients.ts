import express from 'express';
import patientService from '../services/patientService';
import toNewPatient, { toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).send(patientService.getPublicPatients());
});

router.post('/', (_req, res) => {
  try{
    const newPatient = toNewPatient(_req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  }
  catch(e){
    res.status(400).send(e.message); 
  }
});

router.get('/:id',(_req,res)=>{
  const patient = patientService.findPatientById(_req.params.id);
  if(patient){
    res.status(200).json(patient);
  }
  else res.status(400).send({error: 'patient id not found'});
});

router.post('/:id/entries',(_req,res) => {
  try{
    const newEntry = toNewEntry(_req.body);
    const addedPatient = patientService.addEntry(_req.params.id, newEntry);
    res.status(200).json(addedPatient);
  }
  catch(e){
    res.status(400).send(e.message);
  }
});

export default router;