import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {SafeAreaView, Button, Text, Header} from '../../components';
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

interface Props {
  navigation: any;
}
// Intelligent Mood Tracking & Emotion Improvement
//Experience compassionate and personalized care with our AI chatbot.
const Signup: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    // <ImageBackground
    //   source={Images.onboarding}
    //   style={{
    //     width: '100%',
    //     height: '100%',
    //     // resizeMode: 'contain',
    //   }}>
    <>
    <Video
 source={{ uri: Images.v2 }} // Replace with your video URL
 style={StyleSheet.absoluteFill} // Fills the screen
 resizeMode="cover" // Ensures the video covers the entire screen
 repeat // Loops the video
 muted // Mutes the video
  // Starts the video automatically
/>
 <View style={styles.overlay}>
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
          onPressRight={() => navigation.navigate('SignIn')}
          renderCenterConetent={() => (
            <View style={styles.contentCenter}>
              <View
                style={[
                  styles.contentCenter,
                  {width: '40%', backgroundColor: colors.primary},
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
              {t('intelligent_mood_tracking_emotion_improvement')}
            </Text>
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
            <Text dividerColor callout>
              {t(
                'experience_compassionate_and_personalized_care_with_our_ai_chatbot',
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
              onPress={() => navigation.navigate('OnBoarding_3')}>
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
