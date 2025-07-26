import {
  Platform,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
} from "react-native";





export const setupLayoutAnimation = () => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
};

export const enableExperimental = () => {
  if (Platform.OS === "android") {
    // UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const scaleWithPixel = (size:number, limitScale = 1.2) => {
  const scaleValue = PixelRatio.get() / 2;
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};

 

export const getWidthDevice = () => {
  return Dimensions.get("window").width;
};

export const getHeightDevice = () => {
  return Dimensions.get("window").height;
};

 

export const languageFromCode = (code:string) => {
  switch (code) {
    case "en":
      return "English";
    case "es":
      return "Spanish";
    case "vi":
      return "Vietnamese";
    case "ar":
      return "Arabic";
    case "da":
      return "Danish";
    case "de":
      return "German";
    case "el":
      return "Greek";
    case "fr":
      return "French";
    case "he":
      return "Hebrew";
    case "id":
      return "Indonesian";
    case "ja":
      return "Japanese";
    case "ko":
      return "Korean";
    case "lo":
      return "Lao";
    case "nl":
      return "Dutch";
    case "zh":
      return "Chinese";
    case "fa":
      return "Iran";
    case "km":
      return "Cambodian";
    default:
      return "en";
  }
};

export const isLanguageRTL = (code:string) => {
  switch (code) {
    case "ar":
    case "he":
      return true;
    default:
      return false;
  }
};

export const reloadLocale = (oldLanguage:string, newLanguage:string) => {
 
  const RNRestart = require('react-native-restart');
  const oldStyle = isLanguageRTL(oldLanguage);
  const newStyle = isLanguageRTL(newLanguage);
  if (oldStyle != newStyle) {
    I18nManager.forceRTL(newStyle);
    RNRestart.Restart();
  }
};

