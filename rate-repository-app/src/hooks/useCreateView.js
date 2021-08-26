import { CREATE_REVIEW } from '../graphql/mutations';
import { useMutation } from '@apollo/client';

const useCreateReview = () => {
    const [mutate, result] = useMutation(CREATE_REVIEW);

    const createReview = async ({ ownerName, repositoryName, rating, text }) => {
        const createReview_result = await mutate({ 
            variables: { 
                repositoryName, 
                ownerName, 
                rating: Number(rating), 
                text 
            } 
        });
        if (createReview_result)
            return createReview_result.data.createReview.repositoryId;
        else return createReview_result;
    };
    return [createReview, result];
};
export default useCreateReview;