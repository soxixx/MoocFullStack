import { useQuery } from '@apollo/client';
import { GET_ALL_REPOSITORIES } from '../graphql/queries';

const useRepositories = (sortStrategy, searchKeyword, first) => {
  let variables;
  if(sortStrategy === 'latest'){
    variables = { orderBy: 'CREATED_AT' };
  }
  else if(sortStrategy === 'highest'){
    variables =  { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
  }
  else{
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
  }

  variables = {...variables, searchKeyword, first};

  const { data, loading, fetchMore, ...result } = useQuery(
    GET_ALL_REPOSITORIES, { 
      fetchPolicy: 'cache-and-network',
      variables: variables
    });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
  
};

export default useRepositories;