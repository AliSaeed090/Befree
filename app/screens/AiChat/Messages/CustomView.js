 
import React from "react";

import { Text, Image } from "@components";
import VideoPlayer from 'react-native-video-player'
import RenderMessageAudio from "./RenderAudioMessage";

import {
  View,
  Linking,
   
  TouchableOpacity,
   TouchableWithoutFeedback
} from "react-native";
 
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Lightbox from 'react-native-lightbox-v2';

const renderMessageAudio = (audio) => {
  return (
    <RenderMessageAudio audioUrl={audio} />
  )
}
const renderMessageVideo = (video) => {

  return (
    <View style={{ position: 'relative', height: 350, width: 250, backgroundColor: 'black', borderTopLeftRadius: 8, borderTopRightRadius: 8, }}>

      <VideoPlayer
        style={{

          height: 350,
          width: 250,
          borderTopLeftRadius: 8, borderTopRightRadius: 8,
          backgroundColor: 'black'
        }}
        resizeMode="contain"
        video={{ uri: video }}
        videoWidth={1600}
        videoHeight={900}
        thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
      />


    </View>

  );
};

const CustomView = (props) => {
  const { currentMessage , onLongPress} = props;
  const { reply, forward, file, fileName } = currentMessage;
 

  if (reply) {
   
    return (
      <TouchableWithoutFeedback onLongPress={()=>onLongPress( null,currentMessage)} style={{ width: '100%' }}>


        <View style={{ padding: 0 }}>
          <View style={{minWidth: 150, borderRadius: 0 }}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ color: 'red', paddingHorizontal: 10, paddingTop: 0, fontWeight: '700' }}>{reply.replyTo}</Text>
                <Text style={{ color: 'white', paddingHorizontal: 10, paddingTop: 0 }}>{reply.replyMsg}</Text>

                {reply?.currentMessage?.image &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}   >
                    <Image source={{ uri: reply.currentMessage.image }} style={{ width: "100%", height: 100, }} resizeMode="contain" />
                  </View>}

                {reply?.currentMessage?.audio &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >
                    <FontAwesome name="file-audio-o" color={"gray"} size={40} />
                  </View>}
                {reply?.currentMessage?.video &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >
                    <FontAwesome name="file-video-o" color={"gray"} size={40} />
                  </View>}
                {reply?.currentMessage?.file &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >
                    <FontAwesome name="file-text-o" color={"gray"} size={40} />
                  </View>}


              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

    )

  }
  else if (forward) {
    return (
      <TouchableWithoutFeedback onLongPress={()=>onLongPress(null,currentMessage)} style={{ width: '100%' }}>


        <View style={{minWidth: 150, padding: 0 }}>
          <View style={{ borderRadius: 0 }}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ color: 'red', paddingHorizontal: 10, paddingTop: 0, fontWeight: '700' }}>Forwarded</Text>
                <Text style={{ color: 'white', paddingHorizontal: 10, paddingTop: 0 }}>{forward.text}</Text>

                {forward?.image &&
                  <View style={{ position: 'relative', height: 350, width: 250, backgroundColor: 'black', overflow: "hidden" }}>
                    <Lightbox >
                      <View style={{ position: 'relative', backgroundColor: 'black' }}>
                        <Image
                          resizeMode='cover'
                          style={{ height: "100%", width: "100%", borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                          source={{ uri: forward?.image }}
                        />
                      </View>
                    </Lightbox>
                  </View>}

                {forward?.audio &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >
                    {renderMessageAudio(forward.audio)}

                  </View>}
                {forward?.video &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >

                    {renderMessageVideo(forward.video)}

                  </View>}
                {forward?.file &&
                  <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}    >
                    <FontAwesome name="file-text-o" color={"white"} size={40} />
                  </View>}


              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  else if (file) {

    return (
      <TouchableOpacity onLongPress={()=>onLongPress(null,currentMessage)} onPress={()=>Linking.openURL(file)} style={{ width: '100%' }}>




        <View style={{ flexDirection: 'row',   alignItems:'center',   width: 300, padding: 10 }}>



          {file &&
            <View style={{ width: "20%",  }}    >
              <FontAwesome name="file-text-o" color={"gray"} size={40} />
            </View>}
          {fileName &&
            <Text style={{ color: 'red', fontSize:18, fontWeight: '700'  }}>{fileName}</Text>
          }
        </View>



      </TouchableOpacity>

    )
  }
  return null;
};

 
export default CustomView;
