import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';

import {window} from './sizes';
import RenderItem from './RenderItem';
// import { CarouselAdvancedSettingsPanel } from "@/components/CarouselAdvancedSettingsPanel";
import {useAdvancedSettings} from './useSettings';
import {Images} from '../../../../config';
import {useTranslation} from 'react-i18next';

// import { Stack } from "tamagui";
// import { CaptureWrapper } from "@/store/CaptureProvider";
// import { defaultDataWith6Colors } from "@/components/CarouselBasicSettingsPanel";

const PAGE_WIDTH = Dimensions.get('window').width;

function Index({updateGender}: any) {
  const {t} = useTranslation();
  const defaultDataWith6Colors: any = [
    {color: '#35364C', 
      text:t('i_am_male'),
      gender: 'Male', icon: 'gender-male', img: Images.male},
    {
      color: '#075985',
      text:t('i_am_female'),
      gender: 'Female',
      icon: 'gender-female',
      img: Images.female,
    },
    {
      color: '#475569',
      gender: 'Other',

      text:t('i_am_other'),
      icon: 'gender-male-female',
      img: Images.other,
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
      height: 330,
      loop: true,
      pagingEnabled: true,
      snapEnabled: true,
      vertical: false,
    },
  });
  const onGenderChange = (index: number) => {
    //console.log({index});
    let gender = 'Male';
    if (index === 0) {
      gender = 'Male';
    } else if (index === 1) {
      gender = 'Female';
    } else {
      gender = 'Other';
    }
    setSelectedIndex(index);
    updateGender(gender);
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
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,

        // parallaxAdjacentItemScale: 1,
        // parallaxAdjacentItemOffset: 50,
        // initialScrollIndex: selectedIndex,
      }}
      onScrollEnd={index => onGenderChange(index)}
      onProgressChange={(offsetProgress: number, absoluteProgress: number) => {
        // //console.log({offsetProgress,absoluteProgress})
        progress.value = absoluteProgress;
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
