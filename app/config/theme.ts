import {useSelector} from 'react-redux';
import {useColorScheme} from 'react-native';
// import {useDarkMode} from 'react-native-dynamic';

/**
 * Define Const color use for whole application
 */
export const BaseColor = {
  grayColor: '#646470',
  dividerColor: '#BDBDBD',
  whiteColor: '#FFFFFF',
  fieldColor: '#F5F5F5',
  yellowColor: '#FDC60A',
  navyBlue: '#3C5A99',
  kashmir: '#5D6D7E',
  orangeColor: '#E5634D',
  blueColor: '#5DADE2',
  pinkColor: '#A569BD',
  greenColor: '#58D68D',
};

/**
 * Define Const list theme use for whole application
 */
export const ThemeSupport = [
  {
    theme: 'default',
    light: {
      dark: false,
      colors: {
        primary: '#1E64FA',
        primaryDark: '#FFA000',
        primaryLight: '#FFECB3',
        accent: '#795548',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#1E64FA',
        primaryDark: '#FFA000',
        primaryLight: '#FFECB3',
        accent: '#795548',
        background: '#0F172A',
        card: '#1E293B',
        text: '#e5e5e7',
        border: '#272729',
      },
    },
  },
];

/**
 * Define default theme use for whole application
 */
export const DefaultTheme = {
  theme: 'default',
  light: {
    dark: false,
    colors: {
      primary: '#1E64FA',
      primaryDark: '#FFA000',
      primaryLight: '#FFECB3',
      accent: '#795548',
      background: 'white',
      card: '#F5F5F5',
      text: '#212121',
      border: '#c7c7cc',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#1E64FA',
      primaryDark: '#FFA000',
      primaryLight: '#FFECB3',
      accent: '#795548',
      background: '#0F172A',
      card: '#1E293B',
      text: '#e5e5e7',
      border: '#272729',
    },
  },
}

/**
 * Define list font use for whole application
 */
export const FontSupport = [];

/**
 * Define font default use for whole application
 */
export const DefaultFont = 'ProximaNova';

/**
 * export theme and colors for application
 * @returns theme,colors
 */
export const useTheme = () => {
  // const isDarkMode = useDarkMode();
  // const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = true;
  const forceDark = useSelector((state: any) => state.application.force_dark);
  const themeStorage = useSelector((state: any) => state.application.theme);
  const listTheme = ThemeSupport.filter(item => item.theme == themeStorage);
  const theme = listTheme.length > 0 ? listTheme[0] : DefaultTheme;

  if (forceDark) {
    return {theme: theme.dark, colors: theme.dark.colors};
  }
  // if (forceDark == false) {
  //   return {theme: theme.light, colors: theme.light.colors};
  // }
  return isDarkMode
    ? {theme: theme.dark, colors: theme.dark.colors}
    : {theme: theme.light, colors: theme.light.colors};
};

/**
 * export font for application
 * @returns font
 */
export const useFont = () => {
  const font = useSelector((state: any) => state.application.font);
  return font ?? DefaultFont;
};
