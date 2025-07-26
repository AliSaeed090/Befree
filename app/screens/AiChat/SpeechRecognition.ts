// src/NativeSpeechToText.ts
import { NativeModules } from 'react-native';

const { SpeechToText } = NativeModules;

export default {
  startListening: (locale: string = 'en-US'): Promise<string> => {
    return SpeechToText.startListening(locale);
  }
};