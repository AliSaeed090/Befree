import {Header, Icon, SafeAreaView, Text, Button} from '@components';
import {BaseStyle, useTheme} from '@config';
// import { Images } from "@config";
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  Platform,
  View,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Image from '@components/Image';
import Lightbox from 'react-native-lightbox-v2';
import {
  Actions,
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
} from 'react-native-gifted-chat';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Vibration} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import RBSheet from 'react-native-raw-bottom-sheet';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Entypo from 'react-native-vector-icons/Entypo';
import RenderMessageAudio from './RenderAudioMessage';
import {useActionSheet} from '@expo/react-native-action-sheet';
import Composer from './Composer';
import CustomView from './CustomView';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CallAtions, ApplicationActions} from '@actions';
import {useDispatch} from 'react-redux';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import VideoPlayer from 'react-native-video-player';
// import { SwipeRow } from 'react-native-swipe-list-view';

var unsubscribe;
var unsubscribeArr = [];
var groupAvatar =
  'https://firebasestorage.googleapis.com/v0/b/wepoc-446d9.appspot.com/o/groupAvatar%2Ficon-groups-3.jpg?alt=media&token=840a0ac6-f844-491f-8b86-2dc43ad29b17';
// let admins = ['BohoykH7UtgyX74WY2jUxeP2Nkl1', 'QlsC0paLBWMG4eUw18mMQriNUvD3', 'VvENkskVciVMLMsFgffkA7xGCyu1', 'ZHu2VUDEnRevr5fqnDWLkiykDLU2', 'v4YZwO4nVlh3oEqrEyJ3rjVEQlg2']

function RenderSend(props) {
  const {colors} = useTheme();
  return (
    <Send {...props}>
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5,
          marginRight: 5,
          marginTop: -2,
        }}>
        <FontAwesome name="send" color={colors.primary} size={20} />
      </View>
    </Send>
  );
}
function RenderMessageAudioFunction(props) {
  return <RenderMessageAudio audioUrl={props.currentMessage.audio} />;
}

function RenderMessageVideo(props) {
  return (
    <View
      style={{
        position: 'relative',
        height: 350,
        width: 250,
        backgroundColor: 'black',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}>
      <VideoPlayer
        style={{
          height: 350,
          width: 250,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: 'black',
        }}
        resizeMode="contain"
        video={{uri: props.currentMessage.video}}
        videoWidth={1600}
        videoHeight={900}
        thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
      />
    </View>
  );
}

function RenderAvatar(props) {
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
function RenderComposer(props) {
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
        minHeight: 50,
        maxHeight: 100,
        color: '#222B45',
        backgroundColor: 'white',
        borderWidth: 0,
        borderRadius: 20,
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
function RenderInputToolbar(props) {
  const {adminGroup, isAdminUser} = props;
  const {colors} = useTheme();

  if (adminGroup && isAdminUser) {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          // maxHeight:80,

          // width:'100%',
          backgroundColor: colors.background,
          borderWidth: 0,
          // padding: 2,
          // paddingTop: 5,
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop:25
        }}
        primaryStyle={{
          // alignItems: 'center',
          // padding: 2,
          lineHeight: 20,
          //  justifyContent: 'center',
          // alignItems: 'center'
        }}
      />
    );
  } else if (adminGroup && !isAdminUser) {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text>Only Admins can send messages</Text>
      </View>
    );
  }
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        // maxHeight:80,
        // width:'100%',
        backgroundColor: colors.background,
        borderWidth: 0,
        padding: 2,
        // paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop:25
      }}
      primaryStyle={{
        // alignItems: 'center',
        padding: 2,
        //  justifyContent: 'center',
        // alignItems: 'center'
      }}
    />
  );
}
const Messages = props => {
  // const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const {showActionSheetWithOptions} = useActionSheet();
  const sheetref = useRef();

  const {useSelector} = require('react-redux');
  const callState = useSelector(state => state.callState);
  const dispatch = useDispatch();
  const {navigation} = props;
  const {params} = props.route;
  const {t} = useTranslation();
  const {colors} = useTheme();

  const user = useSelector(state => state.application.currentUser);

  const [isAdminUser, setisAdminUser] = useState(false);
  const [adminGroup, setAdminGroup] = useState(true);
  const [otherParticipants, setotherParticipants] = useState([]);
  const [roomType, setroomType] = useState('');
  const [groupID, setgroupID] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [allUsers, setallUsers] = useState([]);
  const allUserRef = useRef(null);
  allUserRef.current = allUsers;
  const [currentUser, setCurrentUser] = useState({
    _id: '',
    name: '',
    avatar: '',
    uid: '',
  });

  useEffect(async () => {
    if (user) {
      setCurrentUser({
        _id: user.uid,
        name: user.userName,
        avatar: user.profilePictureURL,
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        profilePictureURL: user.profilePictureURL,
        userName: user.userName,
      });
    }
  }, [user]);

  useEffect(async () => {
    if (params) {
      const uid = auth().currentUser.uid;
      //console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssss');
      setotherParticipants(params.otherParticipants);
      setroomType(params.roomType);
      setgroupID(params.groupID);
      setRoomTitle(params.roomTitle);
      setRoomImage(params.roomImage);
      setAdminGroup(params.adminGroup);
      if (params.admins?.includes(uid)) {
        setisAdminUser(true);
      }

      // getMessageFromFirebase(params.otherParticipants, params.roomType, params.groupID, user)
      getMessageFromFirebaseUpdate(
        params.otherParticipants,
        params.roomType,
        params.groupID,
        user,
        params.onNotificationOpenedApp,
      );
      updateMessageIsRead(
        params.otherParticipants,
        params.roomType,
        params.groupID,
        user,
      );
    }
  }, []);

  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);
  messagesRef.current = messages;
  const [loadEarlier, setLoadEarlier] = useState(false);
  const [typingText, setTypingText] = useState(false);
  // const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isLoadingMessages, setisLoadingMessages] = useState(true);

  useEffect(() => {
    getAllusers();

    return () => {
      setMessages([]);
      unsubscribe();
      unsubscribeArr.forEach(i => i());
    };
  }, []);

  // const onLoadEarlier = () => {
  //   setIsLoadingEarlier(true);

  //   setTimeout(() => {
  //     if (_isMounted === true) {
  //       setMessages(GiftedChat.prepend(messages, messagesOldInit));
  //       setLoadEarlier(false);
  //       setIsLoadingEarlier(false);
  //     }
  //   }, 500); // simulating network
  // };

  const getAllusers = async () => {
    const allUsers = await firestore().collection('Users').get();
    let arr = [];
    allUsers.forEach(x => {
      arr.push(x.data());
    });
    // let newArr = arr.filter((x) => {

    //   return x.phoneNumber === "+19174054097" || x.phoneNumber === "+12015899089" || x.phoneNumber === "+17187496149" || x.phoneNumber === "+13233005413" || x.phoneNumber === "+923132532906"
    // })
    // newArr = newArr.map((x) => x.uid)

    setallUsers(arr);
    // //console.log({ arr, newArr: newArr })
  };
  const updateMessageIsRead = (
    participants,
    roomType,
    groupID,
    currentUser,
  ) => {
    var roomID;
    const uid = auth().currentUser.uid;
    const otherParticipants = participants.filter(peer => peer.uid != uid);
    otherParticipants.forEach((peer, i) => {
      if (participants.length > 2) {
        roomID = groupID;
      } else {
        roomID = createRoomID(peer.uid);
      }

      unsubscribeArr[i] = firestore()
        .collection('Messages')
        .doc(peer.uid)
        .collection('Rooms')
        .doc(roomID)
        .collection('Chats')
        .where('sent', '==', true)
        .onSnapshot(doc => {
          doc.forEach(async eachMessage => {
            await firestore()
              .collection('Messages')
              .doc(peer.uid)
              .collection('Rooms')
              .doc(roomID)
              .collection('Chats')
              .doc(eachMessage.id)
              .update({received: true, sent: false, pending: false});
          });
        });

      dispatch(
        ApplicationActions.setSnapshotListner({
          func: unsubscribeArr[i],
          type: 'message',
        }),
      );
    });
  };

  const getMessageFromFirebaseUpdate = (
    otherParticipants,
    roomType,
    groupID,
    currentUser,
    onNotificationOpenedApp,
  ) => {
    //console.log('getMessageFromFirebaseUpdate');
    const uid = auth().currentUser.uid;

    var roomID;

    if (otherParticipants.length > 2) {
      roomID = groupID;
    } else {
      let otherUser = otherParticipants.filter(data => data.uid != uid);
      //console.log({otherUser, uid});
      roomID = createRoomID(otherUser[0].uid);
    }
    //console.log({roomID, length: otherParticipants.length});
    unsubscribe = firestore()
      .collection('Messages')
      .doc(uid)
      .collection('Rooms')
      .doc(roomID)
      .collection('Chats')
      .orderBy('createdAt')
      // .limit(100)
      .onSnapshot(mess => {
        if (mess.empty) {
          setisLoadingMessages(false);
        } else {
          let arr = [];
          let type = '';
          Promise.all(mess.docChanges())
            .then(async () => {
              for (const eachMessage of mess.docChanges()) {
                if (eachMessage.type === 'added') {
                  let obj = eachMessage.doc.data();
                  obj['createdAt'] = obj.createdAt.toDate();

                  if (mess.docChanges().length === 1) {
                    if (messagesRef.current.some(x => x._id === obj._id)) {
                      // //console.log({ includes: messagesRef.current })
                    } else {
                      arr.unshift(obj);
                    }
                  } else {
                    arr.unshift(obj);
                  }

                  type = eachMessage.type;
                }
                if (eachMessage.type === 'removed') {
                  type = eachMessage.type;
                  let newArr = messagesRef.current;

                  let obj = eachMessage.doc.data();
                  let messageIndex = newArr.findIndex(x => x._id === obj._id);

                  newArr.splice(messageIndex, 1);
                  arr = newArr;
                }

                if (eachMessage.type === 'modified') {
                  type = eachMessage.type;
                  let newArr = messagesRef.current;

                  let obj = eachMessage.doc.data();
                  obj['createdAt'] = obj.createdAt.toDate();
                  let messageIndex = newArr.findIndex(x => x._id === obj._id);

                  newArr[messageIndex] = obj;
                  arr = newArr;
                }
              }
              return {arr, type};
            })
            .then(async data => {
              if (data.type === 'removed' || data.type === 'modified') {
                setMessages(previousMessages =>
                  GiftedChat.append([], data.arr),
                );
              } else if (onNotificationOpenedApp) {
                setMessages(previousMessages =>
                  GiftedChat.append(previousMessages, data.arr),
                );
              } else {
                setMessages(previousMessages =>
                  GiftedChat.append(previousMessages, data.arr),
                );
              }

              // //console.log("loadingFalse", data.arr.length)
              setisLoadingMessages(false);
            });
          firestore()
            .collection('Rooms')
            .doc(uid)
            .collection('Rooms')
            .doc(roomID)
            .update({isRead: 0});
        }
      });

    dispatch(
      ApplicationActions.setSnapshotListner({
        func: unsubscribe,
        type: 'message',
      }),
    );
  };
  const sendMessageToFirebase = async (id, message, uid, isNew) => {
    //console.log({id, message, uid, isNew});
    // var cond = cond +1.
    try {
      await firestore()
        .collection('Messages')
        .doc(uid)
        .collection('Rooms')
        .doc(id)
        .collection('Chats')
        .doc(message[0]._id)
        .set(message[0]);
      await firestore()
        .collection('Messages')
        .doc(uid)
        .collection('Rooms')
        .doc(id)
        .collection('Chats')
        .doc(message[0]._id)
        .update({pending: false, sent: true});
    } catch (err) {
      //console.log({err});
    }
  };
  const createRoomID = chateeUID => {
    const chatterID = auth().currentUser.uid;
    const chateeID = chateeUID;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join('_');
  };

  const createRoomUpdated = messagesNew => {
    let Participants = adminGroup ? allUserRef.current : otherParticipants;
    //console.log({Participants, adminGroup});
    sendPushNotification(messagesNew[0].text, Participants);
    const uid = auth().currentUser.uid;
    var roomID;

    if (Participants.length > 2) {
      roomID = groupID;
    } else {
      let otherUser = Participants.filter(data => data.uid != uid);
      roomID = createRoomID(otherUser[0].uid);
    }

    Participants.forEach((user, i) => {
      let dbRef = firestore()
        .collection('Rooms')
        .doc(user.uid)
        .collection('Rooms')
        .doc(roomID);
      dbRef.get().then(doc => {
        if (!doc._exists) {
          dbRef
            .set({
              admins: params.admins,
              // admins:admins,
              groupID: groupID,
              adminGroup: adminGroup,
              otherParticipants: Participants,
              roomID: roomID,
              messageText: messagesNew[0].text,
              createdAt: messagesNew[0].createdAt,
              uid: user.uid,
              senderId: currentUser.uid,
              isRead: 1,
              count: 1,
              roomType: Participants.length > 2 ? 'group' : 'single',
              roomTitle:
                Participants.length > 2
                  ? roomTitle
                  : i === 0
                  ? Participants[1].userName
                  : Participants[0].userName,
              profilePictureURL:
                Participants.length > 2
                  ? groupAvatar
                  : i === 0
                  ? Participants[1].profilePictureURL
                  : Participants[0].profilePictureURL,
              GlobalRoomID: roomID,
            })
            .then(added => {
              sendMessageToFirebase(roomID, messagesNew, user.uid, true);
            })
            .catch(err => {
              alert(err.message);
            });
        } else {
          dbRef
            .update({
              admins: params.admins,
              // admins:admins,
              groupID: groupID,
              otherParticipants: Participants,
              adminGroup: adminGroup,
              roomID: roomID,
              messageText: messagesNew[0].text,
              createdAt: messagesNew[0].createdAt,
              uid: user.uid,
              senderId: currentUser.uid,
              isRead:
                user.uid === currentUser.uid
                  ? doc.data().isRead
                  : doc.data().isRead + 1,
              count: doc.data().count + 1,

              roomType: Participants.length > 2 ? 'group' : 'single',
              roomTitle:
                Participants.length > 2
                  ? roomTitle
                  : i === 0
                  ? Participants[1].userName
                  : Participants[0].userName,
              profilePictureURL:
                Participants.length > 2
                  ? groupAvatar
                  : i === 0
                  ? Participants[1].profilePictureURL
                  : otherParticipants[0].profilePictureURL,
            })
            .then(() => {
              sendMessageToFirebase(roomID, messagesNew, user.uid);
            })
            .catch(err => {
              alert(err.message);
            });
        }
      });
    });
  };

  const [state, setState] = useState({
    recordSecs: '',
    recordTime: '00:00:00',
  });
  const [audioRecorderPlayer, setAudioRecorderPlayer] = useState(
    new AudioRecorderPlayer(),
  );

  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      setState(prvState => ({
        ...prvState,
        recordSecs: e.currentPosition,
        path: result,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      }));
      return;
    });
    // //console.log({ result });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setState(prvState => ({
      ...prvState,
      path: '',
      recordSecs: 0,
    }));
    sheetref.current.close();
    // //console.log({ result, state });
  };

  const sendAudio = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        // //console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          // //console.log('Permissions granted');
          onStartRecord();
        } else {
          // //console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        //   console.warn(err);
        return;
      }
    } else {
      onStartRecord();
    }
  };

  const sendAudioToChat = async () => {
    onStopRecord();
    const _id = uniqueId();
    const messLocal = [
      {
        _id: _id,
        text: '',
        createdAt: new Date(),
        user: currentUser,
        audio: state.path,
      },
    ];
    setMessages(GiftedChat.append(messages, messLocal));

    const uid = auth().currentUser.uid;
    var reference = storage().ref(`chatAudioMessages/${uid}/${_id}`);
    await reference.putFile(state.path);
    const path = await storage()
      .ref(`chatAudioMessages/${uid}/${_id}`)
      .getDownloadURL();

    const mess = [
      {
        _id: _id,
        text: '',
        createdAt: new Date(),
        user: currentUser,
        audio: path,
      },
    ];
    onSendMediaMessage(mess);
  };

  const onSendMediaMessage = (messagesNew = []) => {
    // //console.log({ messagesNew })

    // createRoom(messagesNew)

    createRoomUpdated(messagesNew);
    // answerDemo(messagesNew);
  };

  const openDocumentPicker = async () => {
    var pathUri = '';
    const _id = uniqueId();
    var messLocal;
    var mess;
    const DocumentPicker = require('react-native-document-picker');
    const RNFS = require('react-native-fs');

    try {
      const files = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      files.forEach(async res => {
        if (Platform.OS === 'android') {
          const destPath = `${RNFS.TemporaryDirectoryPath}/${uniqueId()}`;
          await RNFS.copyFile(res.uri, destPath);
          pathUri = await RNFS.stat(destPath);
          pathUri = pathUri.path;
        } else {
          pathUri = res.uri;
        }

        if (res.type === 'audio/mpeg') {
          messLocal = [
            {
              _id: _id,
              text: '',
              createdAt: new Date(),
              user: currentUser,
              audio: pathUri,
              pending: true,
              fileName: res.name,
            },
          ];
        } else {
          messLocal = [
            {
              _id: _id,
              text: '',
              createdAt: new Date(),
              user: currentUser,
              file: pathUri,
              pending: true,
              fileName: res.name,
            },
          ];
        }
        //console.log({res, messLocal});
        setMessages(GiftedChat.append(messages, messLocal));

        const uid = auth().currentUser.uid;
        var reference = storage().ref(`chat/${uid}/${_id}`);
        await reference.putFile(pathUri);
        const path = await storage().ref(`chat/${uid}/${_id}`).getDownloadURL();

        if (res.type === 'audio/mpeg') {
          mess = [
            {
              _id: _id,
              text: '',
              createdAt: new Date(),
              user: currentUser,
              audio: path,

              sent: true,
              fileName: res.name,
            },
          ];
        } else {
          mess = [
            {
              _id: _id,
              text: '',
              createdAt: new Date(),
              user: currentUser,
              file: path,
              sent: true,
              fileName: res.name,
            },
          ];
        }

        onSendMediaMessage(mess);
      });
    } catch (e) {
      // error
    }
  };
  const openPicker = () => {
    const ImagePicker = require('react-native-image-crop-picker');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      compressImageQuality: 0.7,
      mediaType: 'any',
      cropping: false,
    }).then(res => {
      //     //console.log({ res })
      sendPhoto(res);
    });
  };

  const uniqueId = () => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  };

  const sendPhoto = async res => {
    const _id = uniqueId();

    var mess;
    var messLocal;
    if (res.mime === 'image/jpeg') {
      messLocal = [
        {
          _id: _id,
          text: '',
          createdAt: new Date(),
          user: currentUser,
          image: res.path,
          pending: true,
        },
      ];
    } else {
      messLocal = [
        {
          _id: _id,
          text: '',
          createdAt: new Date(),
          user: currentUser,
          video: res.path,
          pending: true,
        },
      ];
    }

    setMessages(GiftedChat.append(messages, messLocal));

    const uid = auth().currentUser.uid;
    var reference = storage().ref(`chat/${uid}/${_id}`);
    await reference.putFile(res.path);
    const path = await storage().ref(`chat/${uid}/${_id}`).getDownloadURL();

    if (res.mime === 'image/jpeg') {
      mess = [
        {
          _id: _id,
          text: '',
          createdAt: new Date(),
          user: currentUser,
          image: path,
        },
      ];
    } else {
      mess = [
        {
          _id: _id,
          text: '',
          createdAt: new Date(),
          user: currentUser,
          video: path,
        },
      ];
    }

    onSendMediaMessage(mess);
  };
  const onSend = (messagesNew = []) => {
    if (reply.isReply) messagesNew[0].reply = reply;
    setReply({replyTo: '', replyMsg: '', isReply: false});

    // sent: true,
    // received: true,
    // pending: true,

    createRoomUpdated(messagesNew);
    (messagesNew[0].pending = true),
      setMessages(GiftedChat.append(messages, messagesNew));
    // answerDemo(messagesNew);
  };

  const renderCustomActions = props => {
    // if (Platform.OS === "ios") {
    //   return <CustomActions {...props} />;
    // }
    const options = {
      'Send Photo/Video': props => {
        openPicker();
      },
      File: props => {
        openDocumentPicker();
      },

      Cancel: () => {},
    };
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '100%',
        }}>
        <TouchableOpacity
          onPress={() => sheetref.current.open()}
          style={{
            width: 42,
            height: 42,
            marginLeft: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: colors.primary,
          }}>
          <Icon name="microphone" size={16} color={'white'} enableRTL={true} />
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {/* <ActionButton handleOnPress={handleOnPress} /> */}
          <Actions
            {...props}
            wrapperStyle={{
              borderRadius: 8,
              borderColor: colors.primary,
              margin: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            iconTextStyle={{
              color: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 0,
            }}
            containerStyle={{borderColor: colors.primary, marginTop: 8}}
            options={options}
          />
        </View>
      </View>
    );
  };

  // const renderSystemMessage = (props) => {
  //   return (
  //     <SystemMessage
  //       {...props}
  //       containerStyle={{
  //         marginBottom: 15,
  //       }}
  //       textStyle={{
  //         fontSize: 14,
  //       }}
  //     />
  //   );
  // };
  const renderLoading = () => {
    return <ActivityIndicator size="large" color={colors.primary} />;
  };

  const [reply, setReply] = useState({
    replyTo: '',
    replyMsg: '',
    isReply: false,
    currentMessage: {},
  });
  const RenderFooter = props => {
    // if (typingText) {
    //   return (
    //     <View style={styles.footerContainer}>
    //       <Text style={styles.footerText}>{typingText}</Text>
    //     </View>
    //   );
    // }
    // return null;

    if (reply.isReply) {
      return (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.primary,
            width: '100%',
            marginTop: -20,
          }}>
          <View
            style={{
              height: '100%',
              width: '1%',
              backgroundColor: 'red',
            }}></View>
          <View style={{flexDirection: 'column', width: '65%'}}>
            <Text
              bold
              style={{
                color: 'red',
                paddingLeft: 10,
                paddingTop: 5,
                fontSize: 18,
              }}>
              {reply.replyTo}
            </Text>
            <Text
              style={{
                color: 'white',
                paddingLeft: 10,
                paddingTop: 5,
                fontSize: 18,
              }}>
              {reply.replyMsg}
            </Text>
          </View>
          <View
            style={{
              width: '15%',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingRight: 10,
              flexDirection: 'row',
            }}>
            {reply.currentMessage.image && (
              <View>
                <Image
                  source={{uri: reply.currentMessage.image}}
                  style={{...styles.styleThumb, borderRadius: 0}}
                  resizeMode="cover"
                />
              </View>
            )}

            {reply.currentMessage.audio && (
              <View>
                <FontAwesome name="file-audio-o" color={'white'} size={40} />
              </View>
            )}
            {reply.currentMessage.vidoe && (
              <View>
                <FontAwesome name="file-video-o" color={'white'} size={40} />
              </View>
            )}
            {reply.currentMessage.file && (
              <View>
                <FontAwesome name="file-text-o" color={'white'} size={40} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              width: '10%',
              height: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
            onPress={() =>
              setReply({
                replyTo: '',
                replyMsg: '',
                isReply: false,
              })
            }>
            <Entypo name="cross" color="red" size={30} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const sendPushNotification = (messagetxt, Participants) => {
    var arr = Participants.filter(peer => peer.uid != currentUser.uid);

    // arr.forEach((peer) => {
    //     firestore().collection("initCall").doc(peer).set({ callRoomID: added.id })
    // })

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      title: 'New Message',
      desc: `${messagetxt}`,
      data: {
        participants: arr,
        allParticipants: Participants,
        sender: currentUser.uid,
        callRoomID: 'added.id',
        callType: 'video',
        roomTitle: currentUser.name,
        groupID: groupID ? groupID : '',
        // "roomImage":  JSON.stringify(roomImage),
        roomImage: Participants.length > 2 ? groupAvatar : currentUser.avatar,
        roomType: roomType,
      },
    });
    // //console.log({ raw: JSON.parse(raw), arr })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://fathomless-fortress-97595.herokuapp.com/PushNotification',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => //console.log(result))
      .catch(error => //console.log('error', error));
  };

  const renderBubble = props => {
    return (
      <Swipeable
        useNativeAnimations={true}
        onSwipeableWillOpen={() => onLeftSwip(props.currentMessage)}
        renderLeftActions={() => <View style={{width: 1}} />}>
        <Bubble
          {...props}
          containerStyle={{}}
          wrapperStyle={{
            left: {borderColor: 'blue', borderWidth: 0, marginBottom: 15},
            right: {backgroundColor: colors.primary, marginBottom: 15},
          }}
          bottomContainerStyle={{
            left: {borderWidth: 0, margin: 0},
            right: {borderWidth: 0, margin: 0},
          }}
          tickStyle={{}}
          usernameStyle={{
            color: colors.primary,
            fontWeight: 'bold',
            margin: 0,
            fontSize: 12,
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
      </Swipeable>
    );
  };

  const onLeftSwip = currentMessage => {
    //console.log({currentMessage});
    Vibration.vibrate(50);
    setReply({
      isReply: true,
      replyMsg: currentMessage.text,
      replyTo: currentMessage.user.userName,
      currentMessage: currentMessage,
    });
  };

  const onPressRight = () => {
    navigation.navigate('GroupCallSocketIO', {
      participants: otherParticipants,
      roomTitle: roomTitle,
      callType: 'audio',
      roomImage: roomImage.uri,
      callerAvatar: currentUser.avatar,
      callerName: currentUser.name,
    });
    dispatch(CallAtions.setCallStateNull());
  };

  const onPressRightSecond = () => {
    {
      navigation.navigate('GroupCallSocketIO', {
        participants: otherParticipants,
        roomTitle: roomTitle,
        callType: 'video',
        roomImage: roomImage.uri,
        callerAvatar: currentUser.avatar,
        callerName: currentUser.name,
      });
      dispatch(CallAtions.setCallStateNull());
    }
  };
  const GroupDetailsPress = () => {
    navigation.navigate('GroupDetails', {
      participants: otherParticipants,
      roomTitle: roomTitle,
      groupID: groupID,
      roomImage: roomImage.uri,
      callerAvatar: currentUser.avatar,
      callerName: currentUser.name,
    });
  };

  const deleteMessageForMe = async currentMessage => {
    const uid = auth().currentUser.uid;
    var roomID;

    if (otherParticipants.length > 2) {
      roomID = groupID;
    } else {
      let otherUser = otherParticipants.filter(data => data.uid != uid);
      roomID = createRoomID(otherUser[0].uid);
    }
    let dbRef2 = firestore()
      .collection('Rooms')
      .doc(uid)
      .collection('Rooms')
      .doc(roomID);
    const dbRef = firestore()
      .collection('Messages')
      .doc(uid)
      .collection('Rooms')
      .doc(roomID)
      .collection('Chats')
      .doc(currentMessage._id);
    await dbRef.delete();

    await dbRef2.update({
      messageText: 'You deleted this message',
      createdAt: new Date(),
    });
  };

  const deleteMessageForEveyOne = currentMessage => {
    const uid = auth().currentUser.uid;
    var roomID;

    if (otherParticipants.length > 2) {
      roomID = groupID;
    } else {
      let otherUser = otherParticipants.filter(data => data.uid != uid);
      roomID = createRoomID(otherUser[0].uid);
    }

    otherParticipants.forEach(async participant => {
      let dbRef2 = firestore()
        .collection('Rooms')
        .doc(participant.uid)
        .collection('Rooms')
        .doc(roomID);
      await dbRef2.update({
        messageText: `${currentUser.name} deleted this message`,
        createdAt: new Date(),
      });
      const dbRef = firestore()
        .collection('Messages')
        .doc(participant.uid)
        .collection('Rooms')
        .doc(roomID)
        .collection('Chats')
        .doc(currentMessage._id);
      await dbRef.delete();
    });
  };
  const deleteMessage = currentMessage => {
    const options = ['Delete For Me', 'Delete For Everyone', 'Cancel'];

    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            deleteMessageForMe(currentMessage);
            break;
          case 1:
            deleteMessageForEveyOne(currentMessage);
            break;

          default:
            break;
        }
      },
    );
  };

  const forwordMessage = currentMessage => {
    navigation.navigate('FarwordMessage', {currentMessage});
  };
  function RenderMessageImage(props) {
    return (
      <View
        style={{
          position: 'relative',
          height: 350,
          width: 250,
          backgroundColor: 'black',
          overflow: 'hidden',
        }}>
        <Lightbox onLongPress={() => onLongPress(null, props.currentMessage)}>
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
        </Lightbox>
      </View>
    );
  }

  function renderCustomView(props) {
    return <CustomView {...props} onLongPress={onLongPress} />;
  }
  const onLongPress = (context, currentMessage) => {
    Vibration.vibrate(10);
    // //console.log({user:currentMessage.user})

    const uid = auth().currentUser.uid;
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
            uid != currentMessage.user._id
              ? deleteMessageForMe(currentMessage)
              : deleteMessage(currentMessage);
            break;
          case 2:
            forwordMessage(currentMessage);
            break;
          default:
            break;
        }
      },
    );
  };
  const onPressLeftSecond = () => {
    navigation.navigate('UserProfile', {
      otherParticipants: otherParticipants,
      roomType: roomType,
      groupID: groupID,
      roomTitle: roomTitle,
      roomImage: roomImage,
    });
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left', 'bottom']}>
      <Header
        roomType={roomType}
        navigation={navigation}
        isCalling={callState.localStream}
        title={t(`${roomTitle}`)}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderLeftSecond={() => {
          return adminGroup ? null : (
            <Image
              source={roomImage}
              style={styles.styleThumb}
              resizeMode="contain"
            />
          );
        }}
        onPressRightThird={() => GroupDetailsPress()}
        renderRightThird={() => {
          return adminGroup ? null : (
            <Icon
              name="info-circle"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRightSecond={() => {
          return adminGroup ? null : (
            <Icon
              name="video"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return adminGroup ? null : (
            <Icon
              name="phone"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeftSecond={onPressLeftSecond}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={onPressRight}
        onPressRightSecond={() => onPressRightSecond()}
      />
      {isLoadingMessages && renderLoading()}
      <RBSheet
        closeOnDragDown={true}
        ref={sheetref}
        onOpen={sendAudio}
        onClose={() => {
          setState(prvState => ({
            recordSecs: '',
            recordTime: '00:00:00',
          }));
        }}
        height={200}
        openDuration={250}
        borderRadius={10}
        customStyles={{
          wrapper: {
            width: '100%',
            alignSelf: 'center',
          },
          container: {
            backgroundColor: '#272727',
            width: '100%',
            alignSelf: 'center',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
          draggableIcon: {
            backgroundColor: 'black',
            borderRadius: 10,
            backgroundColor: '#fff',
          },
        }}>
        <View style={{flex: 1, backgroundColor: '#272727'}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                width: 90,
                height: 90,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                backgroundColor: colors.primary,
              }}>
              <Icon
                name="microphone"
                size={26}
                color={'white'}
                enableRTL={true}
              />
              <Text style={{marginTop: 10}}>{state.recordTime}</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row'}}>
              <Button
                style={{height: 45, margin: 20}}
                onPress={sendAudioToChat}>
                Send
              </Button>
              <Button style={{height: 45, margin: 20}} onPress={onStopRecord}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </RBSheet>
      {useMemo(
        () => (
          <GiftedChat
            messages={messages}
            isAnimated={true}
            showAvatarForEveryMessage={true}
            onSend={onSend}
            onLongPress={onLongPress}
            loadEarlier={loadEarlier}
            // onLoadEarlier={onLoadEarlier}
            // isLoadingEarlier={isLoadingEarlier}
            // user={{
            //   _id: 1, // sent messages should have same user._id
            // }}
            user={currentUser}
            renderActions={renderCustomActions}
            renderBubble={renderBubble}
            // renderSystemMessage={renderSystemMessage}
            renderCustomView={renderCustomView}
            // renderFooter={RenderFooter}
            renderSend={props => <RenderSend {...props} />}
            // messagesContainerStyle={keyboardStatus?{}:{ height: "95%" }}

            renderMessageImage={props => <RenderMessageImage {...props} />}
            renderMessageAudio={props => (
              <RenderMessageAudioFunction {...props} />
            )}
            renderMessageVideo={props => <RenderMessageVideo {...props} />}
            renderAccessory={reply.isReply ? RenderFooter : null}
            keyboardShouldPersistTaps="never"
            // {...platformConf}
            alwaysShowSend
            scrollToBottom
            // showUserAvatar
            renderAvatarOnTop
            renderUsernameOnMessage
            bottomOffset={isIphoneX() ? -1 : -20}
            // onPressAvatar={//console.log}
            renderInputToolbar={props => (
              <RenderInputToolbar
                {...props}
                adminGroup={adminGroup}
                isAdminUser={isAdminUser}
              />
            )}
            renderComposer={props => <RenderComposer {...props} />}
            renderAvatar={props => (
              <RenderAvatar
                {...props}
                func={onPressLeftSecond}
                adminGroup={adminGroup}
              />
            )}
            listViewProps={{
              initialNumToRender: 20,
            }}
          />
        ),
        [messages, currentUser, reply],
      )}
    </SafeAreaView>
  );
};

export default Messages;
