import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Button, ScrollView, Text } from "react-native";
import Sound from "react-native-sound";
import RNFetchBlob from "rn-fetch-blob";

Sound.setCategory("Playback"); // On iOS, ensures audio plays even in silent mode

let currentSound = null;
let isPlaying=false
const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("hi");
  const [ws, setWs] = useState(null);

  // Queue for incoming audio chunks
  const chunkQueueRef = useRef([]);
  // Track if we’re currently playing a chunk
  // const [isPlaying, setIsPlaying] = useState(false);

  // -----------------------------
  // 1) Establish WebSocket
  // -----------------------------
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.178.118:8080/api/ws/ask-query");

    socket.onopen = () => {
      //console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        // If we got an audio chunk:
        // //console.log({response:response})
        if (response.audio_base64) {
          chunkQueueRef.current.push(response.audio_base64);
          // Attempt to play if not already playing
          playNextChunk();
        } else if (response.text) {
          // Possibly handle text responses or partial text
          //console.log("Received text:", response.text);
          setMessages((prev) => [...prev, { sender: "AI", text: response.text }]);
        } else if (response.error) {
          //console.log("Received error from server:", response.error);
        } else {
          //console.log("Received unknown message type:", response);
        }
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onclose = (event) => {
      //console.log("WebSocket disconnected, code:", event.code, "reason:", event.reason);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // -----------------------------
  // 2) Send user text
  // -----------------------------
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        user_id: "123456789",
        emergency_contact_no: "+923132532906",
        user_name: "Ali",
        text: input,
      };
      setMessages((prev) => [...prev, { sender: "You", text: input }]);
      ws.send(JSON.stringify(message));
      setInput("");
    } else {
      console.error("WebSocket not connected or not open.");
    }
  };

  // -----------------------------
  // 3) Play queue logic
  // -----------------------------
  const playNextChunk = async () => {
    //console.log({isPlaying:currentSound?.isPlaying})
   
    // If already playing something, do nothing now
    if (isPlaying || currentSound?.isPlaying) return;
    isPlaying=true

    // If the queue is empty, do nothing
    if (chunkQueueRef.current.length === 0) return;

    // Otherwise, we have something to play
    // setIsPlaying(true);
    isPlaying=true
    const base64Data = chunkQueueRef.current.shift(); // Remove the first chunk from the queue

    // Convert base64 to a local file & play
    await playAudioChunk(base64Data);
    // isPlaying=false

    // When finished playing, set isPlaying = false
    // setIsPlaying(false);
    // isPlaying=false

    // Then check if there’s more to play
    if (chunkQueueRef.current.length > 0) {
      playNextChunk();
    }
  };

  // Helper to play one chunk
  const playAudioChunk = async (base64Data) => {
    if (!base64Data || base64Data.length < 50) {
      //console.log("Skipping empty or invalid chunk.");
      return;
    }

    // const path = `${RNFetchBlob.fs.dirs.CacheDir}/ttsChunk_${Date.now().toString()}.mp3`;
    const path = `${RNFetchBlob.fs.dirs.CacheDir}/${Math.random().toString(36).substring(7)}.mp3`;
    // const path = `${RNFetchBlob.fs.dirs.CacheDir}/ttsAudio.mp3`;

    //console.log({path})
    try {
      // Write base64 to an MP3 file
      await RNFetchBlob.fs.writeFile(path, base64Data, "base64");

      // Stop and release the previous chunk, just in case
      stopAudio();

      return new Promise((resolve) => {
        currentSound = new Sound(path, "", (error) => {
          if (error) {
            //console.log("Failed to load sound:", error);
            currentSound = null;
            resolve(false);
            return;
          }
          // Play
          currentSound.play((success) => {
            if (!success) {
              //console.log("Sound did not play successfully");
            }
            // currentSound.stop(() => {
            //   //console.log("Sound stopped");
            //   // isPlaying=false
            // });
            // currentSound.release();
          
             
            currentSound = null;
            resolve(true);
          });
        });
        
      });
    } catch (err) {
      console.error("Error playing audio chunk:", err);
    }
  };
  function playAudio(base64Data) {
    if (!base64Data) {
      //console.log("No base64 data. Skipping audio playback.");
      return;
    }
    const path = `${RNFetchBlob.fs.dirs.CacheDir}/someFile_${Date.now()}.mp3`;
  
    RNFetchBlob.fs.writeFile(path, base64Data, 'base64')
      .then(async () => {
        // Optional: check file size
        const stat = await RNFetchBlob.fs.stat(path);
        //console.log('Wrote MP3 file:', path, 'Size:', stat.size);
  
        currentSound = new Sound(path, '', (error) => {
          if (error) {
            //console.log('Failed to load the sound:', error);  // <-- crucial
            currentSound = null;
            return;
          }
          //console.log('Sound loaded successfully, playing now...');
          currentSound.play((success) => {
            if (!success) {
              //console.log('Sound did not play successfully');
            }
            isPlaying=false
            // playNextChunk();
            currentSound.release();
            currentSound = null;
          });
        });
      })
      .catch((err) => {
        console.error("Error writing or stat'ing the MP3:", err);
      });
  }
  // -----------------------------
  // 4) Stop audio
  // -----------------------------
  const stopAudio = () => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound.release();
        currentSound = null;
      });
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <Text key={index} style={{ marginVertical: 4, color: "#fff" }}>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>{msg.sender}: </Text>
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#fff",
          padding: 8,
          marginBottom: 8,
          borderRadius: 4,
          color: "#fff",
        }}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
        placeholderTextColor="#999"
      />
      <Button title="Send" onPress={sendMessage} />
      <Button title="Stop Audio" onPress={stopAudio} color="red" />
    </View>
  );
};

export default ChatScreen;
