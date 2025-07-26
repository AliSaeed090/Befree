import React, {useEffect, useState} from 'react';
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

interface Props {
  navigation: any;
  route: any;
}
// What is your health goal for the app?
const AppointmentBooking_1: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {params} = route;

  const {colors} = useTheme();
  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    if (params?.doctors) {
      //console.log({params: params.doctors});
      setList(params.doctors);
    }
  }, [params]);

  return (
    <SafeAreaView
      style={{...BaseStyle.safeAreaView, backgroundColor: colors.card}}
      edges={['right', 'top', 'left']}>
      <Header
        renderLeft={() => (
          <View style={{...styles.leftbtn, backgroundColor: '#334155'}}>
            <FontAwesome name="angle-left" size={30} color={'white'} />
          </View>
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={{width: '95%', alignSelf: 'center', marginVertical: 16}}>
        <Button
          full
          loading={false}
          // disabled={list.length === 0}
          style={{
            marginTop: 20,
            backgroundColor: '#475569',
            borderWidth: 3,
            borderColor: '#334155',
          }}
          onPress={() => {
            // navigation.navigate('HealthAssessment_2');
          }}>
          {t('befrree_doctor_match')}
        </Button>
      </View>
      
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          marginVertical: 16,
        }}>
          <ScrollView>
        <View style={styles.row_center_95}>
          {list.map((x: any) => {
            return (
              <TouchableOpacity
              key={x.doctorId}
                onPress={() => navigation.navigate('AppointmentBooking_3',{doctor:x})}
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: 16,
                  flexDirection: 'row',
                  backgroundColor: colors.card,
                  borderRadius: 16,
                }}>
                <View
                  style={{
                    width: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri:x.profileImageUrl}}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 5,
                      marginRight: 16,
                    }}
                  />
                </View>
                <View style={{width: '60%', alignItems: 'flex-start'}}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text bold whiteColor body2>
                     {x.firstName} {x.lastName}
                    </Text>
                    <MaterialIcons
                      name="verified"
                      size={15}
                      color={colors.primary}
                      style={{marginLeft: 5}}
                    />
                  </View>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <MaterialIcons name="star" size={20} color={'#F59E0B'} />
                    <Text bold whiteColor body2 style={{marginLeft: 5}}>
                      4.1
                    </Text>
                    <MaterialCommunityIcons
                      name="brain"
                      size={20}
                      color={'#94A3B8'}
                      style={{marginLeft: 10}}
                    />
                    <Text bold whiteColor body2 style={{marginLeft: 5}}>
                      {x.department}
                    </Text>
                  </View>

                  <View
                    style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                    <FontAwesome
                      name="file-text-o"
                      size={15}
                      color={'white'}
                    />
                    <Text numberOfLines={2} whiteColor body2  style={{marginLeft: 10}}>
                     {x.bio}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '10%',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome name="angle-right" size={30} color={'white'} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AppointmentBooking_1;
