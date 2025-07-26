import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, Button, Text } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import Video from 'react-native-video';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
interface Props {
  navigation: any;
}

const Signup: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ImageBackground
      source={Images.splash}
      style={{
        width: '100%',
        height: '100%',
        // resizeMode: 'contain',
      }}>
      <>
        {/* <Video
        source={{uri: Images.v0}} // Replace with your video URL
        style={StyleSheet.absoluteFill} // Fills the screen
        resizeMode="cover" // Ensures the video covers the entire screen
        repeat // Loops the video
        muted // Mutes the video
        // autoplay // Starts the video automatically
      /> */}
        <View style={{ ...styles.overlay, backgroundColor: 'rgba(0, 0, 0, 0.3)', }}>
          <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={['right', 'top', 'left']}>
            <View style={styles.contain}>
              <View style={styles.row_center_95}>
                {/* <Image
                source={Images.logo}
                style={styles.logo}
                resizeMode="contain"
              /> */}
              </View>
              {/* <View style={{width: 200, alignSelf: 'center'}}>
              <Text textAlign="center" title1>
                {t('welcome_to_befree_health')}
              </Text>
            </View> */}
              {/* <View style={styles.row_center_95}> */}

              <View
                style={{ position: 'absolute', bottom: 60, alignSelf: 'center' }}>
                <View style={styles.row_center_95}>
                  <Image
                    source={Images.logo2}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text textAlign="center" style={{marginTop:0, marginBottom:20}}>
                {t('welcome_to_befree_health')}
                {/* {t('disclaimer')} */}
              </Text>
                <Button
                  // full
                  loading={false}
                  iconRight={
                    <FontAwesome
                      style={{ marginLeft: 20 }}
                      name="long-arrow-right"
                      size={20}
                      color={'white'}
                    />
                  }
                 
                  onPress={() => {
                    navigation.navigate('OnBoarding_1');
                  }}>
                  {t('get_started')}
                
                </Button>
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text body2 textAlign='center' style={{ textDecorationLine: 'underline' }}>
                      {t('Already_have_an_account')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </>
    </ImageBackground>
  );
};

export default Signup;
