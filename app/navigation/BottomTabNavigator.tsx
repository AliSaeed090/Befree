import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from '../screens/Dashbaord';
import {useTheme} from '../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Setting from '../screens/Setting';
import MyAppointments from '../screens/MyAppointments';
import AiChat from '../screens/AiChat';
import SymptomsChecker from '../screens/SymptomsChecker';

const Tab = createBottomTabNavigator();
// const {theme, colors} = useTheme();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      >
      <Tab.Screen
        name="Feed"
        component={Dashboard}
        // tabBarVisible={false}
        options={{
          // tabBarVisible: false,
         
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AiChat"
        component={AiChat}
        
        options={{
          tabBarStyle: { display: 'none' },
          headerShown: false,
          tabBarLabel: 'AiChat',
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="chat" color={color} size={size} />
          ),
        //   tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="SymptomsChecker"
        component={SymptomsChecker}
        options={{
          tabBarStyle: { display: 'none' },
          headerShown: false,
          tabBarShowLabel: false,
          
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="analytics-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyAppointments"
        component={MyAppointments}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarLabel: 'MyAppointments',
          
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MyTabs;
