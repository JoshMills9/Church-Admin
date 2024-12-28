import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";

import * as Notifications from 'expo-notifications';

import LogIn from './components/loginScreen';
import SignUp from './components/signUpScreen';
import Home from './components/home';
import AddMembers from './components/memberReg';
import Settings from './components/settings';
import ModalScreen from './components/modalScreen';
import UpdateMemberInfo from './components/memberInfoUpdate';
import MemberList from './components/memberList';
import PrepareSmsScreen from './components/prepareSmsScreen';
import Details from './components/details';
import UpdateCell from './components/cellScreen';
import SmsReceipt from './components/smsReceipt';
import Events from './components/events';
import makePledgeScreen from './components/makePledgeScreen';
import ChangeAccountName from './components/changeAccountname';
import { NotificationsScreen } from './components/notifications';
import { Payments } from './components/payments';
import AttendanceList from './components/attendanceList';
import SmsList from './components/smsList';
import Receipts from './components/receipts';
import MarkAttendance from './components/markAttendanceScreen';
import CellList from './components/cells';


const Stack = createNativeStackNavigator();

// Configure notification handlers
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { data } = notification.request.content;
    if (data?.image) {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
}});



export default function MyStack (){
  const db = getFirestore()
  const [hasSeenHomeScreen, setHasSeenHomeScreen] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState(null);

  // Request notification permissions and get the push token
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Listener for when a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Listener for when the user interacts with a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User interacted with notification:', response);
      Alert.alert('Notification clicked!', JSON.stringify(response.notification.request.content));
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);



  // Function to register for push notifications
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Error', 'Failed to get push token for notifications.');
      return null;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      Alert.alert('Error', 'Failed to fetch push token.');
      return null;
    }
  }

  
  //useEffect to save list to Storage
  useEffect(() => {
    
    if(expoPushToken){
       const addToken = async(token) => {
          try {
            const usersCollectionRef = collection(db, 'deviceTokens'); // Reference to 'users' collection
            await addDoc(usersCollectionRef, {
              token
            })
            console.log('Token saved to Firestore.');
          } catch (error) {
            console.error('Error saving token to Firestore:', error);
          }
        
       }
        addToken(expoPushToken)

      const handleSave = async () => {
          try {
            await AsyncStorage.setItem('NotificationToken', JSON.stringify(expoPushToken));
        
          } catch (e) {
            console.error('Failed to save the data to the storage', e);
          }
        };
        handleSave();
      }
    }, [expoPushToken]);
   
      


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('Token');
        if (value === 'true') {
          setHasSeenHomeScreen(true);
        } else {
          setHasSeenHomeScreen(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status', error);
        setHasSeenHomeScreen(false); // Default to showing onboarding if there's an error
      }
    };

    
    checkLoginStatus()
  }, []);

  if (hasSeenHomeScreen === null) {
    // Return null or a loading indicator while we check the onboarding status
    return null;
  }



  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName={hasSeenHomeScreen ? "Church Admin" : "LogIn"}>

      <Stack.Screen name="LogIn" component={LogIn} options={{headerShown:false, animation:"fade_from_bottom"}} />

      <Stack.Screen name="SignUp" component={SignUp}  options={{headerShown:false}} />

      <Stack.Screen name='Church Admin' component={Home} options={{ headerShown:false,  animation:'none'}}/>

      <Stack.Screen name='Settings' component={Settings} options={{headerShown:false,headerTitleStyle:{fontSize:28, fontWeight:"bold"},  animation:"none"}}/>

      <Stack.Screen name='ChangeAccountName' component={ChangeAccountName} options={{headerShown:false,  animation:"fade_from_bottom"}}/>

      <Stack.Screen name="ModalScreen" component={ModalScreen}  options={{headerShown:false, animation:"none"}}/>

      <Stack.Screen name='Registration' component={AddMembers} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Update Member Data' component={UpdateMemberInfo} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='MemberList' component={MemberList} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>
      
      <Stack.Screen name='markAttendance' component={MarkAttendance} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='AttendanceList' component={AttendanceList} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Details' component={Details} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Receipt' component={SmsReceipt} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>
      
      <Stack.Screen name='Update Cell' component={UpdateCell} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>
      
      <Stack.Screen name='Cell List' component={CellList} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Sms Receipt' component={Receipts} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Events' component={Events} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/>

      <Stack.Screen name='Prepare Sms' component={PrepareSmsScreen} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/> 
      
      <Stack.Screen name='Messages' component={SmsList} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/> 

      <Stack.Screen name='Make Pledge' component={makePledgeScreen} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/> 
      
      <Stack.Screen name='Payment' component={Payments} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/> 
      
      <Stack.Screen name='Notification' component={NotificationsScreen} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'fade_from_bottom'}}/> 

    </Stack.Navigator>
  </NavigationContainer>
  );
};