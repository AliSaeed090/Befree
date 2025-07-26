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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../../contexts/User';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const HealthAssessment_8: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {updateUserData} = useUser();

  const [list, setList] = useState<Array<any>>([
    { id: 1, icon: 'music', text: t('Listen to music'), isChecked: false },
    { id: 2, icon: 'dancer', text: t('Dance'), isChecked: false },
    { id: 3, icon: 'file-alt', text: t('Read'), isChecked: false },
    { id: 4, icon: 'tree', text: t('Walk in Nature'), isChecked: false },
    { id: 5, icon: 'brain', text: t('Paint'), isChecked: false },
    { id: 6, icon: 'user-friends', text: t('Friends'), isChecked: false },
    { id: 7, icon: 'home', text: t('Family'), isChecked: false },
    { id: 8, icon: 'plane', text: t('Travel'), isChecked: false },
    { id: 9, icon: 'film', text: t('Watch a movie'), isChecked: false },
    { id: 10, icon: 'code', text: t('Work on my personal projects'), isChecked: false },
    { id: 11, icon: 'hands-helping', text: t('Help others'), isChecked: false },
    { id: 12, icon: 'pray', text: t('Talk to God'), isChecked: false },
  ]);
  const confirm = () => {
    let arr = list.filter((x: any) => x.isChecked).map((x: any) => x.text);
    updateUserData('thinksMakesHappy',  arr);
    AsyncStorage.setItem('completedProfile', "true");
    navigation.navigate('PatientProfile');
    // navigation.replace('MyTabs');
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
                {width: '100%', backgroundColor: colors.primary},
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
            {t('things_that_make_me_happy')}
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
                    backgroundColor: x.isChecked ? colors.primary : colors.card,
                  }}>
                  <Text body1>{t(x.text)}</Text>
                  <MaterialIcons
                    name={x.isChecked ? 'check-box' : 'check-box-outline-blank'}
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
                name="check"
                size={20}
                color={'white'}
              />
            }
            loading={false}
            style={{marginTop: 20}}
            onPress={() => {
              confirm()
             
            }}>
            {t('apply')}
          </Button>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_8;
