import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuX88YTzgoUbttm4R5uXPWFSn4D9JhmOw",
  authDomain: "gaming-tournament-625f0.firebaseapp.com",
  projectId: "gaming-tournament-625f0",
  storageBucket: "gaming-tournament-625f0.appspot.com", 
  messagingSenderId: "1024633481136",
  appId: "1:1024633481136:web:fd40d1ea76edd6bef95875"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
