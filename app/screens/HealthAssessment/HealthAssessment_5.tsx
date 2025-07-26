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
import Slider from '@react-native-community/slider';

interface Props {
  navigation: any;
}
// What is your health goal for the app?
const HealthAssessment_5: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [stress, setstress] = useState<any>(0);

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
                {width: '50%', backgroundColor: colors.primary},
              ]}></View>
          </View>
        )}
        renderRight={() => (
          <Text callout bold>
            {t('skip')}
          </Text>
        )}
      />
      <ScrollView>  
      <View style={styles.row_center_95}>
        <View style={{width: '90%', alignSelf: 'center', marginTop: 24}}>
          <Text title1 textAlign="center">
            {t('What_is_your_current_stress_level')}
          </Text>
        </View>

        <View style={{marginTop: 100, width: '100%'}}>
          <Text textAlign="center" header>
            {'Moderate'}
          </Text>
          <Slider
            step={1}
            onValueChange={value => setstress(value)}
            style={{width: '100%', height: 60,marginVertical: 100,}}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.card}
          />
        </View>
        <Text textAlign="center" header>
          {stress}
        </Text>
        <View style={{width: '100%', marginVertical: 100}}>
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
              navigation.navigate('HealthAssessment_6');
            }}>
            {t('continue')}
          </Button>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_5;
