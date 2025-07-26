import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { use } from 'i18next';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utilities/axios'
// import {useDoctorAppointmentsRealTime} from '../screens/MyAppointments/useDoctorAppointmentsRealTime';

import moment from 'moment'
// 1) Define the shape of your Firestore data that you want to store in user.firestoreData
interface FirestoreData {
  userType?: string;
  schedule?: any; // Or be more specific if you know the shape
  doctorInfo?: any; // Or be more specific if you know the shape
  // ... add other fields from your Firestore docs if needed
}

// 2) Extend Firebase User to include Firestore data
interface ExtendedUser extends FirebaseAuthTypes.User {
  firestoreData?: FirestoreData;
}

// 3) Define the shape of the Auth context value
interface UserContextType {
  user: ExtendedUser | null;
  loading: boolean;
  updateUserData: (doctorId: string) => Promise<void>;
  submitUserData: (doctorId: string) => Promise<void>;
}

// 4) Create the UserContext
// export const UserContext:any = createContext<UserContextType | undefined>(undefined);
const UserContext = createContext<any>(undefined);
// 5) Define props for your AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
  authToken?: string;
}

export const AuthProvider = ({ children, authToken }: AuthProviderProps) => {

  const [user, setUser] = useState<any>(null);
  // const [subscriptions, Setsubscriptions] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const navigation = useNavigation<any>();

  // Optional: if you want to store or display any authentication errors
  const [error, setError] = useState<string | null>(null);
  

  const updateUserData = async (field: string, value: any) => {
    // //console.log({field, value});
    setUser((prev: any) => {
      return { ...prev, [field]: value };
    });
  };
  const submitUserData = async (user: any) => {
    let currentUserUid = auth().currentUser?.uid ?? '';
    // //console.log({user: user});
    firestore()
      .collection('patients')
      .doc(currentUserUid)
      .set({
        ...user,
        patientId: currentUserUid,
      });
  };
  const updateUserDataFirebase = async (user: any) => {
    let currentUserUid = auth().currentUser?.uid ?? '';
    // //console.log({user: user});
    firestore()
      .collection('patients')
      .doc(currentUserUid)
      .update({
        ...user,
        patientId: currentUserUid,
      });
  };
  const getUserData = async () => {
    setLoading(true);
    let currentUserUid = auth().currentUser?.uid ?? '';

    return new Promise(async (resolve, reject) => {
      try {
        const patientDoc = firestore().collection('patients').doc(currentUserUid).get();
        const userDoc = firestore().collection('users').doc(currentUserUid).get();


        const [patientData, userData] = await Promise.all([patientDoc, userDoc]);

        setLoading(false);
       

        if (patientData.exists || userData.exists) {
          const patientInfo = patientData.exists ? patientData.data() : null;
          const userInfo = userData.exists ? userData.data() : null;
          let subscriptions
          console.log({  patientInfo })
          if (userInfo?.userType === "patient") {

            subscriptions = await getSubcription(currentUserUid, userInfo?.userType)
            console.log({subscriptions})


          } else if (userInfo?.userType === "companyPatient") {
            subscriptions = await getSubcription(userInfo.compnayId, userInfo?.userType)

          }
          let usersInfo = { ...userInfo, ...patientInfo, subscriptions: subscriptions }
          setUser(usersInfo);

          resolve(usersInfo);
        } else {
          setUser(null);
          resolve(null);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error retrieving item', error);
        reject(error);
      }
    });
  };
  async function updateSubcription(currentUserUid:string) {
   
    console.log({ currentUserUid })
    if (!currentUserUid) return
    try {
      const response = await axios.get(`get-subscription/?user_id=${currentUserUid}`);
      // getUserData()
      // console.log({response})



    } catch (error) {
      console.log("Error fetching time:", error);
    }
  }
  const getSubcription = async (docId: string, userType: string) => {
    updateSubcription(docId)
    
    let subscriptions: any = {
      appStatus: null,
      currentDateTime: null,
    }
    const subscriptionsDoc = await firestore().collection('subscriptions').doc(docId).get();
    console.log({ subscriptionsDoc:subscriptionsDoc.exists,docId})
    if (subscriptionsDoc.exists) {
      
      let currentDateTime = new Date();
      let subscriptionsData = subscriptionsDoc.data()
      let appStatus;
      if (subscriptionsData?.status === "canceled") {
        let subscriptionendDate = subscriptionsData?.updatedSubcriptionDetails?.current_period_end
        let diff = getDaysDifference(currentDateTime, subscriptionendDate)
        console.log({ diff })
        if (diff < 1) {
          appStatus = userType === "patient" ? "cancelled" : "companyCancelled"
        } else {
          appStatus = "active"
        }

      } else {
        appStatus = subscriptionsData?.status
      }
      subscriptions = {
        ...subscriptionsData,
        appStatus: appStatus,
        currentDateTime
      }
     
    }
    return subscriptions
  }
  function getDaysDifference(currentDateTime: any, subscriptionEndDate: any) {
    const currentDate = moment(currentDateTime);
    const endDate = moment(subscriptionEndDate, "MM-DD-YYYY"); // Parse in "MM-DD-YYYY" format

    return endDate.diff(currentDate, 'days'); // Get difference in days
  }
  return (
    <UserContext.Provider
      value={{ user, loading, updateUserData, submitUserData, getUserData,updateUserDataFirebase }}>
      {children}
    </UserContext.Provider>
  );
};

// 12) Create a custom hook for easy access to the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
