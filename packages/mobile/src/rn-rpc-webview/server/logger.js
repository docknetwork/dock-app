
export default {
  name: "logger",
  routes: {
    async log(...params) {
      console.log('====> Webview logger:');
      console.log(...params);
      
      return 'okkkk'
    },
  },
};
