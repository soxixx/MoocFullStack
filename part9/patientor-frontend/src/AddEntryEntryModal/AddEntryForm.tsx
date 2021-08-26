import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection, SelectField, NumberField } from "./FormField";
import { Diagnosis, EntryType, HealthCheckRating, NewEntryAllInput } from "../types";

/*
 * use type Entry, but omit id,
 * because those are irrelevant for new Entry object.
 */
export type EntryFormValues = Omit<NewEntryAllInput,'id'>;


interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
  diagnoses: Array<Diagnosis>
}

const entryTypeOptions = [
    { value: EntryType.HealthCheckEntryType, label: "Health Check" },
    { value: EntryType.HospitalEntryType, label: "Hospital" },
    { value: EntryType.OccupationalHealthcareEntryType, label: "Occupational Healthcare" }
];

export const AddEntryForm = ({ onSubmit, onCancel, diagnoses } : Props ) => {
  return (
    <Formik
      initialValues={{
        type:"HealthCheck",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: undefined,
        healthCheckRating:HealthCheckRating.Healthy,
        employerName:"",
        discharge:{
          date:"",
          criteria:""
        },
        sickLeave:{
          startDate:"",
          endDate:""
        }
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if(!values.type){
          errors.type = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date || !Date.parse(values.date)) {
          errors.date = 'date is required in YYYY-MM-DD format';
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if(values.type === "Hospital"){
          if (!values.discharge.date || !Date.parse(values.discharge.date)) {
            errors.discharge_date = 'discharge date is required in YYYY-MM-DD format';
          }
          if (!values.discharge.criteria) {
            errors.criteria = requiredError;
          }
        }
        if(values.type === "OccupationalHealthcare"){
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (!values.sickLeave.startDate || !Date.parse(values.sickLeave.startDate)) {
            errors.sickLeave_startDate = 'sickLeave startDate is required in YYYY-MM-DD format';
          }
          if (!values.sickLeave.endDate || !Date.parse(values.sickLeave.endDate)) {
            errors.sickLeave_endDate = 'sickLeave endDate is required in YYYY-MM-DD format';
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        const occShowOrNot = {display: 
          values.type ==="OccupationalHealthcare" ? '' : 'none'};
        const hosShowOrNot = {display: 
          values.type ==="Hospital" ? '' : 'none'};
        const healShowOrNot = {display: 
          values.type === "HealthCheck" ? '' : 'none'};
        return (
          <Form className="form ui">
            <SelectField
                label="Type"
                name="type"
                options={entryTypeOptions}
            />
            <Field
              label="Description"
              placeholder="description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
            />
            <div style={healShowOrNot}>
              <Field 
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
            </div>
            <div style={hosShowOrNot}>
              < Field 
                label="Discharge date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
              />
              <Field 
                label="Discharge criteria"
                placeholder="criteria"
                name="discharge.criteria"
                component={TextField}
              />
            </div>
            <div style={occShowOrNot}>
              <Field 
                  label="Employer Name "
                  placeholder="name"
                  name="employerName"
                  component={TextField}
              />
              <Field 
                  label="Sick Leave Start Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
              />
              <Field 
                  label="Sick Leave End Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
              />
            </div>
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
