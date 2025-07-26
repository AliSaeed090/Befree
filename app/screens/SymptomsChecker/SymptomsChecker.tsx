import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/index';
import {SafeAreaView, Button, Text, Header} from '../../components';
import {BaseColor, BaseStyle, useTheme, Images} from '../../config';

import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import {useTranslation} from 'react-i18next';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {use} from 'i18next';
import {useUser} from '../../contexts/User';
import EmotionSlider from '../HealthAssessment/components/EmotionSlider';

const Dashboard = (props: any) => {
  const {ref} = props;
  //console.log({ref: props});
  const {user: userData} = useUser();

  const {t} = useTranslation();
  const [gender, setGender] = useState('Male');
  const [scores, setScores] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const defaultDataWith6Colors: any = [
    {
      id: 1,
      text: t('depressed'),
      icon_gray: Images.depressed_gray,
      icon_blue: Images.depressed_blue,
    },
    {
      id: 2,
      text: t('sad'),
      icon_gray: Images.sad_gray,
      icon_blue: Images.sad_blue,
    },
    {
      id: 3,
      text: t('neutral'),
      icon_gray: Images.nuetral_gray,
      icon_blue: Images.nuetral_blue,
    },
    {
      id: 4,
      text: t('happy'),
      icon_gray: Images.happy_gray,
      icon_blue: Images.happy_blue,
    },
    {
      id: 5,
      text: t('overjoyed'),
      icon_gray: Images.overjoyed_gray,
      icon_blue: Images.overjoyed_blue,
    },
  ];
  const {theme, colors} = useTheme();
  const navigation: any = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const {isAuthenticated, selectedLocation} = useSelector(
    (state: any) => state.Auth,
  );
  useFocusEffect(React.useCallback(() => {}, [dispatch]));
  const {overAll, stress, depression, anxiety, suicide} = userData?.SymptomsCheckerResults??{
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
    setSelectedIndex(index);
  };
  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    //console.log({scores, overAll, stress, depression, anxiety, suicide});
    if (overAll && stress && depression && anxiety && suicide) {
      setList([
        {text: t('Stress'), scores: stress, id: 1},
        {text: t('Depression'), scores: depression, id: 2},
        {text: t('Anxiety'), scores: anxiety, id: 3},
        {text: t('Suicide risk'), scores: suicide, id: 4},
      ]);
    }
  }, [overAll, stress, depression, anxiety, suicide]);
  const getColor = (score: number) => {
    //console.log({score});
    if (score <= 25) {
      return colors.primary;
    } else if (score <= 50) {
      return '#D97706';
    } else if (score <= 75) {
      return '#D97706';
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
        <Header
          style={{
            // backgroundColor: '#334155',
            borderBottomStartRadius: 20,
            borderBottomEndRadius: 20,
            height: 80,
          }}
          renderLeft={() => (
            <View style={styles.leftbtn}>
              <FontAwesome name="angle-left" size={30} color={'white'} />
            </View>
          )}
          onPressLeft={() => {
            navigation.goBack();
          }}
     
          renderCenterConetent={() => (
            <View style={styles.contentCenter}>
              <Text callout bold>
             
              </Text>
              <Text callout bold>
               
              </Text>
            </View>
          )}
          // renderRight={() => (
          //   <FontAwesome name="bell" size={25} color={'white'} />
          // )}
        />

        <View style={{backgroundColor: colors.background}}>
          <>
            <View
              style={{
                width: '95%',
                // alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
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
              <Text callout textAlign="center" style={{marginTop: 16}}>
                {t(
                  'get_your_symptom_checked_with_our_ai_technology_right_here_and_now.',
                )}
              </Text>
              <Text caption1 textAlign="center" style={{marginTop: 16}}>
                {t(
                  'disclaimer',
                )}
              </Text>
            </View>

            <View
              style={{
                width: '95%',
                // alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginVertical: 5,
              }}>
              <Button
                full
                iconRight={
                  <FontAwesome5
                    style={{marginLeft: 20}}
                    name="diagnoses"
                    size={20}
                    color={'white'}
                  />
                }
                loading={false}
                style={{marginTop: 20}}
                onPress={() => {
                  navigation.navigate('SymptomsCheckertool', {
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
           {overAll!==null && <Button
                full
                iconRight={
                  <Octicons
                    style={{marginLeft: 20}}
                    name="file-diff"
                    size={30}
                    color={'white'}
                  />
                }
                loading={false}
                style={{marginTop: 20}}
                onPress={() => {
                  navigation.navigate('AiReport', {
                    scores: {
                      stress: 10,
                      depression: 30,
                      anxiety: 60,
                      suicide: 80,
                    },
                  });
                }}>
                {t('Check_my_ai_report')}
              </Button>}
            </View>
          </>
        </View>
        <View style={{width: '100%', height: 200}} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Dashboard;
