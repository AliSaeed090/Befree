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
import ChipInput from './components/ChipInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { min } from 'moment';
import {useUser} from '../../contexts/User';

interface Props {
  navigation: any;
}
const chipVariant = {
    CONTAINED: 'contained',
    OUTLINED: 'outlined',
    STANDARD: 'standard',
};

const chipSize = {
    LARGE: 'large',
    MEDIUM: 'medium',
    SMALL: 'small',
};
// What is your health goal for the app?
const HealthAssessment_8: React.FC<Props> = ({navigation}) => {
  const [inputValues, setInputValues] = useState([]);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const {updateUserData} = useUser();
  const nextScreen = () => {
    
    updateUserData('symptoms',  inputValues);
    navigation.navigate('HealthAssessment_9');
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
                {width: '85%', backgroundColor: colors.primary},
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
            {t('are_you_taking_any_medications_related')}
          </Text>
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            flexWrap: 'wrap',
            // gap: '5%',
            // backgroundColor: "#7DFFBA",
            borderRadius: 20,

            alignSelf: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Image
            source={Images.dr1}
            style={{width: '100%', height: 200, resizeMode: 'cover', borderRadius:20}}
          />
        </View>
        <View style={{width: '100%', marginVertical: 16}}>
          <ChipInput
            inputValues={inputValues}
            setInputValues={setInputValues}
            showChipIcon={true}
            chipVariant={chipVariant.CONTAINED}
            enableBackspaceDelete={true}
            size={chipSize.SMALL}
            inputVariant={chipVariant.OUTLINED}
            inputStyle={{  minHeight: 150, borderRadius: 20, padding: 8,}}
            inputTextStyle={{ color:"white", minWidth:100,}}
            placeholderStyle={{width: '100%'}}
            // chipIconAction={onChipIconAction}
            primaryColor={'#9BB167'}
            secondaryColor={'#1E3A8A'}
            iconName={'close'}
          />
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
              // navigation.navigate('HealthAssessment_9');
              nextScreen()
            }}>
            {t('continue')}
          </Button>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAssessment_8;
