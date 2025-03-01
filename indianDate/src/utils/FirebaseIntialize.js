import { initializeApp, getApps } from '@react-native-firebase/app';
import { API_KEY, API_PROJECT_ID, APP_ID, MESSAGING_SENDER_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  projectId: API_PROJECT_ID,
  appId: APP_ID,
  messagingSenderId: MESSAGING_SENDER_ID
};

let firebaseApp;

if(getApps().length === 0) {
  try {
    firebaseApp = initializeApp(firebaseConfig)
    console.log("success", firebaseApp)
  } catch(error) {
    console.error("Firebase initialization error:", error);
  }
}else {
  firebaseApp = getApps()[0];
}

export default firebaseApp;
