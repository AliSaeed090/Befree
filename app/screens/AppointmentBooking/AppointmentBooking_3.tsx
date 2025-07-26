import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
  Pressable,
  Touchable,
  Dimensions,
  Linking,
  StyleSheet,
  FlatList,
  Alert,
  Button as RNButton,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { useUser } from "../../contexts/User"
import { showMessage, hideMessage } from 'react-native-flash-message';

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

interface Props {
  navigation: any;
  route: any;
}
// What is your health goal for the app?
const AppointmentBooking_1: React.FC<Props> = ({ navigation, route }) => {
  const { user: userData, getUserData } = useUser();

  const { t } = useTranslation();
  const { params } = route;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isloadingBoooking, setisloadingBoooking] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const [doctorsSchedule, setDoctorsSchedule] = useState<any>({});
  useEffect(() => {
    if (params?.doctor) {
      setDoctor(params.doctor);
      getDoctorSchedule();
    }
  }, [params]);

  const getDoctorSchedule = async () => {
    try {
      setLoading(true);
      const doctorSchedule: any = await firestore()
        .collection('doctorsSchedule')
        .doc(params.doctor.doctorId)
        .get();
      // //console.log({doctorSchedule: JSON.stringify(doctorSchedule.data())});
      setLoading(false);
      if (doctorSchedule.exists) {
        setDoctorsSchedule(doctorSchedule.data());
      }
    } catch (error) {
      setLoading(false);
      console.error('Error retrieving item', error);
    }
  };

  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookedSlot, setBookedSlot] = useState<any>('');
  // On mount, compute current week range (Sun–Sat or Mon–Sun as desired).
  // Here, we’ll consider Sunday as the start of the week (JS default).

  useEffect(() => {
    if (!doctorsSchedule?.weeklySchedule) return;
    const today = moment();
    // Start of the current week (Sunday)
    const startOfWeek = today.clone().add(1, 'day');; // if Monday is the start, do .startOf('isoWeek')
    // End of the current week (Saturday)
    const endOfWeek = today.clone().endOf('month'); // if Monday start, .endOf('isoWeek')

    // Format them for react-native-calendars
    setWeekRange({
      start: startOfWeek.format('YYYY-MM-DD'),
      end: endOfWeek.format('YYYY-MM-DD'),
    });

    // Mark the days in the current week that have available slots.
    // For each day in [startOfWeek..endOfWeek], if schedule is not empty => mark it
    let tempMarked: any = {};
    for (let i = 0; i < 180; i++) {
      const current = startOfWeek.clone().add(i, 'days');
      const dayName = current.format('dddd'); // e.g., "Monday"
      const dateStr = current.format('YYYY-MM-DD');

      // Check if we have any timeslots for this day
      const slots = doctorsSchedule.weeklySchedule[dayName] || [];
      if (slots.length > 0) {
        // Mark it (e.g., dot or custom style)
        tempMarked[dateStr] = {
          marked: true,
          dotColor: colors.primary,
        };
      } else {
        // We can optionally disable or do nothing
        tempMarked[dateStr] = { disabled: true, disableTouchEvent: true };
      }
    }

    setMarkedDates(tempMarked);
  }, [doctorsSchedule]);

  /**
   * Callback when user presses a day on the calendar
   */
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookedSlotList, setbookedSlotList] = useState<any>([]);

  const onDayPress = async (day: any) => {
    // day.dateString is "YYYY-MM-DD"
    const doctorId = params.doctor.doctorId;
    const targetDate = new Date(day.dateString); // or however you choose
    //console.log({targetDate, day});
    const bookedSlotIds = await fetchAppointmentsByDoctorAndDate(
      doctorId,
      targetDate,
    );
    //console.log({bookedSlotIds});
    setbookedSlotList(bookedSlotIds);
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  /**
   * Compute slots for the selected date (if any)
   */
  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    // Convert 'YYYY-MM-DD' => day name (e.g. "Monday")
    const dayName = moment(selectedDate).format('dddd');
    const slots = doctorsSchedule.weeklySchedule[dayName] || [];
    // Sort by start time
    return [...slots].sort((a, b) => {
      const aStart: any = moment(a.start, 'HH:mm');
      const bStart: any = moment(b.start, 'HH:mm');
      return aStart - bStart;
    });
  };

  const handleSlotPress = (slot: any) => {
    // setisloadingBoooking(true);
    setSelectedSlot(slot);
  };
  const bookSlot = async () => {
    const user = auth().currentUser;
    //console.log({selectedSlot});
    setisloadingBoooking(true);
    // setSelectedSlot(slot);
    try {
      firestore()
        .collection('appointments')
        .add({
          slotId: selectedSlot?.slotId,
          doctorId: doctor.doctorId,
          patientId: user.uid,
          date: new Date(selectedDate),
          status: 'pending',
          start: selectedSlot.start,
          end: selectedSlot.end,
        });
      setisloadingBoooking(false);

      setModalVisible(false);
      let arr = userData?.myDoctors ?? [];
      if (arr.includes(doctor.doctorId)) {
      } else {
        arr.push(doctor.doctorId);
      }
      firestore()
        .collection('patients').doc(user?.uid).update({
          myDoctors: arr,
        }).then(() => {
          getUserData();
          showMessage({
            message: t("appointment_booked_successfully"),
            type: 'success',
            icon: 'success',

          });
          navigation.navigate('MyTabs');
        });
    } catch (e) {
      setisloadingBoooking(false);
      setModalVisible(false);
      //console.log({e});
    }

    // Example booking flow
    // setModalVisible(false);
    // Alert.alert(
    //   'Slot Booked',
    //   `Your appointment is booked on ${selectedDate} from ${slot.start} to ${slot.end}.`,
    // );
  };
  function getStartOfDay(date: any) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getEndOfDay(date: any) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
  const fetchAppointmentsByDoctorAndDate = async (
    doctorId: string,
    day: any,
  ) => {
    //console.log({doctorId, day});
    setLoadingSlots(true);
    try {
      // 1) Get start and end of the day (00:00 - 23:59)
      const start = getStartOfDay(day);
      const end = getEndOfDay(day);

      // 2) Query Firestore
      const snapshot = await firestore()
        .collection('appointments')
        .where('doctorId', '==', doctorId)
        .where("status", "!=", "canceled")
        .where('date', '>=', start) // Firestore will convert JS Date -> Timestamp automatically
        .where('date', '<=', end)
        .get();

      // 3) Gather slotIds from each document
      const slotIds = snapshot.docs.map(doc => {
        const data = doc.data();
        return data.slotId; // or doc.data()?.slotId
      });
      setLoadingSlots(false);
      return slotIds; // e.g. ["xyzSlot123", "abcSlot456", ...]
    } catch (error) {
      setLoadingSlots(false);
      console.error('Error fetching appointments:', error);
      return [];
    }
  };
  return (
    <ScrollView>
      <ImageBackground
        source={{ uri: doctor?.profileImageUrl }}
        style={{
          // ...BaseStyle.safeAreaView,
          // backgroundColor: colors.card,

          height: Dimensions.get('window').height * 0.4,
        }}
        resizeMode="cover"
        imageStyle={{
          // resizeMode: 'cover',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}>
        <SafeAreaView
          style={{ ...BaseStyle.safeAreaView, backgroundColor: 'transparent' }}
          edges={['right', 'top', 'left']}>
          <Header
            renderLeft={() => (
              <View
                style={{
                  ...styles.leftbtn,
                  backgroundColor: 'rgba(15, 23, 42, 0.32)',
                }}>
                <FontAwesome name="angle-left" size={30} color={'white'} />
              </View>
            )}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              paddingVertical: 10,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              backgroundColor: 'rgba(15, 23, 42, 0.32)',
              position: 'absolute',
              bottom: 0,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text bold whiteColor title3>
                {doctor?.firstName} {doctor?.lastName}
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
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <MaterialIcons name="star" size={20} color={'#F59E0B'} />
              <Text bold whiteColor body2 style={{ marginLeft: 5 }}>
                4.1
              </Text>
              <MaterialCommunityIcons
                name="brain"
                size={20}
                color={'#fff'}
                style={{ marginLeft: 10 }}
              />
              <Text bold whiteColor body2 style={{ marginLeft: 5 }}>
                {doctor?.department}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {/* <FontAwesome name="calendar-check-o" size={15} color={'white'} /> */}
              <Text whiteColor body2 style={{ marginLeft: 10 }}>
                {/* 01:15 AM - 02:25 PM Today */}
              </Text>
            </View>
          </View>
        </SafeAreaView>

        {/**/}
      </ImageBackground>
      <View style={styles.row_center_95}>
        <View style={{ width: '100%', alignSelf: 'center', marginTop: 24 }}>
          <Text title3>{t('Personal_Info')}</Text>
          <Text
            // body1
            // textAlign="justify"
            style={{ marginTop: 10, color: '#CBD5E1', fontSize: 12 }}>
            {doctor?.bio}
            {/* Estamos comprometidos con reducir la tasa de mortalidad por suicidio
            en el mundo, convencidos de que un enfoque preventivo, acompañado de
            una búsqueda activa de patrones de comportamiento nos ayudará a
            realizar un diagnóstico oportuno y certero, hemos creado el
            ecosistema digital de salud mental más eficiente de América Latina.
            para brindar intervención oportuna a las personas que la necesitan. */}
          </Text>
        </View>

        <View style={{ marginVertical: 16, width: '100%' }}>
          <Text style={styles.header}>
            {t('doctor_schedule')} ({t('Current_Week')})
          </Text>
          <Calendar
            // Show only the current week by limiting minDate and maxDate
            minDate={weekRange.start}
            maxDate={weekRange.end}
            onDayPress={onDayPress}
            markedDates={{
              ...markedDates,
              // highlight the selected date if any
              ...(selectedDate
                ? {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: colors.primary,
                    marked: markedDates[selectedDate]?.marked,
                    dotColor: markedDates[selectedDate]?.dotColor,
                  },
                }
                : {}),
            }}
            // Optionally hide arrows & month name since we only deal with one week
            hideArrows={true}
            hideExtraDays={true}
            disableAllTouchEventsForDisabledDays={true}
            style={styles.calendar}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: '#fff',
              textDisabledColor: 'white',
              dotColor: colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: colors.primary,
              disabledArrowColor: '#d9e1e8',
              monthTextColor: '#fff',
              indicatorColor: colors.primary,
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>

        {/* Modal to display available slots */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View
              style={{
                ...styles.modalContainer,
                backgroundColor: '#475569',
                borderRadius: 16,
              }}>
              <Text style={styles.modalTitle}>
                {t('available_slots_on')}{' '}
                {moment(selectedDate).format('dddd, MMM D')}
              </Text>


              {getSlotsForSelectedDate().length === 0 ? (
                <Text style={{ marginVertical: 10 }}>
                  {t('no_slots_available')}.
                </Text>
              ) : (
                <FlatList
                  data={getSlotsForSelectedDate()}
                  keyExtractor={item => item.slotId}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      disabled={bookedSlotList.includes(item.slotId)}
                      style={{
                        ...styles.slotItem,
                        backgroundColor:
                          bookedSlotList.includes(item.slotId) ? "gray" :
                            selectedSlot?.slotId === item.slotId
                              ? colors.primary
                              : colors.background,
                      }}
                      onPress={() => handleSlotPress(item)}>
                      <Text style={styles.slotText}>
                        {item.start} - {item.end} {bookedSlotList.includes(item.slotId) ? t("Booked") : ""}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: 10,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.slotItem,
                    { width: '45%', backgroundColor: colors.border },
                  ]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={[styles.slotText, { textAlign: 'center' }]}>
                    {t('close')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isloadingBoooking}
                  style={[
                    styles.slotItem,
                    { backgroundColor: colors.primary, width: '45%' },
                  ]}
                  onPress={() => bookSlot()}>
                  <Text style={[styles.slotText, { textAlign: 'center' }]}>
                    {isloadingBoooking ? (
                      <ActivityIndicator size="small" color={'white'} />
                    ) : (
                      t('book')
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default AppointmentBooking_1;
