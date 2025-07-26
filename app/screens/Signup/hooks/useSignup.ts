// src/hooks/useSignup.ts
import { useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import  firestore  from '@react-native-firebase/firestore';
interface SignupPayload {
  email: string;
  password: string;
  name: string;
  userType: string;
}

const signupUser = async ({ email, password, name, userType }: SignupPayload) => {
  // Sign up user with Firebase Auth
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);

  // Add additional user info to Firestore
  const user = userCredential.user;
  if (user) {
    auth()
    await firestore().collection('users').doc(user.uid).set({
      email,
      name,
      userType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userApplicationRoles:0
    });
    await user.sendEmailVerification();
  }
};

// export const useSignup = () => {
//   return useMutation(signupUser);
// };
export const useSignup = () => {
    return useMutation({
      mutationFn: (data: SignupPayload) => signupUser(data),
    });
  };