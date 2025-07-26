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
  Platform,
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
import {useAskQuery, useChats} from './hooks/useAskQuery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
// Your component
import * as RNLocalize from 'react-native-localize';
import {useDispatch, useSelector} from 'react-redux';
let currentSound: Sound | null = null;
let played=false
const VoiceInputModal = ({isVisible, onClose, onSubmit}: any) => {
  const {language} = useSelector((state: any) => state.application);

  const {mutateAsync, isPending, isError, data, error} = useAskQuery();
  const [emergency_contact_no, setEmergency_contact_no] = useState('');
  const [userName, setUserName] = useState('');
  const emergency_contact_noRef: any = useRef(null);
  emergency_contact_noRef.current = emergency_contact_no;
  const userNameRef: any = useRef(null);
  userNameRef.current = userName;
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const {t} = useTranslation();
  const [languageCode, setLanguageCode] = useState('');
  const languageCodeRef: any = useRef(null);
  languageCodeRef.current = languageCode;
  useEffect(() => {
    // Initialize TTS
    //console.log({language});

    if (language === 'es') {
      Tts.setDefaultLanguage('es-CO');
      setLanguageCode('es-CO');
    } else {
      Tts.setDefaultLanguage('en-US');
      setLanguageCode('en-US');
    }

    // Set up event listeners
    Tts.addEventListener('tts-start', event => {
      //console.log('TTS started:', event);
      setIsSpeaking(true);
    });

    Tts.addEventListener('tts-finish', event => {
      //console.log('TTS finished:', event);
      setIsSpeaking(false);
    });

    Tts.addEventListener('tts-cancel', event => {
      //console.log('TTS cancelled:', event);
      setIsSpeaking(false);
    });

    Tts.addEventListener('tts-error', error => {
      //console.log('TTS error:', error);
      setIsSpeaking(false);
    });

    // Cleanup
    return () => {
      Tts.removeAllListeners('');
    };
  }, [language]);
  const onSpeechStart = (e: any) => {
    //console.log('onSpeechStart: ', e);
  };

  const onSpeechResults = (e: any) => {
    //console.log('onSpeechResults: ', e);
  };
  const getProfile = async () => {
    try {
      let profile: any = await AsyncStorage.getItem('userData');

      if (profile) {
        profile = JSON.parse(profile);
        // //console.log({phoneNumber:profile.phoneNumber, name:profile.name});
        setEmergency_contact_no(profile.phoneNumber);
        setUserName(profile.name);
      }
    } catch (error) {
      console.error('Error retrieving item', error);
    }
  };
  const handleStartRecognition = async () => {
    try {
      //console.log({languageCode: languageCodeRef.current});
      setIsRecording(true);
      let text = '';
      if (languageCodeRef.current === 'es-CO') {
        text = await SpeechToText.startListening('es-CO');
      } else {
        Tts.setDefaultLanguage('en-US');
        text = await SpeechToText.startListening('en-US');
      }

      //console.log('Recognized text:', text);
      sendToLLM(text);
    } catch (error) {
      setIsRecording(false);
      console.error('Speech recognition failed:', error);
    }
  };
  const onSpeechError = (e: any) => {
    //console.log('onSpeechError: ', e);
  };
  async function getSpeechRecognitionServices() {
    try {
      const services = await Voice.getSpeechRecognitionServices();
      //console.log('Speech Recognition Services:', services);
    } catch (error) {
      console.error('Error getting speech recognition services:', error);
    }
  }

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  const startRecording = async () => {
    try {
      await Tts.stop();
      stopAudio()
      // connectWebSocket()
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        //console.log('No permission for audio recording');
        return;
      }

      handleStartRecognition();
    } catch (error) {
      console.error(error);
    }
    try {
    } catch (error) {
      console.error('Error starting voice:', error);
      setIsRecording(false);
    }
  };

  // Stop recording user speech
  const stopRecording = async () => {
    try {
      await Voice.stop();
      await Tts.stop();
      stopAudio()
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  };

  // Send user transcription to GPT LLM
  const sendToLLM = async (text: string) => {
    // Tts.speak(text);
    // setIsRecording(false);
    setLoading(true);
    try {
      let message = {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: {
          _id: auth().currentUser?.uid ?? '',
          name: '',
          avatar: '',
        },
      };
      onSubmit(message);
      mutateAsync({
        ...message,
        user_id: message.user._id,
        emergency_contact_no: emergency_contact_noRef.current,
        user_name: userNameRef.current,
        // user_id: message.user._id,
      }).then(async (res: any) => {
        //console.log({res: res.data});
        // Tts.speak(res.data.text);
        try {
          // const audio = await getSpeechAudioFromElevenLabs(res.data.text);
          // //console.log({audio});
         

          // start(res.data.text)
          
          await speak(res.data.text);
        } catch (e) {
          //console.log({e});
        }
        
        onSubmit(res.data);
      });
    } catch (error) {
      setLoading(false);
      console.error('Error with LLM request:', error);
      return 'There was an error processing your request.';
    }
  };
  const handleSubmit = () => {
    // start(inputText);
    // return
    stopRecording();
    stopAudio()
    onClose();
    // onSubmit();
  };
  const ELEVEN_LABS_API_KEY =
    'sk_b16b8b8345f585df63041843bbbeab7015c37d058b4bf980';
  const VOICE_ID = 'x5IDPSl4ZUbhosMmVFTk';
 
  async function getSpeechAudioFromElevenLabs(text: string) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json',
            // Optional: 'Accept': 'audio/mpeg' if you want to confirm MP3
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.75, // or your preferred stability
              similarity_boost: 0.75, // or your preferred similarity
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      //console.log({response});
      // The TTS endpoint responds with an MP3 audio stream. We can get it as a Blob:
      const blob = await response.blob();
      //console.log({blob});
      return blob;
    } catch (error) {
      console.error('Error fetching Eleven Labs TTS:', error);
      return null;
    }
  }
  function stopAudio() {
    if (currentSound) {
      setIsSpeaking(false);
      currentSound.stop(() => {
        currentSound?.release();
        currentSound = null;
      });
    }
  }
  async function playAudio(blob: any) {
    //console.log("playAudio")
    setIsRecording(false);
    setIsSpeaking(true);
    try {
      // 1. Convert Blob to a path in the device’s file system
      const path = `${RNFetchBlob.fs.dirs.CacheDir}/ttsAudio.mp3`;
      const base64Data: any = await blobToBase64(blob);

      // Write the base64 data to an MP3 file
      await RNFetchBlob.fs.writeFile(path, base64Data, 'base64');

      // 2. Initialize the Sound instance with the local file
      currentSound= new Sound(path, '', error => {
        if (error) {
          //console.log('Failed to load the sound', error);
          return;
        }
        // 3. Play
        currentSound?.play(success => {
          if (!success) {
            //console.log('Sound did not play successfully');
          }
          // Release the audio player resource
          currentSound?.release();
          setIsSpeaking(false);
          
        });
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  // Utility to convert Blob to Base64
  async function blobToBase64(blob: any) {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Putting it all together
  async function speak(text: string) {
    //console.log({text});
    const blob = await getSpeechAudioFromElevenLabs(text);
    if (blob) {
      playAudio(blob);
    }
  }
  const [chuckQueue, setChuckQueue] = useState<any>([]);
  const chunkQueueRef = useRef<any>([]);
  chunkQueueRef.current=chuckQueue
  const isPlaying = useRef<any>(false);

  const [voiceId, setVoiceId] = useState('UgBBYS2sOqTuMpoF3BR0');
  const [inputText, setInputText] = useState<any>('');
  const [isConnected, setIsConnected] = useState(false);
  const [response, setResponse] = useState('');
  const [errors, setError] = useState<any>("");
  const [socket, setSocket] = useState<any>(null);
  useEffect(() => {
    // connectWebSocket()
    // Cleanup WebSocket on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    if (!voiceId) {
      setError('Please enter both Voice ID and Input Text');
      return;
    }

    const ws = new WebSocket(
      `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_multilingual_v2`
    );

    ws.onopen = () => {
      //console.log("WebSocket connection opened");
      setIsConnected(true);
      setError(null);
      // ws.send(inputText); // Send the input text once connected
    };
    // let isPlaying = false;
    ws.onmessage = (event) => {
     
      let res = JSON.parse(event.data);
      // //console.log( {res});
      if(res?.audio){
        // isPlaying=true
       
        playAudioFromBase64(res?.audio);
      }
      // setResponse((prev) => `${prev}${event.data}`);
    };

    ws.onerror = (e) => {
      setError(`WebSocket error: ${e.message}`);
    };

    ws.onclose = () => {
      //console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    setSocket(ws);
  };
const play=()=>{
  
 
  
 
 if (isPlaying.current===true){
   return
 }
 let newFilePath = chunkQueueRef.current.shift()
 isPlaying.current=true
  const sound = new Sound(newFilePath, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load the sound', error);
      return;
    }
    
    // 3. Play
    sound.play((success) => {
      if (success) {
        //console.log('successfully finished playing');
        isPlaying.current=false
        // const newFilePath = chunkQueueRef.current.shift()
        //console.log({newFilePath, arr:chunkQueueRef.current})
        if (chunkQueueRef.current.length>0){
          // play()
        }
       
        // console.error('Playback failed due to audio decoding errors');
      }
      // Release when done so the OS can reclaim resources
      sound.release();
    });
  });
}

useEffect(()=>{
  
   
  if (chunkQueueRef.current.length==1 && played===false) {
    played=true
    play()
  }
},[chunkQueueRef.current])
  async function playAudioFromBase64(base64Audio:any) {
    // //console.log({base64Audio})
    
    try {
      // 1. Decode & write the file
      const audioFilePath = await saveBase64AsAudioFile(base64Audio);
      let arr = [...chunkQueueRef.current]
      arr.push(audioFilePath)
      setChuckQueue(arr)
      // //console.log({audioFilePath:chunkQueueRef.current})
     
      // play(audioFilePath)
      // 2. Create a Sound instance
    
    } catch (err) {
      console.error('Error playing base64 audio', err);
    }
  }
  const generateUniqueFilePath = (extension = 'm4a') => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNumber = Math.floor(Math.random() * 1000000); // Random number between 0 and 999,999
    const fileName = `tempAudio_${timestamp}_${randomNumber}.${extension}`; // e.g., tempAudio_1617181920_123456.m4a
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    return filePath;
  };
  async function saveBase64AsAudioFile(base64String:any) {
    try {
      // Choose a path and file name (adjust extension if needed).
      // For example, storing in the app's DocumentDirectory:
      // const filePath = `${RNFS.DocumentDirectoryPath}/tempAudio.m4a`;
      const filePath = generateUniqueFilePath("m4a");
  
      // Write the file
      await RNFS.writeFile(filePath, base64String, 'base64');
      // //console.log(`Audio file saved to: ${filePath}`);
  
      return filePath;
    } catch (error) {
      console.error('Failed to write audio file', error);
      throw error;
    }
  }
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };
  const start=(text:string)=>{
    // setInputText("hi how are you doing, how are you doing, hello how are you doing")
     socket?.send(JSON.stringify({  
      "text": text,
      "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
      "xi_api_key": "sk_21d64161961c802030f70f75d6410a03469d077ad042c6da",
     }));
     socket?.send(JSON.stringify({  
      "text": "",
      "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
      "xi_api_key": "sk_21d64161961c802030f70f75d6410a03469d077ad042c6da",
     }));
  }
 
  
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
              isListening={isRecording || isPending}
              isSpeaking={isSpeaking}
            />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={{...styles.controlButton, backgroundColor: '#F43F5E'}}
              onPress={handleSubmit}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.micButton,
                (isRecording || isPending) && styles.micButtonActive,
              ]}
              onPress={
                isRecording || isPending ? stopRecording : startRecording
              }>
              <Icon
                name={isRecording || isPending ? 'mic-off' : 'mic'}
                size={45}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{...styles.controlButton, backgroundColor: '#1E64FA'}}
              onPress={handleSubmit}>
              <Icon name="checkmark" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    justifyContent: 'space-between',
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
