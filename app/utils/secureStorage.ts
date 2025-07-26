import AsyncStorage from '@react-native-async-storage/async-storage';

class SecureStorage {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing item', error);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving item', error);
      return null;
    }
  }
}

export default SecureStorage;