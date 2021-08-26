import { DELETE_REVIEW } from '../graphql/mutations';
import { useMutation } from '@apollo/client';

const useDeleteReview = () => {
    const [mutate, result] = useMutation(DELETE_REVIEW);

    const deleteReview = async (id) => {
        const deleteReview_result = await mutate({ 
            variables: { 
                id: id
            } 
        });
        return deleteReview_result;
    };
    return [deleteReview, result];
};
export default useDeleteReview;