import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, Switch, ScrollView, Image, Linking,Alert} from 'react-native';
import {BaseStyle, useTheme} from '../../config';
import {BaseSetting, Images} from '../../config';
import {Header, SafeAreaView, Icon, Text} from '../../components';
import {useTranslation} from 'react-i18next';
import * as Utils from '../../utils';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useUser} from '../../contexts/User';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import axios from '../../utilities/axios';

export default function Setting() {
  const {updateUserData, submitUserData, user, getUserData} = useUser();
const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const forceDark = useSelector(state => state.application.force_dark);
  const font = useSelector(state => state.application.font);

  const [reminders, setReminders] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  /**
   * @description Call when reminder option switch on/off
   */
  // const toggleSwitch = value => {
  //   setReminders(value);
  // };

  const darkOption = forceDark
    ? t('always_on')
    : forceDark != null
    ? t('always_off')
    : t('dynamic_system');
  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      await auth().signOut();
      //console.log('User signed out!');
      // Navigate to the login screen or perform other actions
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDeleteAccount = () => {
    // Show confirmation alert
    Alert.alert(
      t( "delete_account"),
      t("Are_you_sure_you_want_to_delete_your_account"),
      [
        {
          text: t("cancel"),
          style: "cancel"
        },
        {
          text: t("delete"),
          style: "delete",
          onPress: async () => {
            const user = auth().currentUser;
            if (user) {
             cancelSubscription(user.uid)
              try {
                // Delete the user's document from Firestore
                await firestore().collection('users').doc(user.uid).delete();

                // Delete the user from Firebase Authentication
                await user.delete();
                navigation.replace('Welcome');
                
                // handleSignOut()
                Alert.alert(t("account_deleted"),t("your_account_has_been_deleted_successfully"));
               
              } catch (error) {
                console.error("Error deleting user:", error);
                Alert.alert("Error", "An error occurred while deleting your account.");
              }
            } else {
              Alert.alert("No User", "No user is currently signed in.");
            }
          }
        }
      ]
    );
  };

  const cancelSubscription = async (userId) => {
    try {
      const response = await axios.post(
        `/cancel-subscription/?user_id=${userId}`,
        null, // Empty body
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      console.log('Subscription canceled:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      {/* <Header
        title={t('setting')}
        renderLeft={() => {
          return (
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      /> */}
      <Header
        renderLeft={() => (
          <View style={styles.leftbtn}>
            <FontAwesome name="angle-left" size={30} color={'white'} />
          </View>
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
        title={t('profile_setup')}
      />
      <ScrollView contentContainerStyle={styles.contain}>
        <View
          style={{
            alignSelf: 'center',
            marginVertical: 20,
            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <Image
            source={
              user?.profileImageUrl ? {uri: user?.profileImageUrl} : Images.profilePic
            }
            style={styles.logo}
            resizeMode="cover"
          />
          <Text title1 style={{marginTop: 10}} textAlign="center">
            {user?.firstName + ' ' + user?.lastName}
          </Text>
        </View>
        <Text style={{marginVertical: 10}} headline>
          {t('genral_settings')}
        </Text>
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => {
            navigation.navigate('PatientProfile');
          }}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <FontAwesome name="user" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('Personal_Info')}
            </Text>
          </View>
          <View style={styles.row2}>
            <FontAwesome
              name="angle-right"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.profileItem}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <FontAwesome name="bell" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('notification')}
            </Text>
          </View>
          <View style={styles.row2}>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => {
            navigation.navigate('ChangeLanguage');
          }}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <FontAwesome name="language" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('language')}
            </Text>
          </View>
          <View style={styles.row2}>
            <Text body1 style={{marginRight: 10}} grayColor>
              {Utils.languageFromCode(i18n.language)}
            </Text>
            <FontAwesome
              name="angle-right"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            />
          </View>
        </TouchableOpacity>
        <Text style={{marginVertical: 10}} headline>
          {t('Help_&_Support')}
        </Text>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => {
           Linking.openURL("https://www.befreehealth.ai/empresas#team")
          }}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <AntDesign name="team" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('about')}
            </Text>
          </View>
          <View style={styles.row2}>
            <FontAwesome
              name="angle-right"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => {
            Linking.openURL("https://www.befreehealth.ai/contact")
          }}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <FontAwesome name="question-circle" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('Help_Center')}
            </Text>
          </View>
          <View style={styles.row2}>
            <FontAwesome
              name="angle-right"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            />
          </View>
        </TouchableOpacity>
        <Text style={{marginVertical: 10}} headline>
          {t('sign_out')}
        </Text>

        <TouchableOpacity 
        onPress={()=>{
          handleSignOut();
        }}
        style={styles.profileItem}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <AntDesign name="logout" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('sign_out')}
            </Text>
          </View>
          <View style={styles.row2}>
          <FontAwesome
              name="angle-right"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            />
          </View>
        </TouchableOpacity>
        <Text style={{marginVertical: 10}} headline>
          {t('delete_account')}
        </Text>
        <TouchableOpacity 
        onPress={()=>{
          handleDeleteAccount();
        }}
        style={styles.profileItem}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <FontAwesome name="trash" size={30} color={'white'} />
            </View>
            <Text style={{marginLeft: 20}} headline>
              {t('delete_account')}
            </Text>
          </View>
          <View style={styles.row2}>
          {/* <FontAwesome
              name="trash"
              size={28}
              color={'white'}
              style={{marginLeft: 5}}
            /> */}
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.profileItem,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
          ]}
          onPress={() => navigation.navigate("SelectFontOption")}
        >
          <Text body1>{t("font")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text body1 grayColor>
              {font ?? t("default")}
            </Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{ marginLeft: 5 }}
              enableRTL={true}
            />
          </View>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={[
            styles.profileItem,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
          ]}
          onPress={() => {
            navigation.navigate("SelectDarkOption");
          }}
        >
          <Text body1>{t("dark_theme")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text body1 grayColor>
              {darkOption}
            </Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{ marginLeft: 5 }}
              enableRTL={true}
            />
          </View>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={[
            styles.profileItem,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
          ]}
          onPress={() => {
            handleSignOut();
          }}>
          <Text body1>{t('sign_out')}</Text>
          <AntDesign
            name="logout"
            size={18}
            color={colors.primary}
            style={{marginLeft: 5}}
            enableRTL={true}
          />
        </TouchableOpacity> */}
        {/* <View
          style={[
            styles.profileItem,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
            { paddingVertical: 15 },
          ]}
        >
          <Text body1>{t("notification")}</Text>
          <Switch size={18} onValueChange={toggleSwitch} value={reminders} />
        </View> */}
        {/* <View style={styles.profileItem}>
          <Text body1>{t('app_version')}</Text>
          <Text body1 grayColor>
            {BaseSetting.appVersion}
          </Text>
        </View> */}
        <View style={{width:"100%", height:200}} />
      </ScrollView>
    </SafeAreaView>
  );
}
