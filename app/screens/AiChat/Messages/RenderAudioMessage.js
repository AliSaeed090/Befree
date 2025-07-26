
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, TouchableOpacity, } from "react-native";
import { useTheme } from "@config";
import {AudioPlayer}   from '../../CustomeModule/react-native-simple-audio-player/src/AudioPlayer/AudioPlayer';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Slider from '@react-native-community/slider';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
var currentPositionSec;

const RenderMessageAudio = ({ audioUrl }) => {
  const [audioRecorderPlayer, setAudioRecorderPlayer] = useState(new AudioRecorderPlayer())
  const [val, setval] = useState(0);
  const [max, setmax] = useState(0);

  const { colors } = useTheme();
  const onStartPlay = async (url) => {

  //   //console.log('onStartPlay', { url });
    const msg = await audioRecorderPlayer.startPlayer(url);

    audioRecorderPlayer.addPlayBackListener((e) => {
      currentPositionSec = e.currentPosition
      currentDurationSec = e.duration
      playTime = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))
      duration = audioRecorderPlayer.mmssss(Math.floor(e.duration))
     
      setmax(currentDurationSec)
      setval(currentPositionSec)



    });
  };


  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    //console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };


  return (
    <View
      style={{
        
        backgroundColor: '#313131',
        justifyContent: 'center',
      }}>
      <AudioPlayer
        url={ audioUrl}
      />
    </View>
    // <View
    //   style={{

    //     height: 60,
    //     width: 250,
    //     backgroundColor: colors.primary,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-end',
    //     alignItems: 'flex-end'
    //   }}>
    //   <TouchableOpacity onPress={() => onStartPlay(audioUrl)} style={{ width: '10%', height: 60,justifyContent:'center' }}>
    //     <FontAwesome name="play" color='white' size={20} />
    //   </TouchableOpacity>
    // <View  style={{ width: '80%', height: 60,justifyContent:'center' }}>
    //   <Slider
    //     disabled={true}
    //     value={val}
    //     style={{ width: '100%', margin:0, padding:0}}
    //     minimumValue={0}
    //     maximumValue={max}
    //     minimumTrackTintColor="#FFFFFF"
    //     maximumTrackTintColor="#000000"
    //   />
    //   </View>
    // </View>

  );
};
export default RenderMessageAudio;
