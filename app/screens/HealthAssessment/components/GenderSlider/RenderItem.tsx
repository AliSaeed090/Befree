import {SlideItem} from './SlideItem';
import {ImageStyle, StyleProp, StyleSheet, View,Image} from 'react-native';
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
  // //console.log({selectedIndex, index, item});

  return (
    <View testID={'index'} style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: item.color,
          borderRadius: 10,
          padding: 20,
          // alignItems: selectedIndex === index ? 'center' : selectedIndex-1===0? "flex-end":'flex-start',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <MaterialCommunityIcons name={item.icon} size={30} color={'white'} />
          <Text bold style={{fontSize: 16, color: 'white'}}>{item.text}</Text>
          
          
          <MaterialIcons
            name={selectedIndex === index ? 'check-box' : 'check-box-outline-blank'}
            size={25}
            color={'white'}
          />
        </View>
        <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        <Image source={item.img} style={{width:270, height:270, resizeMode:"contain" }}/>
        </View> 
        
      </View>
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
