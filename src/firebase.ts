import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { firestoreDefaultConverter } from 'vuefire'
import { globalFirestoreOptions } from 'vuefire'
import firebaseConfig from './firebaseConfig'

export const firebaseApp = initializeApp({
  apiKey: firebaseConfig.API_KEY,
  authDomain: firebaseConfig.AUTH_DOMAIN,
  projectId: firebaseConfig.PROJECT_ID,
  storageBucket: firebaseConfig.STORAGE_BUCKET,
  messagingSenderId: firebaseConfig.MESSAGING_SENDER_ID,
  appId: firebaseConfig.APP_ID
})
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(firebaseConfig.RECAPTCHA_KEY)
})

export const db = getFirestore(firebaseApp)

export const songsRef = collection(db, 'songs')
export const setsRef = collection(db, 'setlists')

globalFirestoreOptions.converter = {
  // the default converter just returns the data: (data) => data
  toFirestore: firestoreDefaultConverter.toFirestore,
  fromFirestore: (snapshot, options) => {
    const data = firestoreDefaultConverter.fromFirestore(snapshot, options)
    // if the document doesn't exist, return null
    if (!data) return null
    // add anything custom to the returned object
    data.metadata = snapshot.metadata
    data.doc_id = snapshot.id
    return data
  },
}
