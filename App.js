import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

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




export default function MyStack (){
  const [hasSeenHomeScreen, setHasSeenHomeScreen] = useState(null);

  
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