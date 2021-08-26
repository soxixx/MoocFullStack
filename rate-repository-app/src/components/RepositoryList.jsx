import React from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import {Picker} from '@react-native-picker/picker';
import { useState } from 'react';
import { useHistory } from 'react-router-native';
import { Searchbar } from 'react-native-paper';
// import { useDebouncedCallback } from 'use-debounce';
import { useDebounce } from 'use-debounce';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  menuStyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin:10
  }
});

const ItemSeparator = () => <View style={styles.separator} />;

const SortStrategyMenu = ({sortStrategy,setSortStrategy}) => {
  return (
    <View style={styles.menuStyle}>
      <Picker
        selectedValue={sortStrategy}
        onValueChange={(itemValue) => setSortStrategy(itemValue)
      }>
      <Picker.Item label='Latest repositories' value='latest' />
      <Picker.Item label='Highest rated repositories' value='highest' />
      <Picker.Item label='Lowest rated repositories' value='lowest' />
      </Picker>
    </View>
  );
};

const KeywordSearchBar = ({searchKeyword, setSearchKeyword}) => {
  return (
    <Searchbar
      placeholder="Search"
      onChangeText={(value) => setSearchKeyword(value)}
      value={searchKeyword}
    />
  );
};

const HeaderComponent = ({sortStrategy,setSortStrategy, searchKeyword, setSearchKeyword}) => {
  return (
    <>
      <KeywordSearchBar 
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <SortStrategyMenu 
        sortStrategy={sortStrategy} 
        setSortStrategy={setSortStrategy}
      />
    </>
  );
};

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const props = this.props;

    return (
        <HeaderComponent
          sortStrategy={props.sortStrategy} 
          setSortStrategy={props.setSortStrategy}
          searchKeyword={props.searchKeyword}
          setSearchKeyword={props.setSearchKeyword}
        />
    );
  };

  render() {
    const props = this.props;
    const repositoryNodes = props.repositories
        ? props.repositories.edges.map(edge => edge.node)
        : [];

    return (
        <FlatList
            data={repositoryNodes}
            ListHeaderComponent={this.renderHeader}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => props.history.push(`/repo/${item.id}`)} >
                    <RepositoryItem item={item} />
                </TouchableOpacity>
            )}

            onEndReached={props.onEndReach}
            onEndReachedThreshold={0.5}
        />
      );
  }
}

const RepositoryList = () => {
  const history = useHistory();
  const [ sortStrategy, setSortStrategy ] = useState('latest');

  const [ searchKeyword, setSearchKeyword ] = useState('');
  const [ debouncedSearchKeyword ] = useDebounce(searchKeyword, 500);

  const first = 8;
  const { repositories, fetchMore } = useRepositories(sortStrategy, debouncedSearchKeyword, first);
  // console.log(sortStrategy);
  // console.log(debouncedSearchKeyword);

  const onEndReach = () => {
    // console.log('You have reached the end of the list');
    fetchMore();
  };

  return (
    <RepositoryListContainer 
      repositories={repositories} 
      sortStrategy={sortStrategy}
      setSortStrategy={setSortStrategy}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      history={history}
      onEndReach={onEndReach}
    />
  );
};

export default RepositoryList;