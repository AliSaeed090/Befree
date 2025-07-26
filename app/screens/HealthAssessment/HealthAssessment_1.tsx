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
    let arr = list.filter((x: any) => x.isChecked).map((x: any) => x.id);
    //console.log({arr});

    updateUserData('goalsforUsingApp', arr);
    navigation.navigate('HealthAssessment_2');
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
                {width: '10%', backgroundColor: colors.primary},
              ]}></View>
          </View>
        )}
        renderRight={() => (
          <Text callout bold>
            {/* {t('skip')} */}
          </Text>
        )}
        onPressRight={() => nextScreen()}
      />
      <ScrollView>
        <View style={styles.row_center_95}>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
            <Text title1 textAlign="center">
              {t('what_is_your_health_goal_for_the_app')}
            </Text>
          </View>
          <View style={{marginTop: 12}}>
            {list.map((x: any) => {
              return (
                <Pressable
                  onPress={() => {
                    x.isChecked = !x.isChecked;
                    setList([...list]);
                  }}
                  //   underlayColor="#ddd"
                  style={({pressed}) => [
                    {...styles.ListView, backgroundColor: colors.card},
                    {
                      backgroundColor: pressed ? '#fff' : 'transparent',
                      borderColor: x.isChecked ? '#0F67FE40' : 'transparent',
                    },
                  ]}
                  key={x.id}>
                  <View
                    style={{
                      ...styles.ListViewText,
                      backgroundColor: x.isChecked
                        ? colors.primary
                        : colors.card,
                    }}>
                    <FontAwesome5 name={x.icon} size={20} color={'white'} />
                    <View
                      style={{width: '70%', justifyContent: 'space-between'}}>
                      <Text textAlign="flex-start" body1>
                        {t(x.text)}
                      </Text>
                    </View>

                    <MaterialIcons
                      name={
                        x.isChecked ? 'check-box' : 'check-box-outline-blank'
                      }
                      size={25}
                      color={'white'}
                    />
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
              }}>
              {t('continue')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
