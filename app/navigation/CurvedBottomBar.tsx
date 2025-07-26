import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CurvedBottomBar,
  ICurvedBottomBarRef,
} from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import Setting from '../screens/Setting';
// import MyAppointments from '../screens/MyAppointments';
import MyAppointments from '../screens/Community';

import AiChat from '../screens/AiChat';
// import AiChat from '../screens/AiChat/test';

import SymptomsChecker from '../screens/SymptomsChecker';
import Dashboard from '../screens/Dashbaord';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {useTheme} from '../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {use} from 'i18next';

export default function App({navigation, route}:any) {
  const bottomBarRef = useRef<ICurvedBottomBarRef>(null);
  const [currentTab, setCurrentTab] = useState('Home');

  const handleAiChatClick = () => {
    // Hide the CurvedBottomBar when navigating to AiChat
    bottomBarRef.current?.setVisible(false);
  };
  const _renderIcon = (routeName: any, selectedTab: any) => {
    switch (routeName) {
      case 'Home':
        return (
          <MaterialCommunityIcons
            name="home"
            color={routeName === selectedTab ? '#3B82F6' : '#64748B'}
            size={25}
          />
        );
      case 'AiChat':
        return (
          <MaterialIcons
            name="chat"
            color={routeName === selectedTab ? '#3B82F6' : '#64748B'}
            size={25}
          />
        );
      case 'SymptomsChecker':
        return (
          <Ionicons
            name="analytics-sharp"
            color={routeName === selectedTab ? '#3B82F6' : '#64748B'}
            size={25}
          />
        );
      case 'MyAppointments':
        return (
          <MaterialCommunityIcons
            name="google-circles-communities"
            color={routeName === selectedTab ? '#3B82F6' : '#64748B'}
            size={25}
          />
        );
      case 'Setting':
        return (
          <MaterialIcons
            name="settings"
            color={routeName === selectedTab ? '#3B82F6' : '#64748B'}
            size={25}
          />
        );
    }
  };
 
  useFocusEffect(() => {
    
    const routeName = getFocusedRouteNameFromRoute(route);
    //console.log({bottomBarRef:bottomBarRef.current});
    if (routeName === 'AiChat') {
      bottomBarRef.current?.setVisible(false);
    } else {
      bottomBarRef.current?.setVisible(true);
    }
  },);
  const renderTabBar = ({routeName, selectedTab, navigate}: any) => {
    const FocusRouteName = getFocusedRouteNameFromRoute(route);
   
    
    return (
      <TouchableOpacity
        onPress={() => {
          if (FocusRouteName === routeName ) return
          navigate(routeName);
          setCurrentTab(routeName);
          //   handleAiChatClick()
        }}
        style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      ref={bottomBarRef}
      screenOptions={{
        tabBarStyle: {display: 'none'},
        headerShown: false,
      }}
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shawdow}
      height={70}
      circleWidth={50}
      bgColor="#1E293B"
      initialRouteName="Home"
      borderTopLeftRight
      renderCircle={({selectedTab, navigate}) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate('SymptomsChecker')}>
            <Ionicons name="analytics-sharp" color={'#fff'} size={25} />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}>
      <CurvedBottomBar.Screen
        options={{
          // tabBarVisible: false,

          headerShown: false,
          tabBarLabel: 'Home',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}: any) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        name="Home"
        position="LEFT"
        component={() => <Dashboard ref={bottomBarRef} />}
      />
      <CurvedBottomBar.Screen
        options={{
          // tabBarVisible: false,
          tabBarStyle: {display: 'none'},
          headerShown: false,
          tabBarLabel: 'AiChat',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}: any) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        name="AiChat"
        position="LEFT"
        component={(props:any) => <AiChat {...props} />}
      />
      
      <CurvedBottomBar.Screen
        options={{
          // tabBarVisible: false,

          headerShown: false,
          tabBarLabel: 'MyAppointments',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}: any) => (
            <MaterialCommunityIcons name="google-circles-communities" color={color} size={size} />
          ),
        }}
        name="MyAppointments"
        position="RIGHT"
        component={() => <MyAppointments />}
      />
      <CurvedBottomBar.Screen
        options={{
          // tabBarVisible: false,

          headerShown: false,
          tabBarLabel: 'Setting',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}: any) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        name="Setting"
        position="RIGHT"
        component={() => <Setting />}
      />
    </CurvedBottomBar.Navigator>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E64FA',
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: '#BFEFFF',
  },
  screen2: {
    flex: 1,
    backgroundColor: '#FFEBCD',
  },
});
