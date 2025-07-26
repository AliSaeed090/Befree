import { Text } from '../../components';
import { useTheme, Images, BaseSetting } from '../../config';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import styles from './styles';
import { onChangeLanguage } from '../../redux/slices/application';
import i18n, { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { useNavigation } from '@react-navigation/native';
// import type {StackNavigationProp} from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../contexts/User';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/locale/de'; // German
import 'moment/locale/en-gb'; //
import { create } from 'react-test-renderer';
interface LoadingScreenProps { }
const Loading: React.FC<LoadingScreenProps> = () => {
  const { isAuthenticated } = useSelector((state: any) => state.Auth);
  const {
    getUserData,
    submitUserData,
    user: userData,
    loading: loadingUserData,
  } = useUser();

  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {

    // Get current language of device
    const locales = RNLocalize.getLocales();
    const { languageCode } = locales?.[0] ?? {
      languageCode: BaseSetting.defaultLanguage,
    };
    //console.log({languageCode});
    if (BaseSetting.languageSupport.includes(languageCode)) {
      //console.log({languageCode: 'languageCode'});
      dispatch(onChangeLanguage(languageCode));
    } else {
      dispatch(onChangeLanguage('en'));
    }

    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources: BaseSetting.resourcesLanguage,
      lng: languageCode,
      fallbackLng: 'en',
    });


    const unsubscribe = auth().onAuthStateChanged(async user => {
      // //console.log({user});
      // navigation.replace('MyTabs');
      // navigation.replace('HealthAssessment_1');
      // navigation.replace('BuySubscription');

      // return
      // console.log("onAuthStateChanged")
     
      if (user) {
        // updateFcmToken(user.uid);

        const userData = await getUserData();
    //  console.log({userData:userData.subscriptions})
        if (userData?.subscriptions) {
          // If user data exists
        // console.log({appStatus:userData.subscriptions.appStatus})
          if (userData?.subscriptions.appStatus === null) {
            navigation.replace('BuySubscription');

          } else if (userData?.subscriptions.appStatus === "inactive") {

            navigation.replace('InactiveSubscription');

          }
          else if (userData?.subscriptions.appStatus === "companyInactive") {
            navigation.replace('InactiveSubscription');

          }
          else if (userData?.subscriptions.appStatus === "companyCancelled") {
            navigation.replace('BuySubscription');
          }
          else if (userData?.subscriptions.appStatus === "cancelled") {
            navigation.replace('BuySubscription');
          }
          else if (!userData.emergencyPhone) {
            navigation.replace('HealthAssessment_1');
          }

          else {
            
            navigation.replace('MyTabs');
          }

        } else if (loadingUserData === false && userData === null) {
          // If user data doesn't exist and loading is false
          navigation.replace('HealthAssessment_1');
        }
      } else {
        // If user is null
        navigation.replace('Welcome');
        // navigation.replace('BuySubscription');
      }
    });



    // onProcess();
    return () => unsubscribe();
  }, []);
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo3.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActivityIndicator
        size="large"
        color={colors.text}
        style={{
          // position: 'absolute',
          // top: 260,
          marginTop: 20,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </View>
  );
};

export default Loading;
