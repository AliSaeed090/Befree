import React, { useState, useRef,useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Image,
  Text as NativeText,
  Alert,
  Platform,
  TouchableOpacity,
  Linking,
  
  
} from 'react-native';
import styles from './styles';

import PhoneInput from 'react-native-phone-number-input';
import { BaseColor, BaseStyle, useTheme, Images } from '../../config';
import { showMessage, hideMessage } from 'react-native-flash-message';

import { Button, SafeAreaView, Text } from '../../components';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PhoneAuth = (props: any) => {
  const { navigation } = props;

  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  // const [showMessage, setShowMessage] = useState(false);
  const phoneInput: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [reSendVerificationId, SetResndID] = React.useState<any>(null);
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [phoneNoError, setphoneNoError] = useState<string>('');
  const { colors } = useTheme();
  const dropDown = () => {
    return <AntDesign size={10} name="caretdown" color={colors.primary} />;
  };
  const [codeValue, setcodeValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [LayoutHandler, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [codeSent, setCodeSent] = useState(false);


  useEffect(() => {
    if(Platform.OS === 'android'){
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();

          if (!userDoc.exists) {
            // New user - set default fields
            await firestore().collection('users').doc(user.uid).set({
              userType: "patient",
              compnayId: null,
              createdAt: new Date(),
              email: "",
              firstName: "",
              lastName: "",
              phone: user.phoneNumber,
              uid: user.uid
            });
          }

          navigation.replace('Loading'); // Go to next screen

        } catch (error) {
          console.error("Error setting user data:", error);
          Alert.alert('Error', 'Something went wrong while setting up your profile.');
        }
      }
    });

    return unsubscribe; // unsubscribe on unmount
  }
  }, []);

  const sendCode = async () => {
    // auth().settings.appVerificationDisabledForTesting = true;
    //console.log({value, formattedValue});
    const checkValid = phoneInput.current?.isValidNumber(formattedValue);

    if (checkValid) {
      setLoading(true);

      try {
        const result: any = await auth().signInWithPhoneNumber(formattedValue);
        setConfirmResult(result);
        // Alert.alert('Success', 'OTP has been sent to your phone.');
        showMessage({
          message: 'OTP has been sent to your phone.',
          type: 'success',
          icon: 'success',

        });
        setLoading(false);
      } catch (error: any) {
        console.log({ error });
        setLoading(false);
        // Alert.alert('Error', error.message);
        showMessage({
          message: error.message,
          type: 'danger',



        });
      }
    } else {
      //console.log('Inavalid Number');
    }
  };


  //....FunctionsEnd

  const reSendCode = () => {
    // auth().verifyPhoneNumber(props.route.params.phoneNo).on('state_changed', phoneAuthSnapshot => {
    //   SetResndID(phoneAuthSnapshot.verificationId)
    //   if (phoneAuthSnapshot.state === 'verified') {
    //     setLoading(false)
    //     setDisabledBtn(false)
    //     // setverified(true)
    //     const credential = app.auth.PhoneAuthProvider.credential(
    //       phoneAuthSnapshot.verificationId,
    //       phoneAuthSnapshot.code,
    //     );
    //     auth().signInWithCredential(credential)
    //       .then(userCredential => {
    //         alert("Auto Varifaction done")
    //       })
    //       .catch(error => {
    //         //console.log(error.message)
    //       });
    //   } else if (phoneAuthSnapshot.state === 'sent') {
    //     alert("Varification Code has been sent")
    //   } else if (phoneAuthSnapshot.state === 'timeout') {
    //   }
    //   else if (phoneAuthSnapshot.error) {
    //     alert(phoneAuthSnapshot.error.message)
    //   }
    //   else {
    //     alert("Somethimg went wrong")
    //   }
    // });
  };
  const confirmCode = async () => {
    if (!verificationCode || !confirmResult) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }
    try {
      const user = await confirmResult.confirm(verificationCode);
      console.log({ isNewUser: user.additionalUserInfo?.isNewUser });
      if (user.additionalUserInfo?.isNewUser === true) {
        // console.log({uid:user.user})
        firestore().collection('users').doc(user.user.uid).set({
          userType: "patient",
          compnayId: null,
          createdAt: new Date(),
          email: "",
          firstName: "",
          lastName: "",
          phone: user.user.phoneNumber,
          uid: user.user.uid
        })

      }
      navigation.replace('Loading');
      setLoading(false);
      // Alert.alert('Success', `User authenticated: ${user}`);
      showMessage({
        message: `Successfully authenticated`,
        type: 'success',
        icon: 'success',

      });
      // navigation.replace('Loading');
    } catch (error) {
      setLoading(false);
      // Alert.alert('Error', 'Invalid verification code.');
    }
  };
  
  return (
    <>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {/* {showMessage && (
          <View style={styles.message}>
            <Text>Value : {value}</Text>
            <Text>Formatted Value : {formattedValue}</Text>
            <Text>Valid : {valid ? 'true' : 'false'}</Text>
          </View>
        )} */}

        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={Images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text headline style={{ marginTop: 10 }}>
            {!confirmResult
              ? (t('continue_with_phone_number'))
              : (t('a_verification_code_has_been_sent_Please_validate'))}
          </Text>
        </View>

        <View style={styles.contain}>
          {!confirmResult ? (
            <>
              <PhoneInput
                containerStyle={{
                  ...BaseStyle.textInput,
                  width: '100%',
                  backgroundColor: colors.card,
                  paddingLeft: 0,
                }}
                textInputStyle={{
                  backgroundColor: colors.card,
                  color: colors.text,
                }}
                codeTextStyle={{
                  color: colors.primary,
                  backgroundColor: colors.card,
                }}
                textContainerStyle={{ backgroundColor: colors.card }}
                countryPickerButtonStyle={{
                  backgroundColor: BaseColor.grayColor,
                  borderRadius: 5,
                }}
                textInputProps={{
                  selectionColor: colors.primary,
                  placeholderTextColor: BaseColor.grayColor,
                  placeholder: t('input_number'),
                }}
                ref={phoneInput}
                defaultValue={value}
                defaultCode="CO"
                layout="first"
                onChangeText={(text: string) => {
                  setValue(text);
                  setphoneNoError('');
                }}
                onChangeFormattedText={(text: string) => {
                  setFormattedValue(text);
                }}
                withDarkTheme
                disableArrowIcon
                withShadow
                autoFocus
              />
              {phoneNoError.length > 0 && (
                <Text footnote style={{ color: 'red' }}>
                  {phoneNoError}
                </Text>
              )}

              <View style={{ width: '100%', marginVertical: 16 }}>
                <Button
                  loading={loading}
                  full
                  iconRight={
                    <FontAwesome
                      style={{ marginLeft: 20 }}
                      name="long-arrow-right"
                      size={20}
                      color={'white'}
                    />
                  }
                  style={{ marginTop: 20 }}
                  onPress={sendCode}>
                  {t('continue')}
                </Button>
              </View>
            </>
          ) : (
            <>
              <CodeField
                ref={ref}
                {...LayoutHandler}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={verificationCode}
                onChangeText={setVerificationCode}
                cellCount={6}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => {
                  return (
                    <View style={[styles.cell, isFocused && { borderColor: colors.primary }]}>
                      <Text title1 regular>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  );
                }}

              />
              <View style={{ width: '100%', marginVertical: 16 }}>
                {verificationCode.length > 5 &&
                  <Button

                    iconRight={
                      <FontAwesome
                        style={{ marginLeft: 20 }}
                        name="check"
                        size={20}
                        color={'white'}
                      />
                    }
                    full
                    // loading={loading}
                    style={{ marginTop: 20 }}
                    onPress={() => confirmCode()}>
                    {t('verify')}
                  </Button>}
              </View>
            </>
          )}
           <View style={{ marginTop: 0 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width:"90%", flexWrap: 'wrap' }}>
          
            <Text body2 textAlign='center'  >
              {t('terms_and_conditions1')}
           
          </Text>
         
          <TouchableOpacity onPress={() => Linking.openURL("https://www.befreehealth.ai/terms")}>
            <Text body2 textAlign='center' style={{ textDecorationLine: 'underline' }}>
              {t('terms_and_conditions2')}
           
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.befreehealth.ai/privacy")}>
            <Text body2 textAlign='center' style={{ textDecorationLine: 'underline', marginLeft:10 }}>
              {t('terms_and_conditions3')}
           
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.befreehealth.ai/subscription")}>
            <Text body2 textAlign='center' style={{ textDecorationLine: 'underline', marginLeft:10 }}>
              {t('terms_and_conditions4')}
           
          </Text>
          </TouchableOpacity>
          <Text body2 textAlign='center'  >
              {t('terms_and_conditions5')}
           
          </Text>
        </View>
        </View>
       
      </SafeAreaView>
    </>
  );
};

export default PhoneAuth;
