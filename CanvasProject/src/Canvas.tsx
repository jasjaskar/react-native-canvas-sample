import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Signature, {SignatureViewRef} from 'react-native-signature-canvas';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import {colorList} from './constants/constants';
import {ShareOpenResult} from 'react-native-share/lib/typescript/types';
const Canvas = ({route}) => {
  const style = `.m-signature-pad--footer
    .button {
      background-color: blue;
      color: #FFF;
    }`;
  const {key} = route.params;
  const path = 'file://' + RNFS.DocumentDirectoryPath + `/IMG_${key}.png`;

  const [isPen, setIspen] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('Small');
  const [isFileReadyToExport, setIsFileReadyToExport] = useState(false);

  const ref = useRef<SignatureViewRef>(null);

  const handleOK = (signature: string) => {
    RNFS.writeFile(path, signature.split('data:image/png;base64,')[1], 'base64')
      .then(async () => {
        let pathArray: any = await AsyncStorage.getItem('pathArray');
        pathArray = pathArray ? JSON.parse(pathArray) : [];
        pathArray = pathArray
          ? pathArray.includes(path)
            ? [...pathArray]
            : [...pathArray, path]
          : [];
        AsyncStorage.setItem('pathArray', JSON.stringify(pathArray));
        setIsFileReadyToExport(true);
        Alert.alert('Saved', 'Image Saved');
      })
      .catch((err: any) => {
        err && console.log(err);
      });
  };

  const handleEmpty = () => {
    Alert.alert('Alert', 'Please draw something to save');
  };
  const onExport = async () => {
    if (isFileReadyToExport) {
      let img = await RNFS.readFile(path, 'base64');
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
    } else {
      Alert.alert('Alert', 'Please save and then do export');
    }
  };
  const onDraw = () => {
    setIspen(true);
    ref.current.draw();
  };
  const onErase = () => {
    setIspen(false);
    ref.current.erase();
  };
  const onUndo = () => {
    ref.current.undo();
  };
  const onRedo = () => {
    ref.current.redo();
  };
  const onChangePenColor = (color: string) => {
    setSelectedColor(color);
    ref.current?.changePenColor(color);
  };
  const onChangePenType = (type: string, size: number) => {
    setSelectedSize(type);
    ref.current?.changePenSize(1, size);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              onDraw();
            }}>
            <EvilIcon
              name={'pencil'}
              size={30}
              color={isPen ? 'red' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onErase();
            }}>
            <EntypoIcon
              name={'eraser'}
              size={25}
              color={!isPen ? 'red' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onRedo();
            }}>
            <EvilIcon name={'redo'} size={30} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onUndo();
            }}>
            <EvilIcon name={'undo'} size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
        <View style={styles.exportContainer}>
          <TouchableOpacity
            onPress={() => {
              onExport();
            }}>
            <EntypoIcon name={'export'} size={25} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {isPen ? (
        <View style={styles.listContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={colorList}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.colorStyle,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    height: selectedColor == item ? 40 : 30,
                    width: selectedColor == item ? 40 : 30,
                    borderRadius: selectedColor == item ? 20 : 15,
                    backgroundColor: item,
                  },
                ]}
                onPress={() => {
                  onChangePenColor(item);
                }}
              />
            )}
          />
        </View>
      ) : null}
      <View style={styles.penTypeContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={['Small', 'Medium', 'Large']}
          renderItem={({item}) => (
            <TouchableOpacity
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                alignSelf:'center',
                marginLeft: 25,
              }}
              onPress={() => {
                switch (item) {
                  case 'Small':
                    onChangePenType(item, 2);
                    return;
                  case 'Medium':
                    onChangePenType(item, 6);
                    return;
                  case 'Large':
                    onChangePenType(item, 10);
                    return;
                }
              }}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  textAlign: 'center',
                  fontSize: selectedSize == item ? 20 : 14,
                  fontWeight: selectedSize == item ? 'normal' : 'bold',
                  color: selectedSize == item ? '#000' : 'gray',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Signature
        minWidth={1}
        maxWidth={2}
        ref={ref}
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Draw Something"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  subContainer: {
    height: '10%',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  exportContainer: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContainer: {marginVertical: 20, marginHorizontal: 20},
  colorStyle: {
    alignSelf: 'center',
    marginLeft: 4,
  },
  penTypeContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default Canvas;
