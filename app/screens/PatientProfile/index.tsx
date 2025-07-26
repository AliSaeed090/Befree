import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, Button, Header, Text, TextInput } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../redux';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignup } from './hooks/useSignup';
import { showMessage } from 'react-native-flash-message';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

// -- For Image Upload --
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import { useUser } from '../../contexts/User';

// Example email validation
const validateEmail = (email: string): boolean => {
  return !!email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

interface Props {
  navigation: any;
}

const Signup: React.FC<Props> = ({ navigation }) => {
  // Refs for phone inputs
  const phoneInputPersonal = useRef<PhoneInput>(null);
  const phoneInputEmergency = useRef<PhoneInput>(null);

  // Hooks & Redux
  const { updateUserData, submitUserData, user, getUserData,updateUserDataFirebase } = useUser();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  // const {mutateAsync: signup, isPending} = useSignup();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameErrorr] = useState('');
  const [lastNameError, setlastNameErrorr] = useState('');
  const [dobError, setDobError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(''); // In "YYYY-MM-DD" format for now
  const [personalPhone, setPersonalPhone] = useState(''); // Raw text
  const [personalPhoneCode, setPersonalPhoneCode] = useState<any>('CO');
  const [personalPhoneFormatted, setPersonalPhoneFormatted] = useState(''); // Formatted
  const [personalPhoneError, setPersonalPhoneError] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState(''); // Raw text
  const [emergencyPhoneCode, setEmergencyPhoneCode] = useState<any>('CO');
  const [emergencyPhoneFormatted, setEmergencyPhoneFormatted] = useState('');
  const [emergencyPhoneError, setEmergencyPhoneError] = useState('');
  const [storageRef, setStorageRef] = useState<any>(null);
  const [uploadUri, setUploadUri] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  // Profile image
  const [profileImageUrl, setProfileImage] = useState<string | null>(null);
  const forceRerender = () => {
    // setKey(prevKey => prevKey + 1);
  };
  /**
   * Retrieve any stored user info (AsyncStorage or Firestore)
   */
  const getProfile = async () => {
    try {
      // let profile: any = await AsyncStorage.getItem('userData');
      // //console.log({user:user.personalPhoneCode?.number});˝
      console.log({user});
      if (user) {
        let profile = user;

        // Basic fields
        setEmail(profile.email || '');
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setDob(profile.dob || '');
        console.log({ callingCode: profile.personalPhoneCode })
        setPersonalPhoneCode(profile?.personalPhoneCode?.cca2 ?? "CO");
        setEmergencyPhoneCode(profile?.emergencyPhoneCode?.cca2 ?? "CO");
        setPersonalPhoneFormatted(profile.phone);
        setEmergencyPhoneFormatted(profile.emergencyPhone);
        setPersonalPhone(profile.phone);
        setEmergencyPhone(profile.emergencyPhoneCode?.number);
        let countryCode= profile?.personalPhoneCode?.cca2 ?? "CO"
        let code = profile?.personalPhoneCode?.callingCode?.length ? profile.personalPhoneCode.callingCode[0] : "";
        let   number= profile?.personalPhoneCode?.number
        phoneInputPersonal.current?.setState({
          countryCode: countryCode?? "CO",
          code: code?? "57",
          number:number?? "",
        });
        let phoneInputEmergencycountryCode= profile?.emergencyPhoneCode?.cca2 ?? "CO"
        let phoneInputEmergencyCode = profile?.emergencyPhoneCode?.callingCode?.[0];

        let phoneInputEmergencynumber= profile?.emergencyPhoneCode?.number
        phoneInputEmergency.current?.setState({
          countryCode: phoneInputEmergencycountryCode ?? "CO",
          code:phoneInputEmergencyCode??"57",
          number:phoneInputEmergencynumber??"",
        });

        // Profile Image
        if (profile.profileImageUrl) {
          setProfileImage(profile.profileImageUrl);
        }
        forceRerender()
      }
    } catch (error) {
      
      console.error('Error retrieving profile:', error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  /**
   * Handle picking an image and uploading to Firebase Storage
   */
  const handleSelectImage = async () => {
    try {
      // Open gallery with cropping
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });
      if (image?.path) {
        // 1) Show local preview
        setProfileImage(image.path);

        // 2) Upload to Firebase Storage
        const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path;

        const storageRef = storage().ref(`profileImages/${filename}`);
        setStorageRef(storageRef);
        setUploadUri(uploadUri);


      }
    } catch (error) {
      //console.log('Error picking or uploading image:', error);
      showMessage({
        message: t('error'),
        description: t('unable_to_upload_image'),
        type: 'danger',
        position: 'top',
      });
    }
  };

  /**
   * Validate & Save the entered information
   */
  const onSignUp = async () => {
    // Validate personal phone
    const isValidPersonalPhone = phoneInputPersonal.current?.isValidNumber(
      personalPhoneFormatted,
    );
    // Validate emergency phone
    const isValidEmergencyPhone = phoneInputEmergency.current?.isValidNumber(
      emergencyPhoneFormatted,
    );
    // Validate email
    if (!validateEmail(email)) {
      setEmailError(t('valid_email_required'));
      return;
    } else if (firstName === "" || firstName.length < 3) {
      setFirstNameErrorr(t("enter_first_name"))
      return;
    }
    else if (lastName === "" || lastName.length < 3) {
      setlastNameErrorr(t("enter_last_name"))
      return;
    }
    // else if (!isValidPersonalPhone) {
    //   setPersonalPhoneError(t('invalid_personal_phone'));
    //   return;
    // }
    else if (!isValidEmergencyPhone) {
      setEmergencyPhoneError(t('invalid_emergency_phone'));
      return;
    } 
    else if (emergencyPhoneFormatted===personalPhoneFormatted){
      setEmergencyPhoneError(t('Por tu seguridad, el número de teléfono no puede ser el mismo que el de contacto de emergencia.'));
      setPersonalPhoneError(t('Por tu seguridad, el número de teléfono no puede ser el mismo que el de contacto de emergencia.'));
      return;
    } 
    
    else if ((storageRef === null || uploadUri === null) && !user.profileImageUrl){
      
      showMessage({
        message: t('error'),
        description: t('unable_to_upload_image'),
        type: 'danger',
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      // 1) Save to AsyncStorage
      // await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // 2) Submit to your user context or API
      if (storageRef && uploadUri) {
        await storageRef.putFile(uploadUri);
        const downloadURL = await storageRef.getDownloadURL();
        updateUserDataFirebase({
          ...user,
          email,
          firstName,
          lastName,
          dob,
          personalPhone: personalPhoneFormatted,
          emergencyPhone: emergencyPhoneFormatted,
          personalPhoneCode: { ...personalPhoneCode, number: personalPhone },
          emergencyPhoneCode: { ...emergencyPhoneCode, number: emergencyPhone },
          profileImageUrl: downloadURL ?? null,
        });
      } else {
        console.log({   email,
          firstName,
          lastName,});
          
          updateUserDataFirebase({
          ...user,
          email,
          firstName,
          lastName,
          dob,
          personalPhone: personalPhoneFormatted,
          emergencyPhone: emergencyPhoneFormatted,
          personalPhoneCode: { ...personalPhoneCode, number: personalPhone },
          emergencyPhoneCode: { ...emergencyPhoneCode, number: emergencyPhone },

        });
      }
      getUserData()
      // 3) Navigate
      navigation.replace('MyTabs');
      setLoading(false);
      // 4) Show success message
      showMessage({
        message: t('success'),
        description: t('profile_information_saved'),
        type: 'success',
        position: 'top',
      });
    } catch (error) {
      setLoading(false);
      showMessage({
        message: t('error'),
        description: t('unable_to_save_data'),
        type: 'danger',
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaView
      key={key}
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <ScrollView>
        <Header
          renderLeft={() => (
            <View style={styles.leftbtn}>
              <FontAwesome name="angle-left" size={30} color={'white'} />
            </View>
          )}
          onPressLeft={() => {
            navigation.goBack();
          }}
          title={t('profile_setup')}
        />

        <View style={styles.contain}>
          {/* Profile Image */}
          <View
            style={{
              alignSelf: 'center',
              marginVertical: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={profileImageUrl ? { uri: profileImageUrl } : Images.profilePic}
              style={styles.logo}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={handleSelectImage}
              style={{
                position: 'absolute',
                bottom: -10,
                right: 25,
                width: 40,
                height: 40,
                backgroundColor: colors.card,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome name="edit" size={20} color={'white'} />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={(text: string) => {
              setEmail(text);
              setEmailError('');
            }}
            onFocus={() => {
              setEmailError('');
            }}
            placeholder={t('enter_your_email')}
            label={t('email')}
            value={email}
            errorMessage={emailError}
            iconLeft={() => (
              <Feather
                style={{ marginRight: 20 }}
                name="mail"
                size={20}
                color={'white'}
              />
            )}
          />

          {/* First Name */}
          <TextInput
           marginTop={12}
            style={[BaseStyle.textInput, { marginTop: 12 }]}
            onChangeText={(text: string) => setFirstName(text)}
            placeholder={t('enter_first_name')}
            label={t('first_name')}
            errorMessage={firstNameError}
            onFocus={() => {
              setFirstNameErrorr('');
            }}
            value={firstName}
            iconLeft={() => (
              <Feather
                style={{ marginRight: 20 }}
                name="user"
                size={20}
                color={'white'}
              />
            )}
          />

          {/* Last Name */}
          <TextInput
           marginTop={12}
            style={[BaseStyle.textInput, { marginTop: 12 }]}
            onChangeText={(text: string) => setLastName(text)}
            placeholder={t('enter_last_name')}
            label={t('last_name')}
            value={lastName}
            onFocus={() => {
              setlastNameErrorr('');
            }}
            errorMessage={lastNameError}
            iconLeft={() => (
              <Feather
                style={{ marginRight: 20 }}
                name="user"
                size={20}
                color={'white'}
              />
            )}
          />

          {/* Date of Birth */}
          <TextInput
           marginTop={12}
            style={[BaseStyle.textInput, { marginTop: 12 }]}
            onChangeText={(text: string) => setDob(text)}
            placeholder={t('enter_dob')}
            onFocus={() => {
              setDobError('');
            }}
            label={t('dob')}
            errorMessage={dobError}
            value={dob}
            iconLeft={() => (
              <FontAwesome5Icon
                style={{ marginRight: 20 }}
                name="birthday-cake"
                size={20}
                color={'white'}
              />
            )}
          />

          {/* Personal Telephone */}
          {/* <Text
            style={{ marginBottom: 5, marginLeft: 3, marginTop: 14 }}
            bold
            subhead>
            {t('personal_telephone')}
          </Text> */}
          {/* <PhoneInput
            ref={phoneInputPersonal}
            disabled
            containerStyle={{
              ...BaseStyle.textInput,
              backgroundColor: colors.card,
              paddingLeft: 0,
            }}
            textInputStyle={{
              backgroundColor: colors.card,
              color: colors.text,
              padding: 0,
            }}
            codeTextStyle={{
              color: colors.primary,
              backgroundColor: colors.card,
              padding: 0,
            }}
            textContainerStyle={{
              backgroundColor: colors.card,
              paddingVertical: 0,
            }}
            countryPickerButtonStyle={{
              backgroundColor: BaseColor.grayColor,
              borderRadius: 5,
            }}
            textInputProps={{
              selectionColor: colors.primary,
              placeholderTextColor: BaseColor.grayColor,
              placeholder: t('enter_personal_phone'),
            }}
            onChangeCountry={(code: any) => {
              //console.log({code});
              setPersonalPhoneCode(code);
            }}
            defaultValue={personalPhone}
            value={personalPhone}
            // defaultCode="+92"
            defaultCode={personalPhoneCode}
            layout="first"
            onChangeText={(text: string) => {
              setPersonalPhone(text);
              setPersonalPhoneError('');
            }}
            onChangeFormattedText={(formatted: string) => {
              setPersonalPhoneFormatted(formatted);
            }}
            withDarkTheme
            withShadow
          />
          {personalPhoneError.length > 0 && (
            <View
              style={{
                minHeight: 44,
                borderRadius: 12,
                paddingHorizontal: 10,
                width: '100%',
                backgroundColor: '#881337',
                borderColor: '#F43F5E',
                borderWidth: 1,
                marginTop: 12,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <FontAwesome5Icon name="warning" size={20} color={'white'} />
              <Text callout bold style={{ marginLeft: 10 }}>
                {t('error')}: {personalPhoneError}
              </Text>
            </View>
          )} */}
            <TextInput
             marginTop={12}
            editable={false}
            // marginTop={12}
            style={[BaseStyle.textInput, { marginTop: 12 }]}
            onChangeText={(text: string) => setFirstName(text)}
            placeholder={t('enter_first_name')}
            label={t('personal_telephone')}
            errorMessage={""}
            onFocus={() => {
              setFirstNameErrorr('');
            }}
            value={personalPhone}
            iconLeft={() => (
              <Feather
                style={{ marginRight: 20 }}
                name="phone"
                size={20}
                color={'white'}
              />
            )}
          />


          {/* Emergency Contact Telephone */}
          <Text
            style={{ marginBottom: 5, marginLeft: 3, marginTop: 14 }}
            bold
            subhead>
            {t('emergency_contact_telephone')}*
          </Text>
          <PhoneInput
            ref={phoneInputEmergency}
            containerStyle={{
              ...BaseStyle.textInput,
              backgroundColor: colors.card,
              paddingLeft: 0,
            }}
            textInputStyle={{
              backgroundColor: colors.card,
              color: colors.text,
              padding: 0,
            }}
            codeTextStyle={{
              color: colors.primary,
              backgroundColor: colors.card,
              padding: 0,
            }}
            textContainerStyle={{
              backgroundColor: colors.card,
              paddingVertical: 0,
            }}
            countryPickerButtonStyle={{
              backgroundColor: BaseColor.grayColor,
              borderRadius: 5,
            }}
            textInputProps={{
              selectionColor: colors.primary,
              placeholderTextColor: BaseColor.grayColor,
              placeholder: t('enter_emergency_phone'),
            }}
            defaultValue={emergencyPhone}
            defaultCode={emergencyPhoneCode}
            value={emergencyPhone}
            onChangeCountry={(code: any) => {
              //console.log({code});
              setEmergencyPhoneCode(code);
            }}
            layout="first"
            onChangeText={(text: string) => {
              setEmergencyPhone(text);
              setEmergencyPhoneError('');
            }}
            onChangeFormattedText={(formatted: string) => {
              setEmergencyPhoneFormatted(formatted);
            }}
            withDarkTheme
            withShadow
          />
          {emergencyPhoneError.length > 0 && (
            <View
              style={{
                minHeight: 44,
                borderRadius: 12,
                paddingHorizontal: 10,
                width: '100%',
                backgroundColor: '#881337',
                borderColor: '#F43F5E',
                borderWidth: 1,
                marginTop: 12,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <FontAwesome5Icon name="warning" size={20} color={'white'} />
              <Text callout bold style={{ marginLeft: 10 }}>
                {t('error')}: {emergencyPhoneError}
              </Text>
            </View>
          )}

          {/* Save Button */}
          <View style={{ width: '100%', marginVertical: 16 }}>
            <Button
              full
              iconRight={
                <FontAwesome
                  style={{ marginLeft: 20 }}
                  name="check"
                  size={20}
                  color={'white'}
                />
              }
              loading={loading}

              style={{ marginTop: 20 }}
              onPress={onSignUp}>
              {t('save')}
            </Button>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
