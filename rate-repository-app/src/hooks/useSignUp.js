import { SIGN_UP } from '../graphql/mutations';
import { useMutation } from '@apollo/client';

const useSignUp = () => {
    const [mutate, result] = useMutation(SIGN_UP);

    const signUp = async ({ username, password }) => {
        const signup_result = await mutate({ variables: { username, password } });
        return signup_result;
    };
    return [signUp, result];
};

export default useSignUp;