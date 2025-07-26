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
// Emphatic AI Therapy Chatbot for All.
//Easily track your medication & nutrition with the power of AI.
const Signup: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <>
    <Video
 source={{ uri: Images.v3 }} // Replace with your video URL
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
          onPressRight={() => navigation.navigate('SignIn')}
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
          renderRight={() => (
            <Text callout bold>
              {t('skip')}
            </Text>
          )}
        />
        <View style={styles.contain}>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
            <Text title1>
              {t('emphatic_ai_therapy_chatbot_for_all')}
            </Text>
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
            <Text dividerColor callout>
              {t(
                'easily_track_your_medication_nutrition_with_the_power_of_ai',
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
              onPress={() => navigation.navigate('OnBoarding_4')}>
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
