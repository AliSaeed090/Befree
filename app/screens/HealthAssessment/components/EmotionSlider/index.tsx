import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';

import {window} from './sizes';
import RenderItem from './RenderItem';
// import { CarouselAdvancedSettingsPanel } from "@/components/CarouselAdvancedSettingsPanel";
import {useAdvancedSettings} from './useSettings';
import {Image} from 'react-native-reanimated/lib/typescript/Animated';
import {Images} from '../../../../config';
// import { Stack } from "tamagui";
// import { CaptureWrapper } from "@/store/CaptureProvider";
// import { defaultDataWith6Colors } from "@/components/CarouselBasicSettingsPanel";
import {useTranslation} from 'react-i18next';

const PAGE_WIDTH = Dimensions.get('window').width;

function Index({updateUserData}: any) {
  const {t} = useTranslation();

  const defaultDataWith6Colors: any = [
    {
      id:1,
      text: t('i_m_feeling_depressed'),
      icon_gray: Images.depressed_gray,
      icon_blue: Images.depressed_blue,
    },
    {
      id:2,
      text: t('i_m_feeling_sad'),
      icon_gray: Images.sad_gray,
      icon_blue: Images.sad_blue,
    },
    {
        id:3,
      text: t('i_m_feeling_neutral'),
      icon_gray: Images.nuetral_gray,
      icon_blue: Images.nuetral_blue,
    },
    { 
      id:4,
      text: t('i_m_feeling_happy'),
      icon_gray: Images.happy_gray,
      icon_blue: Images.happy_blue,
    },
    {
      id:5,
      text: t('i_m_feeling_overjoyed'),
      icon_gray: Images.overjoyed_gray,
      icon_blue: Images.overjoyed_blue,
    },
  ];
  const progress = useSharedValue<any>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const {advancedSettings, onAdvancedSettingsChange} = useAdvancedSettings({
    // These values will be passed in the Carousel Component as default props
    defaultSettings: {
      autoPlay: false,
      autoPlayInterval: 2000,
      autoPlayReverse: false,
      data: defaultDataWith6Colors,
      height: 300,
      loop: true,
      pagingEnabled: true,
      snapEnabled: true,
      vertical: false,
    },
  });
  const update = (index: number) => {
    setSelectedIndex(index);
    updateUserData(defaultDataWith6Colors[index].id);
  };
  return (
    <Carousel
      ref={ref}
      {...advancedSettings}
      style={{
        width: PAGE_WIDTH,
      }}
      width={PAGE_WIDTH}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: PAGE_WIDTH / 2,

        parallaxAdjacentItemScale: 0.6,
        // parallaxAdjacentItemOffset: 50,
        // initialScrollIndex: selectedIndex,
      }}
      onScrollEnd={index => update(index)}
      onProgressChange={(offsetProgress: number, absoluteProgress: number) => {
        // //console.log({offsetProgress,absoluteProgress})
        // progress.value = absoluteProgress;
      }}
      // renderItem={renderItem({ rounded: true,selectedIndex })}
      renderItem={({index, item}) => (
        <RenderItem
          rounded={true}
          selectedIndex={selectedIndex}
          item={item}
          index={index}
        />
      )}
    />
  );
}

export default Index;
