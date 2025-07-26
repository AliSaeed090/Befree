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
import {BaseColor, BaseStyle, useTheme, Images} from '../../config';
 
import {useTranslation} from 'react-i18next';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
interface Props {
  navigation: any;
}
// Achieve your wellness goals with our AI-powered platform to your unique needs.
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
        source={{ uri: Images.v1 }} // Replace with your video URL
        style={StyleSheet.absoluteFill} // Fills the screen
        resizeMode="cover" // Ensures the video covers the entire screen
        repeat // Loops the video
        muted // Mutes the video
        // autoplay // Starts the video automatically
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
          renderCenterConetent={() => (
            <View style={styles.contentCenter}>
              <View
                style={[
                  styles.contentCenter,
                  {width: '20%', backgroundColor: colors.primary},
                ]}></View>
            </View>
          )}
          onPressRight={() => navigation.navigate('SignIn')}
          renderRight={() => (
            <Text callout bold>
              {t('skip')}
            </Text>
          )}
        />
        <View style={styles.contain}>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
            <Text title1>
              {t('personalize_your_mental_health_state_with_ai')}
            </Text>
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 12}}>
            <Text dividerColor callout>
              {t(
                'achieve_your_wellness_goals_with_our_ai-powered_platform_to_your_unique_needs',
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
              onPress={() => navigation.navigate('OnBoarding_2')}>
              <FontAwesome name="angle-right" size={40} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
        </View>
        </>
     
    // </ImageBackground>
  );
};

export default Signup;
