import { useParams } from "react-router-native";
import useRepository from "../hooks/useRepository";
import theme from "../theme";
import React from "react";
import { View, StyleSheet, Pressable, Text, FlatList } from "react-native";
import RepositoryItem from "./RepositoryItem";
import * as WebBrowser from 'expo-web-browser';
import { format } from 'date-fns';


const styles = StyleSheet.create({
    gitHubText:{
      margin:10,
      fontSize:15,
      color:'white',
    },
    gitHubButton:{
      backgroundColor:theme.colors.languageTagBackground,
      flexDirection:'row',
      margin:10,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
});

// Single review item
const ReviewItem = ({ review }) => {
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
    </View>
  );
};

// Repository's information implemented in the previous exercise
const RepositoryInfo = ({ repository }) => {
  return (
    <View style={{backgroundColor:'white'}}>
      <RepositoryItem item={repository}/>
      <Pressable style={{backgroundColor:'white'}}
        onPress={()=>WebBrowser.openBrowserAsync(repository.url)}
      >
        <View style={styles.gitHubButton}>
          <Text style={styles.gitHubText}>Open in GitHub</Text>
        </View>
      </Pressable>
    </View>
  );
};


const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepoView = () => {
    const params = useParams();
    const { repository, fetchMore } = useRepository({ id: params.id, first:2 });
    
    // console.log(repository);

    if(!repository) return null;

    else{
      const reviewNodes = repository
        ? repository.reviews.edges.map(edge => edge.node)
        : [];
      // console.log(reviewNodes);
      const onEndReach = () => {
        // console.log('end of the review list');
        fetchMore();
      };
      
      return (
        <FlatList
          data={reviewNodes}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={({ id }) => id}
          ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
          ItemSeparatorComponent={ItemSeparator}
          onEndReached={onEndReach}
          onEndReachedThreshold={0.5}
        />
    );
    }

};

export default SingleRepoView;