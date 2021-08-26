import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';

import FormikTextInput from './FormikTextInput';
import * as yup from 'yup';

import theme from '../theme';
import { useHistory } from 'react-router-native';
import useCreateReview from '../hooks/useCreateView';

const styles=StyleSheet.create({
  ReviewForm:{
    backgroundColor:'white',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  textInput:{
    marginTop:10,
    marginLeft:10,
    fontSize:15,
    borderWidth: 1,
    borderRadius:4
  },
  createReviewText:{
    margin:10,
    fontSize:15,
    color:'white',
  },
  createReviewButton:{
    backgroundColor:theme.colors.languageTagBackground,
    flexDirection:'row',
    margin:10,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const initialValues = {
    ownerName: '',
    repositoryName: '',
    rating: '',
    text: '',
};

const validationSchema = yup.object().shape({
    ownerName: yup
        .string()
        .required('Repository owner name is required'),
    repositoryName: yup
        .string()
        .required('Repository name is required'),
    rating: yup
        .number()
        .required('Rating is required')
        .min(0, 'Rating must be greater than or equal to 0')
        .max(100, 'Rating must be less than or equal to 100'),
    text: yup
        .string()
});


const ReviewForm = ({ onSubmit }) => {
  return (
    <View style={styles.ReviewForm}>
      <FormikTextInput
        style={styles.textInput}
        name="ownerName"
        placeholder="Repository owner name"
      />
      <FormikTextInput
        style={styles.textInput}
        name="repositoryName"
        placeholder="Repository name"
      />
      <FormikTextInput
        style={styles.textInput}
        name="rating"
        placeholder="Rating between 0 and 100"
      />
      <FormikTextInput
        style={styles.textInput}
        name="text"
        placeholder="Review"
      />      
      <Pressable onPress={onSubmit}>
        <View style={styles.createReviewButton}>
          <Text 
            style={styles.createReviewText}>Create a review</Text>
        </View>
      </Pressable>
    </View>
  );
};

const CreateViewContainer = ({ onSubmit }) => {
  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <ReviewForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

const CreateReview = () => {
  // console.log('create review');
  const [createReview] = useCreateReview();
  const history = useHistory();

  const onSubmit = async (values) => {
      try {
        // console.log(values);
        const repositoryId = await createReview(values);
        history.push(`/repo/${repositoryId}`);
      } catch (e) {
        console.log(e);
      }
    };

  return <CreateViewContainer onSubmit={onSubmit} />;
};

export default CreateReview;
