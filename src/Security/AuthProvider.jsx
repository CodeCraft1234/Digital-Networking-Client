import { createContext, useEffect, useState } from "react";
import auth from "../Components/firebase/firebase.config";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
const facebookprovider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setLoading(false);
        return result; // Return the result for further handling if needed
      })
      .catch((error) => {
        setLoading(false);
        throw error; // Re-throw the error for further handling if needed
      });
  };

  const forgetPass = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const facebookSignin = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookprovider);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const githubProvider = new GithubAuthProvider();
  const githubLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);  
  };

  const updateProfiles = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      console.log('current user', currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    googleSignIn,
    signIn,
    updateProfiles,
    logOut,
    githubLogin,
    facebookSignin,
    forgetPass,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
