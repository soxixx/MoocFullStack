import useSignOut from '../hooks/useSignOut';
import { useHistory } from 'react-router';
import { useEffect } from 'react';

const SignOut = () => {
    const signOut = useSignOut();
    const history = useHistory();

    const handleSignOut = async () => {
        try {
            await signOut();
            history.push('/signin');
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(()=> {
        handleSignOut();
    },[]);
    
    return null;
};

export default SignOut;