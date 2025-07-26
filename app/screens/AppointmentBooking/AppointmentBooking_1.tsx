import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
  Pressable,
  Linking,
  Touchable,
} from 'react-native';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../../contexts/User';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { use } from 'i18next';
import { Positions } from 'react-native-calendars/src/expandableCalendar';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const AppointmentBooking_1: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user: userData } = useUser();

  const [list, setList] = useState<Array<any>>([

  ]);

  useEffect(() => {
    if (userData?.subscriptions?.plan_id === "befree_fullcare") {
      setList([

        { id: "Psychiatry", icon: 'robot', text: t('psychiatry'), isChecked: true },

      ]);
    } else {
      setList([
        { id: "Psychology", icon: 'sad-cry', text: t('psychology'), isChecked: true, },

      ]);
    }

  }, [userData]);
  const searchDoctor = async () => {
    setLoading(true);
    let selectedDoctor = list
      .filter((x: any) => x.isChecked)
      .map((x: any) => x.id)[0];
    let doctors = await firestore()
      .collection('doctors')
      .where('department', '==', selectedDoctor)
      .get();
    if (doctors.docs.length > 0) {
      let doctorsData = doctors.docs.map((x: any) => x.data());
      navigation.navigate('AppointmentBooking_2', { doctors: doctorsData })
    } else {
      setError(t('doctor_not_found'));
    }
    setLoading(false);
    // //console.log({doctor: doctors.docs.map((x: any) => x.data())});
    // doctors.forEach(async (doctor: any) => {
    //   //console.log({doctor});
    // });
  };
  const updateList = (x: any, i: number) => {
    // x.isChecked = !x.isChecked;

    let arr = list.map((x: any) => {
      return {
        ...x,
        isChecked: false
      }
    })
    arr[i].isChecked = true

    setList([...arr]);
  }
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        renderLeft={() => (
          <View style={styles.leftbtn}>
            <FontAwesome name="angle-left" size={30} color={'white'} />
          </View>
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.row_center_95}>
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 24 }}>
          <Text title1>{t('select_specialization')}</Text>
          <Text>{t('Select_before_booking_appointment')}</Text>
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          {list.map((x: any, i: number) => {
            // return null
            return (
              <Pressable
                onPress={() => {
                  updateList(x, i)
                }}
                //   underlayColor="#ddd"
                style={({ pressed }) => [
                  { ...styles.ListView, backgroundColor: colors.card, width: "100%" },
                  {
                    backgroundColor: pressed ? '#fff' : 'transparent',
                    borderColor: x.isChecked ? '#0F67FE40' : 'transparent',
                  },
                ]}
                key={x.id}>
                <View
                  style={{
                    ...styles.ListViewText,
                    backgroundColor: x.isChecked ? colors.primary : colors.card,
                  }}>
                  {/* <FontAwesome5 name={x.icon} size={20} color={'white'} /> */}
                  <Text textAlign="center" whiteColor bold body2>
                    {t(x.text)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ width: '100%', marginVertical: 16 }}>
          {error && (
            <Text callout bold style={{ color: 'red' }}>
              {error}
            </Text>
          )}
          <Button
            full
            iconRight={
              <FontAwesome
                style={{ marginLeft: 20 }}
                name="search"
                size={20}
                color={'white'}
              />
            }
            loading={loading}
            style={{ marginTop: 20 }}
            onPress={() => {
              // navigation.navigate('AppointmentBooking_2');
              searchDoctor();
            }}>
            {t('search_doctor')}
          </Button>
        </View>

        {(userData?.subscriptions?.plan_id != "befree_fullcare") && <Button
          full
  onPress={() => Linking.openURL("https://portal.befreehealth.ai/")}
          iconRight={
            <FontAwesome5
              style={{ marginLeft: 20 }}
              name="plus"
              size={20}
              color={'white'}
            />
          }
          loading={false}
          style={{   positions:"absolute", bottom:0 }}>
          {t('Schedule_with_Psychiatrist_Upgrade_Your_Plan')}
        </Button>}
      </View>
    </SafeAreaView>
  );
};

export default AppointmentBooking_1;
