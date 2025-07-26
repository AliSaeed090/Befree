import * as React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { window } from "./sizes";
import { renderItem } from "./render-item";
// import { CarouselAdvancedSettingsPanel } from "@/components/CarouselAdvancedSettingsPanel";
import { useAdvancedSettings } from "./useSettings";
// import { Stack } from "tamagui";
// import { CaptureWrapper } from "@/store/CaptureProvider";
// import { defaultDataWith6Colors } from "@/components/CarouselBasicSettingsPanel";
const defaultDataWith6Colors = [
    "#B0604D",
    "#899F9C",
    "#B3C680",
    "#5C6265",
    "#F5D399",
    "#F1F1F1",
  ];
const PAGE_WIDTH = window.width;

function Index() {
  const progress = useSharedValue<any>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const { advancedSettings, onAdvancedSettingsChange } = useAdvancedSettings({
    // These values will be passed in the Carousel Component as default props
    defaultSettings: {
      autoPlay: false,
      autoPlayInterval: 2000,
      autoPlayReverse: false,
      data: defaultDataWith6Colors,
      height: 258,
      loop: true,
      pagingEnabled: true,
      snapEnabled: true,
      vertical: false,
      width: 430,
    },
  });

  return (
    <Carousel
    ref={ref}
    {...advancedSettings}
    style={{
      width: PAGE_WIDTH,
    }}
    mode="parallax"
    modeConfig={{
      parallaxScrollingScale: 0.9,
      parallaxScrollingOffset: 50,
    }}
    onProgressChange={(offsetProgress: number, absoluteProgress: number)=>{
      progress.value = absoluteProgress;
    }}
    renderItem={renderItem({ rounded: true })}
  />
  );
}

export default Index;