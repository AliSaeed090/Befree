import { Header, Icon, SafeAreaView, Text, Button } from '../../components';
import { BaseStyle, useTheme, Images } from '../../config';
// import { Images } from "@config";
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAskQuery, useChats } from './hooks/useAskQuery';
import TypingIndicator from './TypingIndicator';
import { useNavigation } from '@react-navigation/native';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {
  Platform,
  View,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Dimensions,
  Keyboard
} from 'react-native';
// import Lightbox from 'react-native-lightbox-v2';
import {
  Actions,
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Composer,
  SystemMessage,
} from 'react-native-gifted-chat';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Vibration } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Entypo from 'react-native-vector-icons/Entypo';
// import RenderMessageAudio from './RenderAudioMessage';
import { useActionSheet } from '@expo/react-native-action-sheet';
// import Composer from './Messages/Composer';
import VoiceInputModal from './LiveKitModal';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { use } from 'i18next';
// import { SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "../../contexts/User"
function RenderSend(props: any) {
  const { colors } = useTheme();
  return (
    <Send {...props}>
      <View
        style={{
          //   marginLeft: 5,
          //   marginRight: 5,
          marginTop: -2,
          width: 48,
          height: 48,
          backgroundColor: '#1E293B',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FontAwesome name="send" color={'white'} size={20} />
      </View>
    </Send>
  );
}

function RenderComposer(props: any) {
  const { colors } = useTheme();
  return (
    <Composer
      {...props}
      textInputProps={{
        blurOnSubmit: false, // <---- here
      }}
      // onBlur={()=>SettextInputAutoFocus(false)}
      // onFocus={() => SettextInputAutoFocus(true)}
      // textInputAutoFocus={true}
      textInputStyle={{
        // textAlignVertical: "top",
        minHeight: 48,
        maxHeight: 100,
        color: 'white',
        backgroundColor: '#1E293B',
        borderWidth: 0,
        borderRadius: 10,
        paddingLeft: 10,
        // lineHeight: Platform.OS === 'ios' ? 22 : 18,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        
        paddingTop: Platform.OS === "ios" ? 10 : 10,
        // paddingBottom: Platform.OS === "ios" ? 15 : 10,
        // paddingLeft: 15,
        // paddingRight: 15,
        // paddingBottom: 15,
        // margin: 10,
      }}
    />
  );
}
function RenderInputToolbar(props: any) {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        // maxHeight:80,
        // width:'100%',
        backgroundColor: '#334155',
        borderWidth: 0,
        borderColor: 'red',
        borderTopWidth:0,
        // borderWidth:0,
        paddingHorizontal: 5,
        // padding: 2,
        paddingVertical: 20,
        justifyContent: 'center',
        // alignItems: 'center',
        // marginTop:25
        // borderTopRightRadius: 20,
        // borderTopLeftRadius: 20,
        borderRadius: 25,
      }}
      primaryStyle={{
        borderWidth: 0,
        borderColor: 'blue',
        // alignItems: 'center',
        // padding: 2,
        //  justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}
const Messages = (props: any) => {
  // const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const { params } = props?.route;
  const { user } = useUser()
  const { showActionSheetWithOptions } = useActionSheet();
  const { mutateAsync, isPending, isError, data, error } = useAskQuery();
  const { data: chats, isLoading, error: chatError, refetch, isFetching } = useChats();
  const navigation = useNavigation();
  const [emergency_contact_no, setEmergency_contact_no] = useState('');
  const [userName, setUserName] = useState('');

  const emergency_contact_noRef: any = useRef(null);
  emergency_contact_noRef.current = emergency_contact_no;
  const userNameRef: any = useRef(null);
  userNameRef.current = userName;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const [currentUser, setCurrentUser] = useState({
    _id: auth().currentUser?.uid ?? '',
  });

  const [messages, setMessages] = useState<any>([

  ]);

  const [loadEarlier, setLoadEarlier] = useState(false);


  // useEffect(() => {
  //   console.log({params})
  //   if (params?.feelings) {
  //     let message = {
  //       _id: Math.round(Math.random() * 1000000),
  //       text: params.feelings,
  //       createdAt: new Date(),
  //       user: {
  //         _id: auth().currentUser?.uid,
  //         name: '',
  //         avatar: '',
  //       },
  //     }
  //     onSend([message]);
  //     console.log({feelings: params.feelings})
  //   }
  // }, [params]);
  const renderCustomActions = (props: any) => {
    return (
      <TouchableOpacity
        onPress={() => handleOpenModal()}
        style={{
          marginTop: -2,
          width: 48,
          height: 48,
          backgroundColor: '#1E293B',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FontAwesome name="microphone" size={16} color={'white'} />
      </TouchableOpacity>
    );
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        containerStyle={{}}
        wrapperStyle={{
          left: {
            borderColor: 'blue',
            backgroundColor: '#1E293B',
            color: 'white',
            borderWidth: 0,
            marginBottom: 15,
            padding: 6,
          },
          right: {
            backgroundColor: colors.primary,
            marginBottom: 15,
            padding: 6,
          },
        }}
        bottomContainerStyle={{
          left: { borderWidth: 0, margin: 0, color: 'white' },
          right: { borderWidth: 0, margin: 0 },
        }}
        tickStyle={{}}
        usernameStyle={{
          color: colors.primary,
          fontWeight: 'bold',
          margin: 0,
          fontSize: 12,
        }}
        textStyle={{
          left: { color: 'white' },
          right: { color: 'white' },
        }}
        containerToNextStyle={{
          left: { borderColor: 'black', borderWidth: 1 },
          right: {},
        }}
        containerToPreviousStyle={{
          left: { borderColor: colors.primary, borderWidth: 0 },
          right: {},
        }}
      />
    );
  };

  const forwordMessage = () => { };
  function RenderMessageImage(props: any) {
    return (
      <View
        style={{
          position: 'relative',
          height: 350,
          width: 250,
          backgroundColor: 'black',
          overflow: 'hidden',
        }}>
        {/* <Lightbox ƒ={() => onLongPress(null, props.currentMessage)}> */}
        <View style={{ position: 'relative', backgroundColor: 'black' }}>
          <Image
            resizeMode="cover"
            style={{
              height: '100%',
              width: '100%',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            source={{ uri: props.currentMessage.image }}
          />
        </View>
        {/* </Lightbox> */}
      </View>
    );
  }

  const onLongPress = (context: any, currentMessage: any) => {
    // Vibration.vibrate(10);
    // //console.log({user:currentMessage.user})

    const uid = '';
    const options = [
      'Copy Text',
      'Delete Message',
      'Forword Message',
      'Cancel',
    ];

    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage.text);
            break;
          default:
            break;
        }
      },
    );
  };

  const renderSystemMessage = (props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };

  const getProfile = async () => {
    try {
      let profile: any = user
      // //console.log({user})
      if (user) {
        profile = user
        // //console.log({phoneNumber:profile.phoneNumber, name:profile.name});
        setEmergency_contact_no(profile.emergencyPhone);
        setUserName(profile.firstName);
      }
    } catch (error) {
      console.error('Error retrieving item', error);
    }
  };
  const handleSubmit = useCallback(
    (message: any) => {
      // //console.log({
      //   emergency_contact_no: emergency_contact_noRef.current,
      //   user_name: userNameRef.current,
      // });
      mutateAsync({
        ...message,
        user_id: message.user._id,
        emergency_contact_no: emergency_contact_noRef.current ?? "",
        user_name: userNameRef.current ?? "",
        // user_id: message.user._id,
      }).then((res: any) => {
        // //console.log({res});
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, res.data),
        );
      });
    },
    [emergency_contact_noRef.current, userNameRef.current],
  );

  const onSend = useCallback((messages = []) => {
    // //console.log({messages});

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    handleSubmit(messages[0]);
  }, []);




  useEffect(() => {
    getProfile();
    if (isLoading) {
      console.log('Loading...');
    } else if (isError) {
      //console.log('Error:', error);
    } else if (chatError) {
      //console.log('Error:', chatError);
    } else {
      // //console.log({chats})
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, chats),
      );
      // //console.log({chats: JSON.stringify(chats)});
    }

  }, [isLoading, isError, error, chats]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    Keyboard.dismiss();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    refetch()
  };

  const handleSubmitModal = (message: any) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    // Handle the submission of voice recording
    // setModalVisible(false);
  };
  return (
    <>
      <SafeAreaView style={{
        flex: 0, backgroundColor: "#334155", height: 80, borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        zIndex:1
      }} >
        <Header
          style={{
            backgroundColor: '#334155',
            borderBottomStartRadius: 20,
            borderBottomEndRadius: 20,

            height: 80,
            zIndex: 10
          }}
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
              <Text callout bold>
                BeFree AI
              </Text>
            </View>
          )}
          renderRight={() => (
            null
          )}
        />
      </SafeAreaView>
      <SafeAreaView
        style={[
          BaseStyle.safeAreaView,
          {
            // backgroundColor: colors.card,

            borderBottomStartRadius: 32,
            borderBottomEndRadius: 32,
          },
        ]}
        edges={['right', 'top', 'left', 'bottom']}>

        {isModalVisible === true && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: Dimensions.get('window').height,
              backgroundColor: '#0F172A',
            }}>
            <VoiceInputModal
              isVisible={isModalVisible}
              onClose={handleCloseModal}
              onSubmit={handleSubmitModal}
            />
          </View>
        )}
        <GiftedChat
          inverted={true}
          renderLoading={() => <ActivityIndicator size="large" color="#fff" />}
          shouldUpdateMessage={() => true}
          messages={messages}
          isTyping={isPending || isFetching}
          // isAnimated={true}
          isLoading={true}
          showAvatarForEveryMessage={true}
          onSend={(messages: any) => onSend(messages)}
          onLongPress={onLongPress}
          loadEarlier={loadEarlier}
          user={currentUser}
          renderActions={renderCustomActions}
          renderBubble={renderBubble}
          renderSystemMessage={renderSystemMessage}
          // renderCustomView={renderCustomView}
          // renderFooter={RenderFooter}
          renderSend={props => <RenderSend {...props} />}
          // messagesContainerStyle={keyboardStatus?{}:{ height: "95%" }}

          renderMessageImage={props => <RenderMessageImage {...props} />}
          // renderMessageAudio={props => (
          //   <RenderMessageAudioFunction {...props} />
          // )}
          // renderMessageVideo={props => <RenderMessageVideo {...props} />}
          // renderAccessory={reply.isReply ? RenderFooter() :()=> <View/>}
          keyboardShouldPersistTaps="always"
          // {...platformConf}
          alwaysShowSend
          scrollToBottom
          // showUserAvatar
          renderFooter={(props: any) => <TypingIndicator {...props} />}

          renderAvatarOnTop
          renderUsernameOnMessage
          bottomOffset={isIphoneX() ? -1 : -20}
          // onPressAvatar={//console.log}
          renderInputToolbar={props => <RenderInputToolbar {...props} />}
          renderComposer={props => <RenderComposer {...props} />}
          // renderAvatar={props => (
          //   <RenderAvatar
          //     {...props}
          //     func={onPressLeftSecond}
          //     adminGroup={adminGroup}
          //   />
          // )}
          listViewProps={{
            initialNumToRender: 20,
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default Messages;
