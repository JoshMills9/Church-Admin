import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import LogIn from './components/loginScreen';
import SignUp from './components/signUpScreen';
import Home from './components/home';
import AddMembers from './components/memberReg';
import Settings from './components/settings';
import ModalScreen from './components/modalScreen';
import UpdateMemberInfo from './components/memberInfoUpdate';
import MemberList from './components/memberList';
import SendSMS from './components/sms';
import Details from './components/details';
import Attendance from './components/attendance';
import SmsReceipt from './components/smsReceipt';
import Events from './components/events';
import makePledgeScreen from './components/makePledgeScreen';
import { Payments } from './components/payments';
import Users from './components/users';
import { Notifications } from './components/notifications';

const Stack = createNativeStackNavigator();




export default function MyStack (){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LogIn'  >

        <Stack.Screen name="LogIn" component={LogIn} options={{headerShown:false, animation:"fade_from_bottom"}} />

        <Stack.Screen name="SignUp" component={SignUp}  options={{headerShown:false, animation:"slide_from_left"}} />
        
        <Stack.Screen name="Users" component={Users}  options={{headerShown:false, animation:"slide_from_right"}} />

        <Stack.Screen name='Church Admin' component={Home} options={{ headerShown:false,  animation:'fade_from_bottom'}}/>

        <Stack.Screen name='Settings' component={Settings} options={{headerShown:false,headerTitleStyle:{fontSize:28, fontWeight:"bold"},  animation:'slide_from_right'}}/>

        <Stack.Screen name="ModalScreen" component={ModalScreen}  options={{headerShown:false, animation:"slide_from_left"}}/>

        <Stack.Screen name='Registration' component={AddMembers} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>

        <Stack.Screen name='Update Member Data' component={UpdateMemberInfo} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>

        <Stack.Screen name='MemberList' component={MemberList} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>

        <Stack.Screen name='Attendance' component={Attendance} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>
        
        <Stack.Screen name='Details' component={Details} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>

        <Stack.Screen name='Receipt' component={SmsReceipt} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>
        
        <Stack.Screen name='Events' component={Events} options={{headerShown:false, headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/>

        <Stack.Screen name='Send SMS' component={SendSMS} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/> 
      
        <Stack.Screen name='Make Pledge' component={makePledgeScreen} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/> 
        
        <Stack.Screen name='Payment' component={Payments} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/> 
        
        <Stack.Screen name='Notification' component={Notifications} options={{headerShown:false,headerTitleStyle:{fontSize:20, fontWeight:"bold"}, animation:'slide_from_bottom'}}/> 

      </Stack.Navigator>
    </NavigationContainer>
  );
};