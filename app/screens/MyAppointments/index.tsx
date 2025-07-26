import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import RNCalendarEvents from "react-native-calendar-events";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme, Images } from '../../config';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { showMessage, hideMessage } from 'react-native-flash-message';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDoctorAppointmentsRealTime } from './useDoctorAppointmentsRealTime';
import { useUser } from '../../contexts/User';
import AppointmentDetailsModal from './AppointmentDetailsScreen';
import { current } from '@reduxjs/toolkit';
const Dashboard = () => {

  const { t } = useTranslation();
  const { user: userData } = useUser();
  const [selectedAppointment, setSelectedAppointment] = useState({
    id: 'appointment123',
    doctorName: 'Dr. Alexandra Frejrud',
    specialty: 'Psychology',
    rating: 4.1,
    date: '2024-12-30',
    time: '09:30 - 10:30',
    status: 'booked',
    googleCalander: null
  });
  const { theme, colors } = useTheme();
  const navigation: any = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, selectedLocation } = useSelector(
    (state: any) => state.Auth,
  );

  useEffect(() => {
    console.log({ userData: userData?.subscriptions?.plan_id })
    getRemaingDays()
  }, [])
  const { appointments, loading: appointmentsLoading } =
    useDoctorAppointmentsRealTime();
  useEffect(() => {
    async function scheduleAppointments() {
      try {
        let permissionGranted = await RNCalendarEvents.requestPermissions(false);;
        console.log({ permissionGranted });
        if (permissionGranted !== "authorized") {
          console.log("Calendar permission not granted");
          return;
        }

        let calendars = await RNCalendarEvents.findCalendars();
        let writableCalendars = calendars.filter((cal: any) => {
          if (Platform.OS === "ios" && !cal.isReadOnly) {
            return cal
          } else if (cal.isPrimary === true) {
            return cal
          }
        });

        if (writableCalendars.length === 0) {
          console.log("No writable calendars found.");
          return;
        }

        let calendarID = writableCalendars[0].id; // Use the first available writable calendar
        console.log({ calendars, writableCalendars })
        let appointment: any
        for (appointment of appointments) {
          if (appointment.status === "completed") continue; // Skip completed appointments

          // Convert timestamp to Date object
          let appointmentDate = convertTimestampToDateOnly(appointment.date);

          // Extract hour and minute from start and end time
          let [startHour, startMinute] = appointment.start.split(":").map(Number);
          let [endHour, endMinute] = appointment.end.split(":").map(Number);

          // Set correct start and end times
          let startDate = new Date(appointmentDate);
          startDate.setHours(startHour, startMinute, 0);

          let endDate = new Date(appointmentDate);
          endDate.setHours(endHour, endMinute, 0);

          // Set reminders at 60, 30, and 5 minutes before the appointment
          let alarm60Min = new Date(startDate);
          let alarm30Min = new Date(startDate);
          let alarm5Min = new Date(startDate);

          // alarm60Min.setMinutes(alarm60Min.getMinutes() - 60);
          alarm30Min.setMinutes(alarm30Min.getMinutes() - 30);
          alarm5Min.setMinutes(alarm5Min.getMinutes() - 5);

          // **Check if event already exists**
          let existingEvents = await RNCalendarEvents.fetchAllEvents(
            startDate.toISOString(),
            endDate.toISOString()
          );
          // console.log({existingEvents})

          let eventExists = existingEvents.some((event) => (event.notes === appointment.slotId || event.description === appointment.slotId));
          console.log({ existingEvents })

          if (eventExists) {
            console.log(`Event already exists for slotId: ${appointment.slotId}`);
            continue; // Skip creating a duplicate event
          }

          // **Create event if not exists**
          let eventDetails = {
            // id: appointment.slotId,
            notes: appointment.slotId, // Slot ID as identifier
            description: appointment.slotId, // Slot ID as identifier
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            calendarId: calendarID,
            alarms: [
              { date: alarm30Min.toISOString() },
              // { date: alarm30Min.toISOString() },
              { date: alarm5Min.toISOString() },
            ],
          };

          let event = await RNCalendarEvents.saveEvent("Cita con Bfree", eventDetails);
          console.log(`Event created for appointment: ${event}`);
        }
      } catch (error) {
        console.error("Error scheduling appointments:", error);
      }
    }

    if (appointments.length > 0) {
      scheduleAppointments();
    }
  }, [appointments]);


  function convertTimestampToDateOnly(timestamp: any) {
    // Convert seconds to milliseconds
    const milliseconds = timestamp.seconds * 1000;

    // Create a Date object
    const date = new Date(milliseconds);

    // Format the date to return only the date part (e.g., YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  }


  // Manage modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Manage loading state (for the cancel action)
  const [loading, setLoading] = useState(false);
  const [Daysleft, setDaysleft] = useState(0);


  // Show or hide the modal
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Cancel appointment in Firebase
  const handleCancelAppointment = async () => {
    try {
      setLoading(true);

      // Example: Update the status to "canceled" in your appointments collection
      await firestore()
        .collection('appointments')
        .doc(selectedAppointment.id)
        .update({ status: 'canceled' });

      // Update local state
      setSelectedAppointment({ ...selectedAppointment, status: 'canceled' });

      // Alert.alert('Success', 'Appointment has been canceled!');
      showMessage({
        message: t("appointment_cancelled_successfully"),
        type: 'success',
        icon: 'success',

      });
      closeModal();
    } catch (error) {
      console.error('Error canceling appointment: ', error);
      Alert.alert('Error', 'Unable to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };
  const openDetailsModal = (appointment: any) => {
    //console.log({appointment});
    setSelectedAppointment({
      id: appointment.id,
      doctorName: appointment.doctor.firstName + ' ' + appointment.doctor.lastName,
      specialty: appointment.doctor.department,
      rating: 4.1,
      date: convertTimestampToDateOnly(appointment.date),
      time: appointment.start + ' - ' + appointment.end,
      status: appointment.status,
      googleCalander: appointment.googleCalander,
    });


    openModal();
  };
  const changeStatus = (appointment: any) => {
    // console.log({appointment:appointment.googleCalander.hangoutLink})
    const appointmentDate = moment(appointment.date.toDate()); // Convert seconds to moment date
    const currentDate = moment(); // Get current date/time

    const diffInDays = appointmentDate.diff(currentDate, 'days');

    // console.log({ diffInDays });

    // You can add logic based on diffInDays, for example:
    if (diffInDays < -2) {
      console.log('Appointment is in the past.');
      firestore()
        .collection('appointments')
        .doc(appointment.id)
        .update({ status: 'successful' });
    } else if (diffInDays === 0) {
      console.log('Appointment is today.');
    } else {
      // console.log(`Appointment is in ${diffInDays} days.`,{appointmentDate});
    }
  };
  const getRemaingDays = () => {
    const periodEnd = moment(userData?.subscriptions?.updatedSubcriptionDetails?.current_period_end, "DD/MM/YYYY");
    const currentDate = moment(); // Get current date/time

    const daysLeft = periodEnd.diff(currentDate, 'days');
    setDaysleft(daysLeft)

    // console.log(`Days left in the subscription period: ${daysLeft}`,{periodEnd,x:userData?.subscriptions?.updatedSubcriptionDetails?.current_period_end});

  }
  return (
    <>


      <AppointmentDetailsModal
        visible={modalVisible}
        appointment={selectedAppointment}
        loading={loading}
        onCancel={handleCancelAppointment}
        onClose={closeModal}
      />
      <View style={{ backgroundColor: colors.background }}>
        {(appointments.length === 0) === true ? (
          <>

            <View style={styles.row_center_95}>
              <View
                style={{
                  marginTop: 15,

                  // gap: '5%',
                  // backgroundColor: '#A4B5FF',

                  // height: 343,

                  alignSelf: 'flex-end',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <Image
                  source={Images.x6}
                  style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'cover',
                    borderRadius: 20,
                  }}
                />
              </View>
              {userData?.subscriptions?.plan_id != "befree_essential" && <Text
                style={{
                  marginTop: 20,
                }}
                bold
                whiteColor
                textAlign="center"
                header>
                {t('book_your_appointment')}
              </Text>}
              <Text callout textAlign="center" style={{ marginTop: 0 }}>
                {/* {t('3 days until prescription renewal is available')} */}
              </Text>
            </View>
            
            <View style={{ ...styles.row_center_95, marginVertical: 0 }}>
              {(appointments.length === 0 && appointmentsLoading === false && userData?.subscriptions?.plan_id != "befree_essential") && <Button
                full
                onPress={() => {
                  navigation.navigate('AppointmentBooking_1');
                }}
                iconRight={
                  <FontAwesome5
                    style={{ marginLeft: 20 }}
                    name="plus"
                    size={20}
                    color={'white'}
                  />
                }
                loading={false}
                style={{ marginTop: 0 }}>
                {t('schedule_new_appointment')}
              </Button>}
              {(appointments.length === 0 && appointmentsLoading === false && userData?.subscriptions?.plan_id === "befree_essential") && <Button
                full
                onPress={() => Linking.openURL("https://portal.befreehealth.ai/")}
                iconRight={
                  <FontAwesome5
                    style={{ marginLeft: 20 }}
                    name="plus"
                    size={20}
                    color={'white'}
                  />
                }
                loading={false}
                style={{ marginTop: 0 }}>
                {t('Schedule_with_Specialists_Upgrade_Your_Plan')}
              </Button>}
            </View>
          </>
        ) : (
          <>

            <View style={styles.row_center_95}>





              {appointments.map((appointment: any) => {
                changeStatus(appointment)
                if (appointment.status === "completed") {
                  return (<Text callout textAlign="center" style={{ marginTop: 16 }}>
                    {Daysleft} {t('days_until_appointment_booking_is_available')}
                  </Text>)
                }
                return (
                  <View
                    style={{
                      width: '100%',
                      padding: 16,
                      marginVertical: 16,
                      borderRadius: 16,
                      backgroundColor: colors.card,
                    }}>
                    <Text bold whiteColor body2>
                      {t('virtual_consultations')}
                    </Text>
                    <TouchableOpacity
                      key={appointment.id}
                      onPress={() => openDetailsModal(appointment)}
                      style={{
                        marginVertical: 8,
                        width: '100%',
                        padding: 16,
                        flexDirection: 'row',
                        backgroundColor: colors.background,
                        borderRadius: 16,
                      }}>
                      <View
                        style={{
                          width: '30%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{ uri: appointment.doctor.profileImageUrl }}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 5,
                            marginRight: 16,
                          }}
                        />
                      </View>
                      <View style={{ width: '60%', alignItems: 'flex-start' }}>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text bold whiteColor body2>
                            {appointment.doctor.firstName}{' '}
                            {appointment.doctor.lastName}
                          </Text>
                          <MaterialIcons
                            name="verified"
                            size={15}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                          />
                        </View>

                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}>
                          <MaterialIcons
                            name="star"
                            size={20}
                            color={'#F59E0B'}
                          />
                          <Text bold whiteColor body2 style={{ marginLeft: 5 }}>
                            4.1
                          </Text>
                          <MaterialCommunityIcons
                            name="brain"
                            size={20}
                            color={'#94A3B8'}
                            style={{ marginLeft: 10 }}
                          />
                          <Text bold whiteColor body2 style={{ marginLeft: 5 }}>
                            {appointment.doctor.department}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            marginTop: 5,
                          }}>
                          <FontAwesome
                            name="calendar-check-o"
                            size={15}
                            color={'white'}
                          />
                          <Text whiteColor body2 style={{ marginLeft: 10 }}>
                            {appointment.start + ' - ' + appointment.end}
                            {' ' + ' '}
                            {convertTimestampToDateOnly(appointment.date)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: '10%',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <FontAwesome
                          name="angle-right"
                          size={30}
                          color={'white'}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* new list  */}



            </View>
            {(appointments.length === 0 && appointmentsLoading === false) && <View
              style={{
                ...styles.row_center_95,
                marginTop: 10,
                // marginBottom: 150,
              }}>
              <Button
                full
                onPress={() => {
                  navigation.navigate('AppointmentBooking_1');
                }}
                iconRight={
                  <FontAwesome5
                    style={{ marginLeft: 20 }}
                    name="plus"
                    size={20}
                    color={'white'}
                  />
                }
                loading={false}
                style={{ marginTop: 20 }}>
                {t('schedule_new_appointment')}
              </Button>
            </View>}
          </>
        )}
      </View>

    </>
  );
};
export default Dashboard;
