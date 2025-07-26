 
// import "react-native-gesture-handler";
// import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
// import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
// polyfill();
import { AppRegistry } from "react-native";
import { registerGlobals } from '@livekit/react-native';


import App from "./app/index";
import { BaseSetting } from "./app/config";
// import TrackPlayer from 'react-native-track-player';
// import TrackPlayerService from './TrackPlayerService';

// https://stackoverflow.com/a/78858040/14056591
// import 'text-encoding';

// Needed for TypeScript:

// import 'react-native-get-random-values';
// polyfillReadableStream(global);
// if (typeof(HermesInternal) === "undefined") {
//     //console.log("Hermes is not enabled");
//   } else {
//     //console.log("Hermes is enabled");
//   }
registerGlobals();
AppRegistry.registerComponent(BaseSetting.name, () => App);
// TrackPlayer.registerPlaybackService(() => TrackPlayerService);