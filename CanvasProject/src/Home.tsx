import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {ShareOpenResult} from 'react-native-share/lib/typescript/types';

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getLocalData = () => {
    AsyncStorage.getItem('pathArray').then((result: string) => {
      let arr = result ? JSON.parse(result) : [];
      // To show most recent saved data at the top
      arr.reverse();
      setData([...arr]);
      setRefreshing(false);
    });
  };

  const onExport = async (item: string) => {
    let img = await RNFS.readFile(item, 'base64');
    var imageUrl = 'data:image/png;base64,' + img;
    let shareImage = {
      title: 'Share Image',
      message: 'Some Description',
      url: imageUrl,
    };
    Share.open(shareImage)
      .then((res: ShareOpenResult) => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  useEffect(() => {
    getLocalData();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <View style={styles.topLeftContainer}>
          <TouchableOpacity style={styles.alignCenter} onPress={() => {}}>
            <EntypoIcon name={'menu'} size={30} color={'#000'} />
          </TouchableOpacity>
          <Text style={styles.headerTextStyle}>Sample Canvas App</Text>
        </View>
        <View style={styles.plusIconContanier}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Canvas', {
                key: Math.floor(Math.random() * 10000000000),
              });
            }}>
            <EntypoIcon name={'circle-with-plus'} size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          getLocalData();
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({item}) => (
          <View style={styles.listContainer}>
            <EntypoIcon
              onPress={() => {
                onExport(item);
              }}
              style={styles.marginLeft}
              name={'export'}
              size={25}
              color={'#000'}
            />
            <Image
              source={{
                uri: item,
              }}
              style={styles.imgStyle}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  topContainer: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
  },
  topLeftContainer: {
    flex: 0.75,
    flexDirection: 'row',
    marginLeft: 30,
    justifyContent: 'flex-start',
  },
  alignCenter: {alignSelf: 'center'},

  headerTextStyle: {
    marginLeft: 10,
    fontSize: 20,
    fontFamily: 'ubuntu',
    fontWeight: 'bold',
    color: '#000',
  },
  plusIconContanier: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  marginLeft: {marginLeft: '90%'},
  imgStyle: {width: '100%', height: 200, borderWidth: 1, borderColor: '#000'},
});
export default Home;
