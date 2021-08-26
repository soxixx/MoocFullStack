import useAuthStorage from '../hooks/useAuthStorage';
import { useApolloClient } from '@apollo/client';

const useSignOut = () => {
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient();

    const signOut = async () => {
        // console.log(authStorage.getAccessToken());
        await authStorage.removeAccessToken();
        await apolloClient.resetStore();
        // console.log(authStorage.getAccessToken());
    };

    return signOut;
};

export default useSignOut;

