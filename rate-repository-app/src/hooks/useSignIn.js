import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";

import useAuthStorage from '../hooks/useAuthStorage';

const useSignIn = () => {
    const authStorage = useAuthStorage();
    const [mutate, result] = useMutation(LOGIN);
    const apolloClient = useApolloClient();
  
    const signIn = async ({ username, password }) => {
      // call the mutate function here with the right arguments
      const login_result = await mutate({ variables: { username, password } });
      await authStorage.setAccessToken(login_result.data.authorize.accessToken);
      // console.log(authStorage.getAccessToken());
      apolloClient.resetStore();
      return login_result;
    };
  
    return [signIn, result];
};

export default useSignIn;