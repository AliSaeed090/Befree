import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, View, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, Button, Header, Dropdown, Text, TextInput } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import { Authenticate } from '../../redux/slices/Auth';
import { RootState, AppDispatch } from '../../redux/index';
import {showMessage, hideMessage} from 'react-native-flash-message';
import styles from './styles';
import { useForgotPassword } from './hooks/useSignIn';
const successInit = {
  id: true,
  password: true,
};

const validateEmail = (email: string): boolean => {
  return !!email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

interface Props {
  navigation: any;
}

const Signup: React.FC<Props> = ({ navigation }) => {
  const dispatch =useDispatch()
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {  mutateAsync:ForgotPassword,isPending } = useForgotPassword();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState(successInit);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');   

  const onSignUp = () => {
    
     if (!validateEmail(id)) {
      setEmailError(t("valid_email_address_is_required"));
      setSuccess((prevSuccess) => ({ ...prevSuccess, id: false }));
    } 
    
    
    
     else{

     
      
      ForgotPassword(id).then((data:any)=>{
        navigation.navigate('SignIn')
        //console.log({data})
        showMessage({
          description: "A rest link has been sent",
          message: "Successfull sent email",
          type: 'success',
          position: 'top',
        })
       
      }).catch((e:any)=>{
        //console.log({e})
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
      edges={['right', 'top', 'left']}
    >
      <Header
        title={t('reset_password')}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={offsetKeyboard}
         
        > */}
          <View style={styles.contain}>
            <View
              style={{
                alignSelf: 'center',
                width: '85%',
                height: 200,
                marginBottom: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          
            <TextInput
            label={t("enter_your_email_address_and_we'll_send_you_a_rest_link")}
              style={[BaseStyle.textInput, { marginTop: 10 }]}
              onChangeText={(text:string) => {
                setId(text);
                setEmailError('');
                setSuccess((prevSuccess) => ({ ...prevSuccess, id: true }));
              }}
              onFocus={() => {
                setSuccess((prevSuccess) => ({ ...prevSuccess, id: true }));
              }}
              autoCorrect={false}
              placeholder={t('email_address')}
              placeholderTextColor={
                success.id ? BaseColor.grayColor : colors.primary
              }
              value={id}
              errorMessage={emailError}
              selectionColor={colors.primary}
            />
           
           
            <View style={{ width: '100%', marginVertical: 16 }}>
              <Button
                full
                loading={isPending}
                style={{ marginTop: 20 }}
                onPress={onSignUp}
              >
                {t('reset_password')}
              </Button>
            </View>
            <View style={styles.contentActionBottom}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
              >
                <Text body2 style={{ textDecorationLine: 'underline' }} grayColor>
                  {t('go_back_to_login')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height:400}}/>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
