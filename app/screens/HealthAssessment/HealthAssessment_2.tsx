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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, Button, Text, Header} from '../../components';
import GenderSlider from './components/GenderSlider';

import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useUser} from '../../contexts/User';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const Signup: React.FC<Props> = ({navigation}) => {
  const {updateUserData} = useUser();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [gender, setGender] = useState('Male');

  const confirmGender = () => {
    AsyncStorage.setItem('gender', gender);
    updateUserData('gender', gender);
    navigation.navigate('HealthAssessment_3');
   
  
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
        renderCenterConetent={() => (
          <View style={styles.contentCenter}>
            <View
              style={[
                styles.contentCenter,
                {width: '20%', backgroundColor: colors.primary},
              ]}></View>
          </View>
        )}
        // renderRight={() => (
        //   <Text callout bold>
        //     {t('skip')}
        //   </Text>
        // )}
        onPressRight={() => navigation.replace('MyTabs')}
      />
      <ScrollView>
        <View style={styles.row_center_95}>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
            <Text title1 textAlign="center">
              {t('what_is_your_gender')}
            </Text>
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
            <Text dividerColor callout textAlign="center">
              {t('please_select_your_gender')}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 12, height: 500, width: '100%'}}>
          <GenderSlider updateGender={setGender} />
        </View>
        <View style={{...styles.row_center_95}}>
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
              confirmGender();
            }}>
            {t('continue')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
