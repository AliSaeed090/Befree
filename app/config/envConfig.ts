import Config from 'react-native-config';
import { Platform } from 'react-native';
// //console.log({Config})
interface EnvironmentConfig {
  apiKey: string;
  projectId: string;
  versionId: string;
  apiBaseUrl: string;
}

class EnvironmentManager {
  static getConfig(): EnvironmentConfig {
    return {
      apiKey: Config.VOICEFLOW_API_KEY,
      projectId: Config.VOICEFLOW_PROJECT_ID,
      versionId: Config.VOICEFLOW_VERSION_ID,
      apiBaseUrl: Config.API_BASE_URL
    };
  }

  static isDevelopment(): boolean {
    return __DEV__ || Platform.OS === 'android';
  }

  static isProduction(): boolean {
    return !this.isDevelopment();
  }
}

export default EnvironmentManager;