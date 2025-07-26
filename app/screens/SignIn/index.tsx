import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, Button, Header, Text, TextInput} from '../../components';
import {BaseColor, BaseStyle, useTheme} from '../../config';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import {Authenticate} from '../../redux/slices/Auth';
import {RootState, AppDispatch} from '../../redux/index';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import {useSignIn} from './hooks/useSignIn';
const successInit = {
  id: true,
  password: true,
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
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {mutateAsync: signInUser, isPending} = useSignIn();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState(successInit);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSignUp = () => {
    navigation.replace('HealthAssessment_1');
    if (!validateEmail(id)) {
      setEmailError(t('valid_email_address_is_required'));
      setSuccess(prevSuccess => ({...prevSuccess, id: false}));
    } else if (password.length < 6) {
      setPasswordError(t('password_must_be_at_least_6_characters'));
      setSuccess(prevSuccess => ({...prevSuccess, password: false}));
    } else {
      signInUser({email: id, password}).then((data: any) => {
        //console.log({data});
        dispatch(
          Authenticate({
            email: data.email,
            name: data.name,
            userType: data.userType,
            userApplicationRoles: data.userApplicationRoles,
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
              {t('sign_in_to_be_free')}
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

          {/* <View style={styles.contentActionBottom}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text body2 style={{textDecorationLine: 'underline'}} bold>
                {t('forgot_password?')}
              </Text>
            </TouchableOpacity>
          </View> */}

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
              {t('sign_in')}
            </Button>
          </View>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text body2 style={{textDecorationLine: 'underline'}} bold>
                {t('Dont_have_an_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 400}} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
