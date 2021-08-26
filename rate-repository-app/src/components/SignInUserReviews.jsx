import theme from "../theme";
import React from "react";
import { View, StyleSheet, Text, FlatList,Pressable,Alert, TouchableOpacity } from "react-native";
import { format } from 'date-fns';

import useAuthUser from '../hooks/useAuthUser';
import { useHistory } from "react-router-native";
import useDeleteReview from "../hooks/useDeleteReview";


const styles = StyleSheet.create({
    rate_name_date: {
        flexDirection: 'row',
        padding: 12
    },
    rating: {
        borderColor: theme.colors.primary,
        width: 50,
        height: 50,
        marginRight: 15,
        borderRadius: 25,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingText:{
      color: theme.colors.primary,
      fontSize: 18,
    },
    userNameAndDate:{
      flexDirection:'column'
    },
    name: {
      fontSize:20,
      fontWeight:700
    },
    date:{
      marginBottom:0,
      marginTop:5,
      fontSize:15,
    },
    reviewText: {
      paddingTop: 4,
      flexWrap: 'wrap',
      fontSize:15,
    },
    review: {
      flexShrink: 1,
      marginLeft: 75,
      marginBottom:20
    },
    separator: {
      height: 10,
    },
    buttonText:{
      margin:10,
      fontSize:15,
      color:'white',
    },
    viewRepositoryButton:{
      backgroundColor:theme.colors.languageTagBackground,
      flexDirection:'row',
      margin:20,
      borderRadius: 3,
      justifyContent:'center',
      alignContent:'center',
      paddingLeft:50,
      paddingRight:50
    },
    deleteReviewButton:{
      backgroundColor:'red',
      flexDirection:'row',
      margin:20,
      borderRadius: 3,
      justifyContent:'center',
      alignContent:'center',
      paddingLeft:50,
      paddingRight:50
    }
});

// Single review item
const ReviewItem = ({ review, history, refetch, deleteReview }) => {
//   console.log(review.repository);
    const handleDeleteReview = async () => {
        try {
            await deleteReview(review.id);
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };  
    const delelteReviewAlert = () =>{
        // console.log('delete review alert');
        return Alert.alert(
        "Delete review",
        "Are you sure you want to delete this review?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "DELETE", 
                onPress: () => handleDeleteReview()
            }
        ]
        );
    };

  return (
    <View style={{backgroundColor:'white'}}>
      <View style={styles.rate_name_date}>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            {review.rating}
          </Text>
        </View>

        <View style={styles.userNameAndDate}>
          <Text style={styles.name}>
            {review.user.username}
          </Text>
          <Text style={styles.date}>
            {format(new Date(review.createdAt),'dd.MM.yyyy')}
          </Text>
        </View>
      </View>
      <View style={styles.review}>
        <Text style={styles.reviewText}>
            {review.text}
        </Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <Pressable onPress={()=>history.push(`/repo/${review.repository.id}`)}>
            <View style={styles.viewRepositoryButton}>
                <Text style={styles.buttonText}>View Repository</Text>
            </View>
        </Pressable>
        <TouchableOpacity onPress={delelteReviewAlert} >
            <View style={styles.deleteReviewButton}>
                <Text style={styles.buttonText}>Delete review</Text>
            </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const ItemSeparator = () => <View style={styles.separator} />;

const SignInUserReviews = () => {
    const history = useHistory();
    const { authorizedUser, refetch } = useAuthUser(true);
    const [ deleteReview ] = useDeleteReview();

    if(!authorizedUser) return null;

    else{
      const reviews = authorizedUser.reviews;
      const reviewNodes = reviews
        ? reviews.edges.map(edge => edge.node)
        : [];
      
      return (
        <FlatList
          data={reviewNodes}
          renderItem={({ item }) => 
            <ReviewItem 
                history={history} 
                review={item} 
                refetch={refetch}
                deleteReview={deleteReview} 
            />}
          keyExtractor={({ id }) => id}
          ItemSeparatorComponent={ItemSeparator}
        />
    );
    }

};

export default SignInUserReviews;