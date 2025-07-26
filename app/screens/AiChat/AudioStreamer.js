import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
// AudioStreamer.js

const AudioStreamer = ({ voiceId, inputText }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
  
    useEffect(() => {
      connectWebSocket();
  
      // Cleanup WebSocket on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }, []);
  
    const connectWebSocket = () => {
      if (!voiceId || !inputText) {
        setError('Please enter both Voice ID and Input Text');
        return;
      }
  
      const ws = new WebSocket(
        `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_flash_v2_5`
      );
  
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        ws.send(inputText); // Send the input text once connected
      };
  
      ws.onmessage = async (event) => {
        try {
          const res = JSON.parse(event.data);
          // //console.log({ res });
          if (res?.audio) {
            await playAudioFromBase64(res.audio);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
  
      ws.onerror = (e) => {
        setError(`WebSocket error: ${e.message}`);
        console.error('WebSocket error:', e.message);
      };
  
      ws.onclose = () => {
        setIsConnected(false);
        //console.log('WebSocket connection closed');
      };
  
      socketRef.current = ws;
    };
  
    // Function to decode Base64 and save as a temporary audio file
    const saveBase64AsAudioFile = async (base64String) => {
      try {
        // Generate a unique file name
        const fileName = `tempAudio_${Date.now()}.mp3`; // Adjust extension based on audio format
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
        // Write the file
        await RNFS.writeFile(filePath, base64String, 'base64');
        //console.log(`Audio file saved to: ${filePath}`);
  
        return filePath;
      } catch (error) {
        console.error('Failed to write audio file', error);
        throw error;
      }
    };
  
    // Function to add the audio file to Track Player's queue
    const playAudioFromBase64 = async (base64String) => {
      try {
        const filePath = await saveBase64AsAudioFile(base64String);
  
        const track = {
          id: filePath, // Unique ID for the track
          url: `file://${filePath}`, // Local file URL
          title: 'Streamed Audio',
          artist: 'Eleven Labs',
          artwork: 'https://example.com/artwork.png', // Optional
        };
  
        await TrackPlayer.add(track);
  
        const currentState = await TrackPlayer.getState();
        if (
          currentState === State.None ||
          currentState === State.Paused ||
          currentState === State.Stopped
        ) {
          await TrackPlayer.play();
        }
  
        // Optional: Remove the track from queue after playback
        TrackPlayer.addEventListener('playback-queue-ended', async () => {
          await TrackPlayer.remove([track.id]);
          // Optionally delete the temporary file
          await deleteFile(filePath);
        });
      } catch (err) {
        console.error('Error playing base64 audio', err);
        Alert.alert('Playback Error', 'An error occurred while playing the audio.');
      }
    };
  
    // Function to delete temporary audio files
    const deleteFile = async (filePath) => {
      try {
        await RNFS.unlink(filePath);
        //console.log(`Deleted file at: ${filePath}`);
      } catch (error) {
        console.error('Failed to delete file', error);
      }
    };
  
    return (
      <View>
        
      </View>
    );
  };
  
  export default AudioStreamer;
  