import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flexGrow:1,
    flexDirection: 'row',
    marginTop:-20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    flexDirection: 'column',
    marginBottom: 10,
    marginRight: 10
  },
  statRow: {
    flexDirection: 'row',
    marginLeft:10
  },
  statSingle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin:20
  },
  language:{
    backgroundColor:theme.colors.languageTagBackground,
    flexGrow: 0,
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft:60,
    padding:5
  },
  description:{
    marginBottom:0,
    marginTop:5,
    fontSize:15
  },
  name: {
    fontSize:20
  }
});

const approximateNumber = (num) => {
  function round(number, precision) {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
  }
  if(num>=1000) return JSON.stringify(round(num/1000,1)).concat('k');
  else return JSON.stringify(num);
};


const Item = ({props}) => (
  <View style={{backgroundColor:theme.colors.repositoryItemBackground}}>
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={{uri: props.ownerAvatarUrl}} />
      <View style={{flexDirection:'column',flexGrow:1,}}>
        <Text 
          testID={`${props.id}:fullName`}
          fontWeight='bold' fontSize='subheading'
          style={styles.name}>{props.fullName}</Text>
        <Text
          testID={`${props.id}:description`}
          style={styles.description}>{props.description}</Text>
      </View>
    </View>
    <View>
    <Text
      testID={`${props.id}:language`}
      style={styles.language} >{props.language}</Text>
    </View>
    
    <View style={styles.statRow}>
      <View style={styles.statSingle}>
        <Text 
          testID={`${props.id}:stargazersCount`} 
          fontWeight='bold' fontSize='subheading' >{approximateNumber(Number(props.stargazersCount))}</Text>
        <Text> Stars </Text>
      </View>
      <View style={styles.statSingle}>
        <Text 
          testID={`${props.id}:forksCount`} 
          fontWeight='bold' 
          fontSize='subheading'>{approximateNumber(Number(props.forksCount))}</Text>
        <Text > Forks </Text>
      </View>
      <View style={styles.statSingle}>
        <Text 
          testID={`${props.id}:reviewCount`} 
          fontWeight='bold' 
          fontSize='subheading' >{approximateNumber(Number(props.reviewCount))}</Text>
        <Text > Review </Text>
      </View>
      <View style={styles.statSingle}>
        <Text 
          testID={`${props.id}:ratingAverage`} 
          fontWeight='bold' 
          fontSize='subheading' >{props.ratingAverage}</Text>
        <Text > Rating </Text>
      </View>
    </View>
  </View>
      
);

const RepositoryItem = ({item}) => {
  return (
    <Item props={item}/>
  );
};

export default RepositoryItem;