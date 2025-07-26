import { useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface SignInPayload {
  email: string;
  password: string;
}

const signInUser = async ({ email, password }: SignInPayload) => {
  // Sign in user with Firebase Auth
  const userCredential = await auth().signInWithEmailAndPassword(email, password);

  // Get user info from Firestore
  const user = userCredential.user;
  if (user) {
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    //console.log({ userDoc: userDoc.data() });
    return userDoc.data();
  }
};

const forgotPassword = async (email: string) => {
  // Send password reset email
  await auth().sendPasswordResetEmail(email);
  //console.log('Password reset email sent');
};

// Hook for signing in
export const useSignIn = () => {
  return useMutation({
    mutationFn: (data: SignInPayload) => signInUser(data),
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};
