// import * as React from "react";
import { TCarouselProps } from "react-native-reanimated-carousel";
import React , {useState} from "react";
// import {
//   // BasicSettings,
//   // getDefaultBasicSettings,
// } from "./CarouselBasicSettingsPanel";
import { window } from "./sizes";
const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
interface BasicSettings
  extends Pick<
    TCarouselProps,
    | "data"
    | "vertical"
    | "pagingEnabled"
    | "snapEnabled"
    | "loop"
    | "autoPlay"
    | "autoPlayInterval"
    | "autoPlayReverse"
    | "width"
    | "height"
    | "enabled"
  > {}
  const getDefaultBasicSettings: () => BasicSettings = () => {
    const settings = {
      vertical: false,
      pagingEnabled: true,
      snapEnabled: true,
      loop: true,
      autoPlay: false,
      autoPlayReverse: false,
      autoPlayInterval: 2000,
      data: defaultDataWith6Colors,
    };
    const PAGE_WIDTH = window.width;
    const demission = settings.vertical
      ? ({
          vertical: true,
          width: PAGE_WIDTH * 0.86,
          height: PAGE_WIDTH * 0.6,
        } as const)
      : ({
          vertical: false,
          width: PAGE_WIDTH,
          height: PAGE_WIDTH * 0.6,
        } as const);
  
    return {
      ...settings,
      ...demission,
    };
  };
interface AdvancedSettings extends BasicSettings {
  data: string[];
}

const constants = {
  PAGE_WIDTH: window.width,
};

export function useAdvancedSettings(
  options: {
    defaultSettings?: Partial<AdvancedSettings>;
  } = {},
) {
  const { defaultSettings = {} } = options;
  const [advancedSettings, setAdvancedSettings] =
    useState<Partial<TCarouselProps>>(defaultSettings);

  return {
    advancedSettings: {
      ...getDefaultBasicSettings(),
      ...advancedSettings,
    } as TCarouselProps,
    onAdvancedSettingsChange: setAdvancedSettings,
    constants,
  };
}