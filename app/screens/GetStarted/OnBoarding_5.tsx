import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';

import {SafeAreaView, Button, Text, Header} from '../../components';
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
interface Props {
  navigation: any;
}
// AI Mental Health Journal & Self-Reflection
// Check your symptoms with ease & book doctor appointment quickly.
const Signup: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <>
      <Video
        source={{uri: Images.v5}} // Replace with your video URL
        style={StyleSheet.absoluteFill} // Fills the screen
        resizeMode="cover" // Ensures the video covers the entire screen
        repeat // Loops the video
        muted // Mutes the video
        // Starts the video automatically
      />
      <View style={{...styles.overlay,backgroundColor: 'rgba(0, 0, 0, 0.6)',}}>
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          edges={['right', 'top', 'left']}>
          <Header
            renderLeft={() => (
              <View style={styles.leftbtn}>
                <FontAwesome name="angle-left" size={30} color={'white'} />
              </View>
            )}
            onPressRight={() => navigation.navigate('SignIn')}
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
            renderRight={() => (
              <Text callout bold>
                {t('skip')}
              </Text>
            )}
          />
          <View style={styles.contain}>
            <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
              <Text title1>
                {t('ai_mental_health_journal_self_reflection')}
              </Text>
            </View>
            <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
              <Text dividerColor callout>
                {t(
                  'check_your_symptoms_with_ease_book_doctor_appointment_quickly',
                )}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 60,
                alignSelf: 'center',
                right: 16,
              }}>
              <TouchableOpacity
                style={styles.righttbtn}
                onPress={() => navigation.navigate('Signup')}>
                <FontAwesome name="angle-right" size={40} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default Signup;
