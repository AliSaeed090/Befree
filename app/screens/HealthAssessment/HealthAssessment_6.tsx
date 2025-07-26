import React, {useState} from 'react';
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
  Touchable,
  ScrollView
} from 'react-native';
import {SafeAreaView, Button, Text, Header} from '../../components';
import EmotionSlider from './components/EmotionSlider';

import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../contexts/User';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const HealthAssessment_6: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {updateUserData} = useUser();
  const [feeling, setFeeling] = useState<any>(" ")
  const {colors} = useTheme();
  const [list, setList] = useState<Array<any>>([
    {id: 1, icon: 'sad-cry', text: 'reduceStress', isChecked: false},
    {id: 2, icon: 'robot', text: 'tryAITherapy', isChecked: false},
    {id: 3, icon: 'heart-broken', text: 'copeWithTrauma', isChecked: false},
    {
      id: 4,
      icon: 'grin-stars',
      text: 'beABetterPerson',
      isChecked: false,
    },
    {id: 5, icon: 'stethoscope', text: 'meetSpecialist', isChecked: false},
    {id: 6, icon: 'tablet-alt', text: 'tryOutApp', isChecked: false},
  ]);
  const nextScreen = () => {
    

    updateUserData('feeling',  feeling);
    navigation.navigate('HealthAssessment_7');
  };
  const updateEmotion = (text:string)=>{
    //console.log('feeling', text);
    setFeeling(text)
  }
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
       onPressRight={() => navigation.replace('MyTabs')}
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
            <View
              style={[
                styles.contentCenter,
                {width: '60%', backgroundColor: colors.primary},
              ]}></View>
          </View>
        )}
        // renderRight={() => (
        //   <Text callout bold>
        //     {t('skip')}
        //   </Text>
        // )}
      />
      <ScrollView>
      <View style={styles.row_center_95}>
        <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
          <Text title1 textAlign="center">
            {t('What_is_your_current_emotion_right_now')}
          </Text>
        </View>
        <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
          <Text dividerColor callout textAlign="center">
            {t('please_select_your_gender')}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 120, height: 300, width: '100%', alignSelf: 'center', justifyContent:"center", alignItems:"center"}}>  
        <EmotionSlider updateUserData={updateEmotion}/>
      </View>
      <View style={{...styles.row_center_95  }}>
        <Button
          full
          iconRight={
            <FontAwesome
              style={{marginLeft: 20}}
              name="long-arrow-right"
              size={20}
              color={'white'}
            />
          }
          loading={false}
          style={{marginTop: 20}}
          onPress={() => {
            // navigation.navigate('HealthAssessment_7');
            nextScreen()
          }}>
          {t('continue')}
        </Button>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_6;
