import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/index';
import {SafeAreaView, Button, Text, Header} from '../../components';
import {BaseColor, BaseStyle, useTheme, Images} from '../../config';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import FullScreenWebView  from "./FullScreenWebView";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
 
import {useUser} from '../../contexts/User';
 
const Dashboard = () => {
  const {user} = useUser();
  const {t} = useTranslation();
  const {user: userData} = useUser();
  const [selectedAppointment, setSelectedAppointment] = useState({
    id: 'appointment123',
    doctorName: 'Dr. Alexandra Frejrud',
    specialty: 'Psychology',
    rating: 4.1,
    date: '2024-12-30',
    time: '09:30 - 10:30',
    status: 'booked',
  });
  const {theme, colors} = useTheme();
  const navigation: any = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const {isAuthenticated, selectedLocation} = useSelector(
    (state: any) => state.Auth,
  );
  useFocusEffect(React.useCallback(() => {}, [dispatch]));

 
    // user.uid,

  // if (loading) {
  //   return <ActivityIndicator size="large" />;
  // }

  // if (appointments.length === 0) {
  //   return <Text>No appointments found.</Text>;
  // }
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

  // Show or hide the modal
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Cancel appointment in Firebase
 
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
    });

    
    openModal();
  };
  return (
    <FullScreenWebView/> 
  );
};
export default Dashboard;
