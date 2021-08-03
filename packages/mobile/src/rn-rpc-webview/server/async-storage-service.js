import AsyncStorage from '@react-native-community/async-storage';

export default {
  name: "storage",
  routes: {
    async getItem(...params) {
      console.log('Getting storage item with params', params);

      const result = await AsyncStorage.getItem(...params);

      console.log('Getting storage item result', result);

      return result;
    },
    async setItem(...params) {
      console.log('Set storage item', {
        params,
      });

      const result = AsyncStorage.setItem(...params);

      AsyncStorage.getItem(params[0]).then(value => console.log('Storage udpated', JSON.parse(value)));
      
      return result;
    },
  },
};
