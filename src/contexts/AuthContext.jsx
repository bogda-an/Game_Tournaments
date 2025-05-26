import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setCurrentUser({
          uid: user.uid,
          ...userDoc.data()
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    setCurrentUser({
      uid: userCredential.user.uid,
      ...userDoc.data()
    });
    return userCredential;
  };

  const register = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: username
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "user",
      displayName: username,
      createdAt: new Date().toISOString()
    });

    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentUser,
      isAdmin,
      loading, 
      login, 
      register, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);