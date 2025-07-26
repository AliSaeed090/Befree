import { Text, SafeAreaView, Button } from '../../components';
import { useTheme, Images, BaseStyle, BaseSetting } from '../../config';
import React, { useEffect } from 'react';
import { Linking, Image, View, ScrollView, TouchableOpacity } from 'react-native';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      await auth().signOut();
      //console.log('User signed out!');
      navigation.replace('Welcome');
      // Navigate to the login screen or perform other actions
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={{width:"100%", justifyContent:"flex-end", alignItems:"flex-end", padding:20}}>
              <TouchableOpacity onPress={handleSignOut}>
                <Text bold>{t("sign_out")}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../assets/images/logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.row95}>
            <Text style={{ marginTop: 20 }} textAlign='center' header>{t("welcome_to_befree_health")}</Text>
            <Text style={{ marginTop: 20 }} textAlign='center' body1>{t("Thank_you_for_subscribing_to_BeFree")}</Text>
          </View>



        </View>

      </ScrollView>
      <View style={styles.row95}>
        <Button
          full
          loading={false}
          style={{ marginBottom: 50 }}
          onPress={() => Linking.openURL("https://www.befreehealth.ai/")}
        >
          {t('contact_us')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Loading;
