// VoiceInputModal.js
import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  PermissionsAndroid,
  ListRenderItem,
  FlatList,
  Alert,
} from 'react-native';
import {BaseSetting} from '../../config';
import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import SpeechToText from './SpeechRecognition';
import auth from '@react-native-firebase/auth';
import AIPulseAnimation from './AIPulseAnimation';
import Tts from 'react-native-tts';
import {useAskQuery, useChats, useJoinRoom} from './hooks/useAskQuery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';

import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from '@livekit/react-native';
import {Track} from 'livekit-client';
// Your component
import * as RNLocalize from 'react-native-localize';
import {useDispatch, useSelector} from 'react-redux';
let currentSound: Sound | null = null;
let played = false;
 
const VoiceInputModal = ({isVisible, onClose, onSubmit}: any) => {
  const {language} = useSelector((state: any) => state.application);
  const { mutateAsync: joinRoom, isPending, error:joinRoomError } = useJoinRoom();
  // const {mutateAsync, isPending, isError, data, error} = useAskQuery();
  const [emergency_contact_no, setEmergency_contact_no] = useState('');
  const [userName, setUserName] = useState('');
  const emergency_contact_noRef: any = useRef(null);
  emergency_contact_noRef.current = emergency_contact_no;
  const userNameRef: any = useRef(null);
  const [dataLivekit, setDataLivekit] = useState({
    "user_id": " ",
    "token": null,
    "livekit_url": ""
  
  });
  userNameRef.current = userName;
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    joinRoom({
      user_name:  userNameRef.current,
      user_id:  auth().currentUser?.uid ?? '',
      room_name:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    }).then((res: any) => {
      //console.log({res:res});
     
      let start = async () => { 
        await AudioSession.startAudioSession();
      };
      start();
      setDataLivekit(res)
    })
   

   
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  useEffect(() => {
    const uid = auth().currentUser?.uid ?? '';
    let subcribeRoomEvents = firestore()
      .collection('conversations')
      .doc(uid)
      .onSnapshot((snapshot: any) => {
        //console.log({snapshot});
        const data = snapshot.data();
        if (data?.event === 'user_started_speaking') {
          setIsSpeaking(false);
          setIsRecording(true);
        } else if (data?.event === 'user_stopped_speaking') {
          setIsSpeaking(false);
          setIsRecording(false);
        
        } else if (data?.event === 'agent_started_speaking') {
          setIsSpeaking(true);
          setIsRecording(false);

        } else if (data?.event === 'agent_stopped_speaking') {
          setIsSpeaking(false);
          setIsRecording(false);

        }   else if (data?.event === 'agent_speech_interrupted') {
          
          setIsSpeaking(false);
          setIsRecording(true);
        }
        //console.log({data});
      });

    return () => {
      subcribeRoomEvents();
    };
  }, []);
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent={true}
      transparent={false}
      visible={isVisible}
      hardwareAccelerated={true}
      style={styles.modalContainer}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('Speak_to_Ai')}</Text>

          <View
            style={{
              width: '100%',
              height: 500,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AIPulseAnimation
              isListening={isRecording}
              isSpeaking={isSpeaking}
            />
          </View>
         {dataLivekit.token&& <LiveKitRoom
              serverUrl={dataLivekit.livekit_url}
              token={dataLivekit.token}
              connect={true}
              options={{
                // Use screen pixel density to handle screens with differing densities.
                adaptiveStream: {pixelDensity: 'screen'},
              }}
              audio={true}
              video={false}>
              <RoomView />
            </LiveKitRoom>}
          <View style={styles.controls}>
            <TouchableOpacity
              style={{...styles.controlButton, backgroundColor: '#F43F5E'}}
              onPress={() => onClose()}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
           
            {/* <TouchableOpacity
              style={[
                styles.micButton,
                (isRecording || isPending) && styles.micButtonActive,
              ]}
              onPress={() => Alert.alert('Voice Input')}>
              <Icon
                name={isRecording || isPending ? 'mic-off' : 'mic'}
                size={45}
                color="white"
              />
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={{...styles.controlButton, backgroundColor: '#1E64FA'}}
              onPress={() => Alert.alert('Voice Input')}>
              <Icon name="checkmark" size={24} color="#fff" />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RoomView = () => {
  // Get all camera tracks.
  const tracks = useTracks([Track.Source.Microphone]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }: any) => {
    // Render using the VideoTrack component.
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList data={tracks} renderItem={renderTrack} />
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // height: Dimensions.get('window').height,
    // width: Dimensions.get('window').width,
    backgroundColor: '#0F172A',
    // bottom: 0,
    // position: 'absolute',
    // zIndex: 100,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  participantView: {
    // height: 300,
    // width: 300,
    // borderColor: 'red',
  },
  modalContent: {
    flex: 1,

    // justifyContent: 'space-between',
    // backgroundColor: 'red',
    // padding: 20,
    // paddingBottom: 50,
  },
  title: {
    fontSize: 24,

    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 90,
  },
  voiceVisualization: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    gap: 4,
  },
  visualBar: {
    width: 4,
    backgroundColor: '#454545',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#334155',
    minHeight: 128,
    // paddingHorizontal: 5,
    // padding: 2,
    paddingVertical: 20,

    // alignItems: 'center',
    // marginTop:25
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -120,
  },
  micButtonActive: {
    backgroundColor: '#475569',
    borderColor: '#fff',
    borderWidth: 2,
  },
  readyText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

export default VoiceInputModal;
