import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';

import FormikTextInput from './FormikTextInput';
import * as yup from 'yup';

import theme from '../theme';
import { useHistory } from 'react-router-native';

import useSignIn from '../hooks/useSignIn';
import useSignUp from '../hooks/useSignUp';


const styles=StyleSheet.create({
  SignUpForm:{
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
  signUpText:{
    margin:10,
    fontSize:15,
    color:'white',
  },
  signUpButton:{
    backgroundColor:theme.colors.languageTagBackground,
    flexDirection:'row',
    margin:10,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const initialValues = {
    username: '',
    password: '',
    password_confirmation: ''
};

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(1)
        .max(30),
    password: yup
        .string()
        .required('Password is required')
        .min(5)
        .max(50),
    password_confirmation: yup
        .string()
        .required('Password confirmation is required')
        .min(5)
        .max(50)
        .oneOf([yup.ref('password'), null], "Passwords don't match"),
});


const SignUpForm = ({ onSubmit }) => {
  return (
    <View style={styles.SignUpForm}>
      <FormikTextInput
        style={styles.textInput}
        name="username"
        placeholder="Username"
      />
      <FormikTextInput
        style={styles.textInput}
        name="password"
        placeholder="Password"
        secureTextEntry
      />
      <FormikTextInput
        style={styles.textInput}
        name="password_confirmation"
        placeholder="Password confirmation"
        secureTextEntry
      /> 
      <Pressable onPress={onSubmit}>
        <View style={styles.signUpButton}>
          <Text 
            style={styles.signUpText}>Sign up</Text>
        </View>
      </Pressable>
    </View>
  );
};

const SignUpContainer = ({ onSubmit }) => {
  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

const SignUp = () => {
  const [ signIn ] = useSignIn();
  const [ signUp ] = useSignUp();
  const history = useHistory();

  const onSubmit = async (values) => {
    const username = values.username;
    const password = values.password;
    // console.log(values);
    try {
        await signUp({ username, password });
        // const { data } = await signUp({ username, password });
        // console.log(data);
        await signIn({ username, password });
        history.push('/');
    } catch (e) {
        console.log(e);
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;
