import { useQuery } from '@apollo/client';
import { GET_AUTHORIZED_USER } from '../graphql/queries';

const useAuthUser = (includeReviews=false) => {
  const { data, loading, error, refetch } = useQuery(
      GET_AUTHORIZED_USER, { 
        fetchPolicy: 'cache-and-network' ,
        variables: {
          includeReviews: includeReviews
        }
      }
    );
    
  if (data){
    return { authorizedUser: data.authorizedUser, loading, error, refetch };
  }
  else{
    return { authorizedUser: data, loading, error, refetch};
  }
};

export default useAuthUser;