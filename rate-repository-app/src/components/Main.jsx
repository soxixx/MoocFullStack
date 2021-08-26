import React from 'react';
import {  StyleSheet, View } from 'react-native';
import theme from '../theme';
import AppBar from './AppBar';

// eslint-disable-next-line no-unused-vars
import { Route, Switch, Redirect } from 'react-router-native';
import RepositoryList from './RepositoryList';
import SignIn from './SignIn';
import SignOut from './SignOut';
import SingleRepoView from './SingleRepoView';
import CreateReview from './CreateReview';
import SignUp from './SignUp';
import SignInUserReviews from './SignInUserReviews';

const styles = StyleSheet.create({
  main: {
    backgroundColor: theme.colors.mainBackground,
  },
  appBar:{
    backgroundColor: theme.colors.appBarBackground,
  }
});

const Main = () => {
  return (
    <View style={styles.main}>
      <View style={styles.appBar}>
        <AppBar />
      </View>
      <Switch>
        <Route path="/repo/:id" exact>
          <SingleRepoView />
        </Route>
        <Route path="/signin" exact>
          <SignIn />
        </Route>
        <Route path="/signout" exact>
          <SignOut />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Route path="/createreview" exact>
          <CreateReview />
        </Route>
        <Route path="/userreviews" exact>
          <SignInUserReviews />
        </Route>
        <Route path="/" exact>
          <RepositoryList />
        </Route>
        {/* <Redirect to="/" /> */}
      </Switch>
    </View>
  );
};
export default Main;