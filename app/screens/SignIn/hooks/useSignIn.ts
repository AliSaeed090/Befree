// src/hooks/useSignup.ts
import { useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import  firestore  from '@react-native-firebase/firestore';
interface SignInPayload {
  email: string;
  password: string;
  
}

const signInUser = async ({ email, password}: SignInPayload) => {
  // Sign up user with Firebase Auth
  const userCredential = await auth().signInWithEmailAndPassword(email, password);

  // Add additional user info to Firestore
  const user = userCredential.user;
  if (user) {
   const userDoc= await firestore().collection('users').doc(user.uid).get();
   //console.log({userDoc:userDoc.data()})
   return userDoc.data()
  }
};

// export const useSignup = () => {
//   return useMutation(signupUser);
// };
export const useSignIn = () => {
    return useMutation({
      mutationFn: (data: SignInPayload) => signInUser(data),
    });
  };