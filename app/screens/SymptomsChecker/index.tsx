import {Header, Icon, SafeAreaView, Text, Button} from '../../components';
import {BaseStyle, useTheme, Images} from '../../config';
// import { Images } from "@config";
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useVoiceflowAI} from './hooks/useAskQuery';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';
import {
  Platform,
  View,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Dimensions,
} from 'react-native';
// import Lightbox from 'react-native-lightbox-v2';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Actions,
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Composer,
  SystemMessage,
} from 'react-native-gifted-chat';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Vibration} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Entypo from 'react-native-vector-icons/Entypo';
// import RenderMessageAudio from './RenderAudioMessage';
import {useActionSheet} from '@expo/react-native-action-sheet';

// import Composer from './Messages/Composer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {use} from 'i18next';
import {useUser} from '../../contexts/User';
// import { SwipeRow } from 'react-native-swipe-list-view';

function RenderSend(props: any) {
  const {colors} = useTheme();
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

function RenderAvatar(props: any) {
  return (
    <TouchableOpacity disabled={props.adminGroup} onPress={props.func}>
      <Image
        source={{uri: props.currentMessage.user.avatar}}
        style={styles.styleThumb}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
function RenderComposer(props: any) {
  const {colors} = useTheme();

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
        lineHeight: Platform.OS === 'ios' ? 22 : 18,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: Platform.OS === "ios" ? 15 : 10,
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
  return null;
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        // maxHeight:80,
        // width:'100%',
        backgroundColor: '#334155',
        // borderWidth: 1,
        borderColor: 'transparent',
        paddingHorizontal: 5,
        // padding: 2,
        paddingVertical: 20,
        justifyContent: 'center',
        // alignItems: 'center',
        // marginTop:25
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }}
      primaryStyle={{
        borderWidth: 0,
        // alignItems: 'center',
        // padding: 2,
        //  justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}
function RenderQuickReplies(props: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          // width: '30%',
          backgroundColor: '#475569',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          gap: 5,
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}>
        <MaterialIcons name="bookmark" size={15} color={'white'} />
        <Text whiteColor body2>
          Bookmark
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          // width: '30%',
          backgroundColor: '#475569',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          gap: 5,
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}>
        <MaterialIcons name="bookmark-outline" size={15} color={'white'} />
        <Text whiteColor body2>
          Bookmark
        </Text>
      </View>
    </View>
  );
}
const Messages = (props: any) => {
  const {getUserData} = useUser();
  // const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  const [userID, setUserId] = useState('');
  const {mutateAsync, data, isPending, isError, error} = useVoiceflowAI();

  const handleLaunch = (user_id: string) => {
    mutateAsync({
      type: 'launch',
      label: 'Hello, how are you?',
      user_id: user_id,
    }).then((res: any) => {
      //console.log({res});
    });
  };
  const start = () => {
    let user_id = Math.random().toString(36).substring(7);
    handleLaunch(user_id);
    setUserId(user_id);
  };
  useEffect(() => {
    start();
  }, []);

  const saveScores = (scores: any) => {
    const userId = auth().currentUser?.uid;
    //console.log({scores: scores});
    firestore()
      .collection('SymptomsCheckerResults')
      .add({
        ...scores,
        patientId: userId,
        createdAt: new Date(),
      });
    firestore()
      .collection('patients')
      .doc(userId)
      .update({
        SymptomsCheckerResults: {...scores, createdAt: new Date()},
      })
      .then(() => {
        getUserData();
      });
    // AsyncStorage.setItem('SymptomsCheckerResults', JSON.stringify(scores.overAll));
  };
  useEffect(() => {
    if (isPending) {
      //console.log('Loading...');
    } else if (isError) {
      //console.log('Error:', error);
    } else {
      if (data?.scores) {
        saveScores(data?.scores);
        let obj: any = {
          _id: Math.round(Math.random() * 1000000),
          text: t('your_symptoms_results_are_ready'),
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: false,
            values: [
              {
                title: t('view_results'),
                value: 1,
                data: data.scores,
                type: 'checkbox',
              },
              {
                title: t('Re_Take_Symptom_Check'),
                value: 2,
                data: data.scores,
                type: 'checkbox',
              },
            ],
          },
          createdAt: new Date(),

          user: {
            _id: 1,
            name: 'BeFree',
            avatar:
              'https://img.freepik.com/premium-photo/doctor-digital-avatar-generative-ai_934475-9227.jpg',
          },
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, obj),
        );
      } else if (data?.text) {
        //console.log({data: data.text});
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, data?.text),
        );
      }
    }
  }, [isPending, isError, error, data]);

  const {showActionSheetWithOptions} = useActionSheet();
  //   const {mutateAsync, isPending, isError, data, error} = useAskQuery();
  //   const {data: chats, isLoading, error: chatError} = useChats();
  const {navigation} = props;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const [currentUser, setCurrentUser] = useState({
    _id: auth().currentUser?.uid ?? '',
  });

  const [messages, setMessages] = useState([]);

  const [loadEarlier, setLoadEarlier] = useState(false);

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
        //   renderMessageText={(props:any) => {
        //     //console.log({props})
        //     return (
        //       <Text
        //         style={{
        //           color: 'white',
        //         //   fontSize: 16,
        //         //   fontWeight: 'bold',
        //         }}
        //         // numberOfLines={1}
        //       >
        //         {props.currentMessage.text}
        //       </Text>
        //     );
        //   }}
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
          left: {borderWidth: 0, margin: 0, color: 'white'},
          right: {borderWidth: 0, margin: 0},
        }}
        tickStyle={{}}
        usernameStyle={{
          color: colors.primary,
          fontWeight: 'bold',
          margin: 0,
          fontSize: 12,
        }}
        textStyle={{
          left: {color: 'white'},
          right: {color: 'white'},
        }}
        containerToNextStyle={{
          left: {borderColor: 'black', borderWidth: 1},
          right: {},
        }}
        containerToPreviousStyle={{
          left: {borderColor: colors.primary, borderWidth: 0},
          right: {},
        }}
      />
    );
  };

  const forwordMessage = () => {};
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
        {/* <Lightbox onLongPress={() => onLongPress(null, props.currentMessage)}> */}
        <View style={{position: 'relative', backgroundColor: 'black'}}>
          <Image
            resizeMode="cover"
            style={{
              height: '100%',
              width: '100%',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            source={{uri: props.currentMessage.image}}
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
          case 1:
            break;
          case 2:
            forwordMessage();
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

  const handleSubmit = (message: any) => {
    //console.log({message});
  };
  const onSend = useCallback((messages = []) => {
    //console.log({messages});
    // sendMessage(messages[0].text);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    // handleSubmit(messages[0]);
  }, []);

  //   useEffect(() => {
  //     if (isLoading) {
  //       //console.log('Loading...');
  //     } else if (isError) {
  //       //console.log('Error:', error);
  //     } else if (chatError) {
  //       //console.log('Error:', chatError);
  //     } else {
  //       setMessages(previousMessages =>
  //         GiftedChat.append(previousMessages, chats),
  //       );
  //       //console.log({chats: JSON.stringify(chats)});
  //     }
  //   }, [isLoading, isError, error, chats]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmitModal = (message: any) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    // Handle the submission of voice recording
    // setModalVisible(false);
  };
  const onQuickReply = (message: any) => {
    let updatedMessage = message[0];
    if (updatedMessage.value === 1) {
      navigation.navigate('SymptomsCheckerResults', {
        scores: updatedMessage.data,
      });
      return;
    } else if (updatedMessage.value === 2) {
      setMessages(previousMessages => []);
      // handleLaunch(userID);
      start();
      return;
    }

    //console.log({type: updatedMessage.type, label: updatedMessage.title});
    let obj: any = {
      _id: Math.round(Math.random() * 1000000),
      text: message[0].title.trim(),
      createdAt: new Date(),
      user: {
        _id: auth().currentUser?.uid ?? '',
        name: '',
        avatar: '',
      },
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, obj));
    mutateAsync({
      type: updatedMessage.type,
      label: updatedMessage.title,
      user_id: userID,
      actions: [],
    }).then((res: any) => {
      //console.log({res});
    });
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
          zIndex:10
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
              {t('AI_Mental_Illness_Symptom_Checker')}
            </Text>
          </View>
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
     

      <GiftedChat
        messages={messages}
        // isAnimated={true}
        isTyping={isPending}
        showAvatarForEveryMessage={true}
        onSend={(messages: any) => onSend(messages)}
        onQuickReply={onQuickReply}
        onLongPress={onLongPress}
        loadEarlier={loadEarlier}
        user={currentUser}
        renderActions={renderCustomActions}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderFooter={props => <TypingIndicator {...props} />}
        // renderCustomView={renderCustomView}
        // renderFooter={RenderFooter}
        renderSend={props => <RenderSend {...props} />}
        // messagesContainerStyle={keyboardStatus?{}:{ height: "95%" }}

        renderMessageImage={props => <RenderMessageImage {...props} />}
        keyboardShouldPersistTaps="always"
        // {...platformConf}
        alwaysShowSend
        scrollToBottom
        // showUserAvatar
        renderAvatarOnTop
        renderUsernameOnMessage
        bottomOffset={isIphoneX() ? -1 : -20}
        // onPressAvatar={//console.log}
        renderInputToolbar={props => <RenderInputToolbar {...props} />}
        renderComposer={props => <RenderComposer {...props} />}
        renderQuickReplies={props => <QuickReplies {...props} />}
        quickReplyTextStyle={{
          color: 'white',
        }}
        //   quickReplyStyle={{
        //     borderColor: 'white',
        //     borderWidth:1
        //   }}
        listViewProps={{
          initialNumToRender: 20,
        }}
      />
    </SafeAreaView>
</>
  );
};

export default Messages;
