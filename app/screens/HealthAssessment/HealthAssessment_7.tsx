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
import {SafeAreaView, Button, Text, Header} from '../../components';
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
const HealthAssessment_7: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {updateUserData} = useUser();

  const {colors} = useTheme();
  const [list, setList] = useState<Array<any>>([
    {id: 1, icon: 'file', text: t('prescribed_medications'), isChecked: false},
    {
      id: 2,
      icon: 'capsules',
      text: t('over_the_counter_supplements'),
      isChecked: false,
    },
    {
      id: 3,
      icon: 'crosshairs',
      text: t('I_m_not_taking_any_treatment'),
      isChecked: false,
    },
    {
      id: 4,
      icon: 'fast-forward',
      text: t('Prefer_not_to_say'),
      isChecked: false,
    },
  ]);

  const nextScreen = () => {
    let arr = list.filter((x: any) => x.isChecked).map((x: any) => x.id);
    updateUserData('takingMedicine', arr);
    navigation.navigate('HealthAssessment_8');
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
                {width: '70%', backgroundColor: colors.primary},
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
              {t('do_you_have_other_mental_health_symptoms')}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              flexWrap: 'wrap',
              // gap: '5%',

              alignSelf: 'center',
              width: '95%',
              justifyContent: 'space-between',
            }}>
            {list.map((x: any) => {
              return (
                <Pressable
                  onPress={() => {
                    x.isChecked = !x.isChecked;
                    setList([...list]);
                  }}
                  //   underlayColor="#ddd"
                  style={({pressed}) => [
                    {
                      marginTop: 10,
                      padding: 16,
                      width: '47%',
                      height: 195,
                      borderRadius: 16,
                      backgroundColor: x.isChecked ? '#A855F7' : colors.card,
                      borderColor: x.isChecked ? '#0F67FE40' : 'transparent',
                    },
                  ]}
                  key={x.id}>
                  <View style={{height: '50%', alignItems: 'flex-start'}}>
                    <FontAwesome5 name={x.icon} size={20} color={'white'} />
                  </View>
                  <View style={{height: '50%', justifyContent: 'flex-end'}}>
                    <Text caption1 whiteColor bold>
                      {t(x.text)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={{width: '100%', marginVertical: 16}}>
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
                nextScreen();
                // navigation.navigate('HealthAssessment_8');
              }}>
              {t('continue')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_7;
