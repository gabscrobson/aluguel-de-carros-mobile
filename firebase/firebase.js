import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDiAyhnFeS4pOsK-NC-5Mcpwz2gMBFJsoI',
  authDomain: 'lasallerj-242-carros.firebaseapp.com',
  databaseURL: 'https://lasallerj-242-carros-default-rtdb.firebaseio.com',
  projectId: 'lasallerj-242-carros',
  storageBucket: 'lasallerj-242-carros.appspot.com',
  messagingSenderId: '654281714411',
  appId: '1:654281714411:web:94f257c6b3858157c6acae',
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const database = getDatabase(app)

export { app, auth, database }
