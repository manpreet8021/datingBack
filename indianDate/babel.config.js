module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      path: '.env',
      moduleName: '@env',
      allowUndefined: false
    }]
  ]
};
