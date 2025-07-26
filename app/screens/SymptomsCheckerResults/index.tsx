import React, {useState, useEffect} from 'react';
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
  ScrollView,
  Touchable,
} from 'react-native';
import Slider from '@react-native-community/slider';

import {SafeAreaView, Button, Text, Header} from '../../components';
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {use} from 'i18next';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {useUser} from '../../contexts/User';

interface Props {
  navigation: any;
  route: any;
}
// What is your health goal for the app?
const AppointmentBooking_1: React.FC<Props> = ({route, navigation}) => {
  const {user:userData} = useUser();

  const {t} = useTranslation();
  const {scores} = route.params;
  const {colors} = useTheme();
  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    if (scores) {
      setList([
        {text: t('Stress'), scores: scores.stress, id: 1, val:'Stress'},
        {text: t('Depression'), scores: scores.depression, id: 2, val:'Depression'},
        {text: t('Anxiety'), scores: scores.anxiety, id: 3, val:'Anxiety'},
        {text: t('Suicide risk'), scores: scores.suicide, id: 4, val:'Suicide risk'},
      ]);
    }
  }, [scores]);
  const getColor = (score: number) => {
    if (score <= 25) {
      return colors.primary;
    } else if (score <= 50) {
      return "#D97706";
    } else if (score <= 75) {
      return "#D97706";
    } else {
      return '#F43F5E';
    }
  };
  const getLevel = (score: number) => {
    if (score <= 25) {
      return t('low');
    } else if (score <= 50) {
      return t('moderate');
    } else if (score <= 75) {
      return t('high');
    } else {
      return t('critical');
    }
  };
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
      <ScrollView>
        <View style={styles.row_center_95}>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
            <Image
              source={Images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text title1>{t('hello')} {userData?.firstName} ! 👋</Text>
            <Text>
              {/* Your Symptom Check results are ready! This tool will help you
              understand your current state and provide guidance for improving
              your well-being. Let's dive in and see what we can learn. */}
              {t('Your_Symptom_Check_results_are_ready')}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {list.map((x: any, index: number) => {
              return (
                <TouchableOpacity
                  key={x.id}
                  onPress={() => {
                    navigation.navigate('SymptomsCheckerResultsDetails', {
                      scores: x.scores,
                      level: getLevel(x.scores),
                      color: getColor(x.scores),
                      text: x.val,
                    });
                  }}
                  //   underlayColor="#ddd"
                  style={[
                    {
                      ...styles.ListView,
                      backgroundColor: colors.card,
                      width: '100%',
                    },
                  ]}
                  // key={x.index}
                >
                  <View
                    style={{
                      ...styles.ListViewText,
                    }}>
                    {/* <FontAwesome5 name={x.icon} size={20} color={'white'} /> */}
                    <Text whiteColor bold body2>
                      {t(x.text)}
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        overflow: 'hidden',
                        // flexWrap: 'center',
                      }}>
                      <View style={styles.contentCenter}>
                        <View
                          style={[
                            styles.contentCenter,
                            {
                              width: `${x.scores}%`,
                              backgroundColor: getColor(x.scores),
                            },
                          ]}></View>
                      </View>
                      <FontAwesome
                        style={{marginLeft: 20}}
                        name="angle-right"
                        size={30}
                        color={'white'}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: 20,
                        // marginVertical: 16,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          // width: '30%',
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <MaterialIcons
                          name="bar-chart"
                          size={20}
                          color={colors.primary}
                        />
                        <Text whiteColor body2>
                          {getLevel(x.scores) + " " + t('Match')}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          // width: '30%',
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <FontAwesome
                          name="warning"
                          size={15}
                          color={BaseColor.grayColor}
                        />
                        <Text whiteColor body2>
                          {getLevel(x.scores) + " " + t('Risk')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{width: '100%', marginVertical: 16}}>
            {/* <Button
              full
              iconRight={
                <FontAwesome
                  style={{marginLeft: 20}}
                  name="calendar"
                  size={20}
                  color={'white'}
                />
              }
              loading={false}
              style={{marginTop: 20}}
              onPress={() => {
                navigation.navigate('AppointmentBooking_1');
              }}>
              {t('schedule_new_appointment')}
            </Button> */}
            <Button
              full
              iconRight={
                <FontAwesome
                  style={{marginLeft: 20}}
                  name="refresh"
                  size={20}
                  color={'white'}
                />
              }
              loading={false}
              style={{marginTop: 20, backgroundColor: colors.card}}
              onPress={() => {
                navigation.navigate('SymptomsChecker');
              }}>
              {t('Re_Take_Symptom_Check')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentBooking_1;
