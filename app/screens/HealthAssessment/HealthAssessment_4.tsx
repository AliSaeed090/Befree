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
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RulerPicker} from '../../Module/react-native-ruler-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../contexts/User';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const HealthAssessment_4: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {updateUserData} = useUser();
  const {colors} = useTheme();
  const [number, setNumber] = useState<any>(0)
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
    if (number < 10) {
      return
   }

    updateUserData('age', number+ " "+"Years");
    navigation.navigate('HealthAssessment_6');
  };
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
                {width: '40%', backgroundColor: colors.primary},
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
            {t('What_is_your_age')}
          </Text>
        </View>
      
        <View style={{marginTop: 12}}>
          <RulerPicker
            min={0}
            max={240}
            step={1}
            fractionDigits={0}
            initialValue={0}
            onValueChange={number => setNumber(number)}
            onValueChangeEnd={number => setNumber(number)}
            unit={t("years")}
          />
          
        </View>
        <View style={{width: '100%', marginVertical: 0}}>
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
            style={{marginTop: 90}}
            onPress={() => {
              // navigation.navigate('HealthAssessment_6');
              nextScreen()
            }}>
            {t('continue')}
          </Button>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_4;
