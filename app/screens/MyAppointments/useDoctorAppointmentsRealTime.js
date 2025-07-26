import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment'; // Install via npm install moment
import {useUser} from '../../contexts/User';

/**
 * Listen to all appointments for the given doctorId in real time.
 * For each appointment, also fetch doctor profile data from `doctors` collection.
 * Filters:
 *  - Only appointments for the current patient.
 *  - Only appointments with a date between the period start and period end.
 *  - Only appointments with status "pending" or "accepted".
 */
export function useDoctorAppointmentsRealTime() {
  const patientId = auth().currentUser?.uid ?? "";
  const {user: userData} = useUser();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    // -----------------------------------------------------------------------------
    // Define the period boundaries.
    // -----------------------------------------------------------------------------
    // Provided strings:
    //   current_period_start: "02/01/2025" in "MM/DD/YYYY" format.
    //   current_period_end: "01-02-2025" in "DD-MM-YYYY" format.
    //
    // Adjust the parsing formats below if you meant a different range.
    // For example, if you intended the start date to be January 2, 2025,
    // you might change the parsing format for the start date to "DD/MM/YYYY".
    // -----------------------------------------------------------------------------
    const  periodEnd= moment(userData?.subscriptions?.updatedSubcriptionDetails?.current_period_end, "DD/MM/YYYY").toDate();
    const periodStart = moment(userData?.subscriptions?.updatedSubcriptionDetails?.current_period_start, "DD-MM-YYYY").toDate();
    // console.log({periodEnd, periodStart,

    //   current_period_end: userData?.subscriptions?.updatedSubcriptionDetails?.current_period_end,
    //   current_period_start:userData?.subscriptions?.updatedSubcriptionDetails?.current_period_start


    // })

    // -----------------------------------------------------------------------------
    // Build the Firestore query:
    // - Filter by patientId.
    // - Filter by date range.
    // - Filter by status ("pending" or "accepted").
    // - Order by date (which is required when using range filters).
    // -----------------------------------------------------------------------------
    const queryRef = firestore()
      .collection('appointments')
      .where('patientId', '==', patientId)
      // .where('date', '>=', periodStart)
      // .where('date', '<=', periodEnd)
      .where('status', 'in', ['pending', 'accepted'])
      .orderBy('date', 'asc');

    // Subscribe to real-time updates via onSnapshot
    const unsubscribe = queryRef.onSnapshot(
      async (snapshot) => {
        if (snapshot.empty) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        try {
          // For each appointment, fetch the related doctor info.
          const newAppointments = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();
              let doctorData = null;
              if (data?.doctorId) {
                const doctorDoc = await firestore()
                  .collection('doctors')
                  .doc(data.doctorId)
                  .get();

                if (doctorDoc.exists) {
                  doctorData = {
                    id: doctorDoc.id,
                    ...doctorDoc.data(),
                  };
                }
              }

              return {
                id: docSnap.id,
                ...data,
                doctor: doctorData,
              };
            })
          );

          setAppointments(newAppointments);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching doctor data:', err);
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [patientId]);

  return { appointments, loading, error };
}
