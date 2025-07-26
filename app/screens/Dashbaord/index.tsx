import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme, Images } from '../../config';

import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import MyAppointments from '../MyAppointments';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { use } from 'i18next';
import { useUser } from '../../contexts/User';
import EmotionSlider from '../HealthAssessment/components/EmotionSlider';
import { useAskQuery, useChats } from '../AiChat/hooks/useAskQuery';
import auth from '@react-native-firebase/auth';

const Dashboard = (props: any) => {

  const { ref } = props;
  //console.log({ref: props});
  const { user: userData } = useUser();
  const { mutateAsync, isPending, isError, data, error } = useAskQuery();
  const { data: chats, isLoading, error: chatError, refetch } = useChats();
  const { t } = useTranslation();
  const [gender, setGender] = useState('Male');
  const [scores, setScores] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const defaultDataWith6Colors: any = [
    {
      id: 1,
      text: t('depressed'),
      how_Im_feeling: t('I_am_depressed_today'),
      icon_gray: Images.depressed_gray,
      icon_blue: Images.depressed_blue,
    },
    {
      id: 2,
      text: t('sad'),
      how_Im_feeling: t('I_am_sad_today'),
      icon_gray: Images.sad_gray,
      icon_blue: Images.sad_blue,
    },
    {
      id: 3,
      text: t('neutral'),
      how_Im_feeling: t('I_am_neutral_today'),
      icon_gray: Images.nuetral_gray,
      icon_blue: Images.nuetral_blue,
    },
    {
      id: 4,
      text: t('happy'),
      how_Im_feeling: t('I_am_happy_today'),
      icon_gray: Images.happy_gray,
      icon_blue: Images.happy_blue,
    },
    {
      id: 5,
      text: t('overjoyed'),
      how_Im_feeling: t('I_am_overjoyed_today'),
      icon_gray: Images.overjoyed_gray,
      icon_blue: Images.overjoyed_blue,
    },
  ];
  const { theme, colors } = useTheme();
  const navigation: any = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, selectedLocation } = useSelector(
    (state: any) => state.Auth,
  );
  // useFocusEffect(React.useCallback(() => { }, [dispatch]));
  const { overAll, stress, depression, anxiety, suicide } = userData?.SymptomsCheckerResults ?? {
    overAll: null,
    stress: null,
    depression: null,
    anxiety: null,
    suicide: null,
  };
  useEffect(() => {
    getScrores();
    getGender();
  }, []);
  const getGender = async () => {
    try {
      const gender = await AsyncStorage.getItem('gender');
      //console.log({gender});
      if (gender) {
        setGender(gender);
      }
    } catch (error) {
      console.error('Error retrieving item', error);
    }
  };
  const getScrores = async () => {
    const scoresRes = await AsyncStorage.getItem('SymptomsCheckerResults');
    // setScores(scoresRes??null);
  };
  const updateEmotion = (index: number) => {
    // //console.log('feeling', text);
    // setFeeling(text)
    let object = defaultDataWith6Colors[index]
    console.log({ object })

    const uid = auth().currentUser?.uid;

    let obj: any = {
      _id: Math.round(Math.random() * 1000000),
      text: object.how_Im_feeling,
      createdAt: new Date(),
      user: {
        _id: uid,
        name: '',
        avatar: '',
      },
    }

    console.log({obj,userData})
    mutateAsync({
      ...obj,
      user_id: uid,
      emergency_contact_no: userData?.emergencyPhone ?? "",
      user_name: userData.firstName + userData?.lastName ?? "",
      // user_id: message.user._id,
    }).then((res: any) => {
      refetch()

    });
    setSelectedIndex(index);
    navigation.navigate('AiChat', { feelings: object.how_Im_feeling })
  }




  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    //console.log({scores, overAll, stress, depression, anxiety, suicide});
    if (overAll && stress && depression && anxiety && suicide) {
      setList([
        { text: t('Stress'), scores: stress, id: 1, val:'Stress' },
        { text: t('Depression'), scores: depression, id: 2 , val:'Depression'},
        { text: t('Anxiety'), scores: anxiety, id: 3, val:'Anxiety'},
        { text: t('Suicide risk'), scores: suicide, id: 4, val:'Suicide risk'},
      ]);
    }
  }, [overAll, stress, depression, anxiety, suicide]);
  const getColor = (score: number) => {
    //console.log({score});
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
    <> 
    <SafeAreaView style={{ flex:0, backgroundColor:colors.card, height:80 ,borderBottomStartRadius: 20,
            borderBottomEndRadius: 20, zIndex:1 }} >
    <Header
          style={{
            backgroundColor: colors.card,
            // backgroundColor:"red",
            borderBottomStartRadius: 20,
            borderBottomEndRadius: 20,
            height: 80,  
            zIndex:10
          }}
          renderLeft={() => (
            <View style={styles.leftbtn}>
              <Image
                source={
                  userData?.profileImageUrl
                    ? { uri: userData.profileImageUrl }
                    : Images.profilePic
                }
                style={{ width: 48, height: 48, borderRadius: 50 , marginBottom:25}}
              />
            </View>
          )}
          onPressLeft={() => {
            navigation.navigate('PatientProfile');
          }}
          renderCenterConetent={() => (
            <View style={styles.contentCenter}>
              <Text callout bold>
                {t('hello')} {userData?.firstName} ! 👋
              </Text>
              <Text callout bold>
                {/* {scores? + "+" +scores:''} */}+{' '}
                {userData?.SymptomsCheckerResults?.overAll}
              </Text>
            </View>
          )}
        // renderRight={() => (
        //   <FontAwesome name="bell" size={25} color={'white'} />
        // )}
        />
        </SafeAreaView>
    <SafeAreaView
      style={[
        // BaseStyle.safeAreaView,
        {
          // backgroundColor: colors.card,

          borderBottomStartRadius: 32,
          borderBottomEndRadius: 32,
        },
      ]}
      edges={['right', 'top', 'left']}>
      
      <ScrollView>

      

        {/* <ScrollView horizontal> */}

        {/* </ScrollView> */}
        <View style={{ backgroundColor: colors.background }}>
          <View style={styles.row_center_95}>
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {t('how_are_you')}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              // height: 300,
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              maxWidth: '95%',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {defaultDataWith6Colors.map((item: any, index: any) => (
              <TouchableOpacity
                onPress={() => updateEmotion(index)}
                style={{ alignItems: 'center' }}
                key={index}>
                <Image
                  source={
                    selectedIndex === index
                      ? item.icon_blue
                      : item.icon_gray
                  }
                  style={styles.icon}
                />
                <Text
                  overline
                  bold
                  textAlign="center"
                  style={{ marginTop: 5 }}>
                  {item.text}
                </Text>
                {/* <Image
              source={item.icon_blue}
              style={styles.icon}
            /> */}
              </TouchableOpacity>
            ))}
          </View>
          {!userData?.SymptomsCheckerResults?.overAll && (
            <>
              <View style={styles.row_center_95}>
                <Image
                  source={
                    gender === 'Male' ? Images.DashbaordM : Images.DashbaordF
                  }
                  style={{
                    width: '100%',
                    height: 360,
                    marginVertical: 16,
                    borderRadius: 20,
                    // borderRadius: 16,
                    resizeMode: 'cover',
                  }}
                />
                <Text bold whiteColor textAlign="center" header>
                  {t('ai_mental_illness_symptom_checker')}
                </Text>
                <Text callout textAlign="center" style={{ marginTop: 16 }}>
                  {t(
                    'get_your_symptom_checked_with_our_ai_technology_right_here_and_now.',
                  )}
                </Text>
              </View>



              <View style={{ ...styles.row_center_95, marginVertical: 5 }}>
                <Button
                  full
                  iconRight={
                    <FontAwesome5
                      style={{ marginLeft: 20 }}
                      name="diagnoses"
                      size={20}
                      color={'white'}
                    />
                  }
                  loading={false}
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    navigation.navigate('SymptomsChecker', {
                      scores: {
                        stress: 10,
                        depression: 30,
                        anxiety: 60,
                        suicide: 80,
                      },
                    });
                  }}>
                  {t('check_my_symptom')}
                </Button>
              </View>
            </>
          )}
          <MyAppointments />
          {userData?.SymptomsCheckerResults?.overAll && (
            <>
              <>

                <View style={styles.row_center_95}>
                  <Text style={{ marginTop:20 }} textAlign='center' bold whiteColor title3>

                    {t('Your_Symptom_Checker_results')}
                  </Text>
                  <View
                    style={{
                      marginTop: 12,
                      // flexDirection: 'row',
                      // justifyContent: 'space-between',
                      // flexWrap: 'wrap',
                      overflow: 'hidden',
                    }}>
                    {list.map((x: any, index: number) => {
                      //console.log({x})
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
                              <View style={styles.contentCenter2}>
                                <View
                                  style={[
                                    styles.contentCenter2,
                                    {
                                      width: `${x.scores}%`,
                                      backgroundColor: getColor(x.scores),

                                    },
                                  ]}></View>
                              </View>
                              <FontAwesome
                                style={{ marginLeft: 20 }}
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
                </View>
              </>
            </>
          )}
        </View>

        <View style={{ width: '100%', height: 200 }} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
};
export default Dashboard;
