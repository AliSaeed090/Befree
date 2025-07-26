import {SlideItem} from './SlideItem';
import {ImageStyle, StyleProp, StyleSheet, View, Image} from 'react-native';
import {Text} from '../../../../components';
import {CarouselRenderItem} from 'react-native-reanimated-carousel';
import Animated from 'react-native-reanimated';
import {PURPLE_IMAGES} from './purple-images';
import React, {useMemo} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Options {
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
  selectedIndex: number;
  index?: number;
  item?: any;
}

// export const renderItem =
//   ({ rounded = false, style }: Options = {}): CarouselRenderItem<any> =>
//   ({ index }: { index: number }) =>
//     <SlideItem key={index} index={index} rounded={rounded} style={style} />;

const RenderItem = ({
  rounded = false,
  style,
  item,
  selectedIndex,
  index,
}: any = {}) => {
  // ({ index }: { index: number }) =>{
  // //console.log({bool:selectedIndex===index, item});

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
         <View
        style={{
          width: 155,
          height: 155,
          // borderWidth: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: index === selectedIndex ? '#101A32' : 'transparent',
          borderRadius: 30,
        }}>
        <View
        style={{
          width: 150,
          height: 150,
          // borderWidth: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: index === selectedIndex ? '#112042' : 'transparent',
          borderRadius: 25,
        }}>
      <View
        style={{
          width: 140,
          height: 140,
          // borderWidth: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: index === selectedIndex ? '#132B60' : 'transparent',
          borderRadius: 20,
        }}>
      <Image
          source={index === selectedIndex ? item.icon_blue : item.icon_gray}
          // resizeMethod='contain'
          // tintColor={ '#1E64FA'}
          style={{width: 135, height: 135,resizeMode:'contain'}}
        /> 
        </View>
      </View>
      </View>
      <Text bold style={{fontSize: 16, color: 'white', marginTop: 60}}>
        {item.text}
      </Text>
    </View>
  );
};
export default RenderItem;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlayTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
