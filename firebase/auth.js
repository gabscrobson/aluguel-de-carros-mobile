import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

export async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export const signout = () => {
  return auth.signOut()
}
