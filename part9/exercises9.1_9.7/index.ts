/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// const express = require('express');
import express from 'express';
import bmiCalculator from './bmiCalculator';
import { parseArgs, exerciseCalculator } from './exerciseCalculator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack! ');
});

app.get('/bmi', (req, res) => {
  const bmi_height  = req.query.height;
  const bmi_weight  = req.query.weight;
  if(!isNaN(Number(bmi_height)) && !isNaN(Number(bmi_weight))){
    res.json({
      weight: bmi_weight,
      height: bmi_height,
      bmi: bmiCalculator(Number(bmi_height),Number(bmi_weight))
    });
  }
  else{
    res.status(400).json({error:"malformatted parameters"});
  }
});

app.post('/exercises', (req, res) => {
  const body = req.body;
  console.log(req.body);
  if(!body.daily_exercises || !body.target){
    res.status(400).json({error: "parameters missing"});
  }
  if(!parseArgs(["ts-node","exerciseCalculator.ts"].concat(body.target)
  .concat((body.daily_exercises).map((n: any)=>JSON.stringify(n))))){
    res.status(400).json({error: "malformatted parameters"});
  }
  res.status(200).json(exerciseCalculator(body.daily_exercises,body.target));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});