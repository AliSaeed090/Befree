import { useTheme } from '../config';
import { NavigationContainer } from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loading from '../screens/Loading';
import BuySubscription from '../screens/BuySubscription';
import InactiveSubscription from '../screens/InactiveSubscription';
import AiReport from '../screens/AiReport';

import SignIn from '../screens/SignIn';
// import ForgotPassword from '../screens/ForgotPassword';
// import Signup from '../screens/Signup';
import Welcome from '../screens/GetStarted/Welcome';
import OnBoarding_1 from '../screens/GetStarted/OnBoarding_1';
import OnBoarding_2 from '../screens/GetStarted/OnBoarding_2';
import OnBoarding_3 from '../screens/GetStarted/OnBoarding_3';
import OnBoarding_4 from '../screens/GetStarted/OnBoarding_4';
import OnBoarding_5 from '../screens/GetStarted/OnBoarding_5';
import HealthAssessment_1 from '../screens/HealthAssessment/HealthAssessment_1';
import HealthAssessment_2 from '../screens/HealthAssessment/HealthAssessment_2';
import HealthAssessment_3 from '../screens/HealthAssessment/HealthAssessment_3';
import HealthAssessment_4 from '../screens/HealthAssessment/HealthAssessment_4';
import HealthAssessment_5 from '../screens/HealthAssessment/HealthAssessment_5';
import HealthAssessment_6 from '../screens/HealthAssessment/HealthAssessment_6';
import HealthAssessment_7 from '../screens/HealthAssessment/HealthAssessment_7';
import HealthAssessment_8 from '../screens/HealthAssessment/HealthAssessment_8';
import HealthAssessment_9 from '../screens/HealthAssessment/HealthAssessment_9';
import AppointmentBooking_1 from '../screens/AppointmentBooking/AppointmentBooking_1';
import AppointmentBooking_2 from '../screens/AppointmentBooking/AppointmentBooking_2';
import AppointmentBooking_3 from '../screens/AppointmentBooking/AppointmentBooking_3';
import Signup from '../screens/PhoneAuth';
import ChangeLanguage from '../screens/ChangeLanguage';
import SymptomsCheckerResults from '../screens/SymptomsCheckerResults';
import SymptomsCheckerResultsDetails from '../screens/SymptomsCheckerResultsDetails';
import SymptomsChecker from '../screens/SymptomsChecker';
import SymptomsCheckerScreenOne from '../screens/SymptomsChecker/SymptomsChecker';

import PatientProfile from '../screens/PatientProfile';
// import MyTabs from './BottomTabNavigator';
import MyTabs from './CurvedBottomBar';
// import MyTabs from './CurevedTab';

import ThemeSetting from '../screens/ThemeSetting';
import { getProfile, GetLocationUsers } from '../../app/redux/slices/Auth';
import SelectDarkOption from '../screens/SelectDarkOption';
import SelectFontOption from '../screens/SelectFontOption';
import React, { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
// import Main from './main';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../../app/redux/index';

const RootStack = createNativeStackNavigator();
type props = {};
const Navigator = (props: props) => {
  const { isAuthenticated, selectedLocation } = useSelector(
    (state: any) => state.Auth,
  );
  const dispatch: AppDispatch = useDispatch();
  const { theme, colors }: any = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const forFade = ({ current, closing }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  useEffect(() => {
    // Hide screen loading
    // SplashScreen.hide();
    // Config status bar
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(true ? 'light-content' : 'dark-content', true);
  }, []);
  useEffect(() => {
    if (isAuthenticated === true) {
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <NavigationContainer theme={theme}>
        <RootStack.Navigator initialRouteName="Loading">
          <RootStack.Screen
            name="Loading"
            component={Loading}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="BuySubscription"
            component={BuySubscription}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="InactiveSubscription"
            component={InactiveSubscription}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="Welcome"
            component={Welcome}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="OnBoarding_1"
            component={OnBoarding_1}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="OnBoarding_2"
            component={OnBoarding_2}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="OnBoarding_3"
            component={OnBoarding_3}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="OnBoarding_4"
            component={OnBoarding_4}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="OnBoarding_5"
            component={OnBoarding_5}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="SignIn"
            component={Signup}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="ChangeLanguage"
            component={ChangeLanguage}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="Signup"
            component={Signup}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_1"
            component={HealthAssessment_1}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_2"
            component={HealthAssessment_2}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="HealthAssessment_3"
            component={HealthAssessment_3}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_4"
            component={HealthAssessment_4}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_5"
            component={HealthAssessment_5}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_6"
            component={HealthAssessment_6}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_7"
            component={HealthAssessment_7}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_8"
            component={HealthAssessment_8}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="HealthAssessment_9"
            component={HealthAssessment_9}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="PatientProfile"
            component={PatientProfile}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="AppointmentBooking_1"
            component={AppointmentBooking_1}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="AppointmentBooking_3"
            component={AppointmentBooking_3}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="AppointmentBooking_2"
            component={AppointmentBooking_2}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="SymptomsCheckerResults"
            component={SymptomsCheckerResults}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="SymptomsCheckerResultsDetails"
            component={SymptomsCheckerResultsDetails}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="SymptomsChecker"
            component={SymptomsCheckerScreenOne}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <RootStack.Screen
            name="SymptomsCheckertool"
            component={SymptomsChecker}
            options={{ gestureEnabled: false, headerShown: false }}
          />

          <RootStack.Screen
            name="AiReport"
            component={AiReport}
            options={{ gestureEnabled: false, headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{ gestureEnabled: false, headerShown: false }}
        />
        {/* <RootStack.Screen
            options={{gestureEnabled: false, headerShown: false}}
            name="Main"
            component={Main}
          /> */}

        <RootStack.Screen
          name="SelectDarkOption"
          component={SelectDarkOption}
          options={
            {
              // cardStyleInterpolator: forFade,
              // cardStyle: {
              //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
              // },
            }
          }
        />

        <RootStack.Screen
          name="SelectFontOption"
          component={SelectFontOption}
          options={
            {
              // cardStyleInterpolator: forFade,
              // cardStyle: {
              //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
              // },
            }
          }
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
