declare module 'react-native-config' {
    interface NativeConfig {
      VOICEFLOW_API_KEY: string;
      VOICEFLOW_PROJECT_ID: string;
      VOICEFLOW_VERSION_ID: string;
      API_BASE_URL: string;
    }
    const Config: NativeConfig;
    export default Config;
  }