import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  SafeAreaView,
  Button,
  Header,
  // Dropdown,
  Text,
  TextInput,
} from '../../components';
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import {Authenticate} from '../../redux/slices/Auth';
import {RootState, AppDispatch} from '../../redux/index';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {useSignup} from './hooks/useSignup';
// import Pdf from 'react-native-pdf';
import {showMessage, hideMessage} from 'react-native-flash-message';

const successInit = {
  id: true,
  password: true,
  confirmPassword: true,
  name: true,
};

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

const Signup: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const {mutateAsync: signup, isPending} = useSignup();
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [success, setSuccess] = useState(successInit);
  const [emailError, setEmailError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [typeOfUserError, setTypeOfUserError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [value, setValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const source = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/thetaxi-b012b.appspot.com/o/Addendum.pdf?alt=media&token=bb271f61-2b83-463c-b4f7-2fa7df4d28c5',
    cache: true,
  };
  const [items, setItems] = useState<Array<{label: string; value: string}>>([
    {label: 'Hotel', value: 'Hotel'},
    {label: 'Individual', value: 'Individual'},
    {label: 'Gastronomy', value: 'Gastronomy'},
  ]);

  const {loading} = useSelector((state: RootState) => state.Auth);

  const onSignUp = () => {
    navigation.replace('HealthAssessment_1');
    if (value === null) {
      setTypeOfUserError(t('Type_of_user_is_required'));
    } else if (!validateEmail(id)) {
      setEmailError(t('valid_email_address_is_required'));
      setSuccess(prevSuccess => ({...prevSuccess, id: false}));
    } else if (name === '' || name.length < 3) {
      setNameError(t('valid_name_is_required'));
      setSuccess(prevSuccess => ({...prevSuccess, name: false}));
    } else if (password.length < 6) {
      setPasswordError(t('password_must_be_at_least_6_characters'));
      setSuccess(prevSuccess => ({...prevSuccess, password: false}));
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('passwords_do_not_match'));
      setSuccess(prevSuccess => ({...prevSuccess, confirmPassword: false}));
    } else {
      signup({email: id, password, name, userType: value}).then(() => {
        showMessage({
          description: t(
            'a_varification_email_has_been_sent_to_your_email_address',
          ),
          message: t('email_verification'),
          type: 'success',
          position: 'top',
        });

        dispatch(
          Authenticate({
            email: id,
            password,
            name,
            userType: value,
            userApplicationRoles: 0,
          }),
        );
      });
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <ScrollView>
        <View style={styles.contain}>
          <View
            style={{
              alignSelf: 'center',
              width: '85%',
              height: 200,
              // marginBottom: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text header style={{marginTop: 20}}>
              {t('sign_up_for_free')}
            </Text>
          </View>

          <TextInput
            style={[BaseStyle.textInput]}
            marginTop={0}
            onChangeText={(text: string) => {
              setId(text);
              setEmailError('');
              setSuccess(prevSuccess => ({...prevSuccess, id: true}));
            }}
            onFocus={() => {
              setSuccess(prevSuccess => ({...prevSuccess, id: true}));
            }}
            iconLeft={() => (
              <Feather
                style={{marginRight: 20}}
                name="mail"
                size={20}
                color={'white'}
              />
            )}
            autoCorrect={false}
            placeholder={t('email_address')}
            label={t('email_address')}
            placeholderTextColor={success.id ? 'white' : colors.primary}
            value={id}
            errorMessage={emailError}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput, {marginTop: 0}]}
            marginTop={14}
            onChangeText={(text: string) => {
              setName(text);
              setNameError('');
              setSuccess(prevSuccess => ({...prevSuccess, name: true}));
            }}
            onFocus={() => {
              setSuccess(prevSuccess => ({...prevSuccess, name: true}));
            }}
            iconLeft={() => (
              <Feather
                style={{marginRight: 20}}
                name="user"
                size={20}
                color={'white'}
              />
            )}
            autoCorrect={false}
            placeholder={t('user_name')}
            label={t('user_name')}
            placeholderTextColor={success.id ? 'white' : colors.primary}
            value={name}
            errorMessage={emailError}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput]}
            marginTop={14}
            onChangeText={(text: string) => {
              setPassword(text);
              setPasswordError('');
              setSuccess(prevSuccess => ({
                ...prevSuccess,
                password: true,
              }));
            }}
            onFocus={() => {
              setSuccess(prevSuccess => ({
                ...prevSuccess,
                password: true,
              }));
            }}
            autoCorrect={false}
            placeholder={t('input_password')}
            label={t('input_password')}
            iconLeft={() => (
              <Feather
                style={{marginRight: 20}}
                name="lock"
                size={20}
                color={'white'}
              />
            )}
            iconRight={() => (
              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                }}>
                <Feather
                  style={{marginLeft: 20}}
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            )}
            secureTextEntry={!showPassword}
            placeholderTextColor={success.password ? 'white' : colors.primary}
            value={password}
            errorMessage={passwordError}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput]}
            marginTop={14}
            onChangeText={(text: string) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
              setSuccess(prevSuccess => ({
                ...prevSuccess,
                confirmPassword: true,
              }));
            }}
            onFocus={() => {
              setSuccess(prevSuccess => ({
                ...prevSuccess,
                confirmPassword: true,
              }));
            }}
            iconLeft={() => (
              <Feather
                style={{marginRight: 20}}
                name="lock"
                size={20}
                color={'white'}
              />
            )}
            iconRight={() => (
              <TouchableOpacity
                onPress={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}>
                <Feather
                  style={{marginLeft: 20}}
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            )}
            autoCorrect={false}
            placeholder={t('password_confirm')}
            label={t('password_confirm')}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor={
              success.confirmPassword ? 'white' : colors.primary
            }
            value={confirmPassword}
            errorMessage={confirmPasswordError}
            selectionColor={colors.primary}
          />

          <View style={{width: '100%', marginVertical: 16}}>
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
              loading={isPending}
              style={{marginTop: 20}}
              onPress={onSignUp}>
              {t('sign_up')}
            </Button>
          </View>

          <View style={styles.contain}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text
                body2
                textAlign="center"
                style={{textDecorationLine: 'underline', marginTop: 16}}
                bold>
                {t('Already_have_an_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
