import React, { useEffect, useRef, useState } from 'react';
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import { View, TouchableOpacity,Text ,useColorScheme, Alert} from 'react-native';
import { BottomSheet } from 'react-native-btr';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, updateDoc,getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';


import * as Notifications from 'expo-notifications';



export default function PayStack({pay, mode}){
  const paystackWebViewRef = useRef(paystackProps.PayStackRef); 
  const navigation = useNavigation()
  const isDarkMode = useColorScheme() === 'dark';
  const [token, setToken] = useState()
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(pay);



  
  const toggleBottomSheet = () => {
    setBottomSheetVisible(!pay);
  };



  useEffect(()=>{
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('deviceToken');
        if (value !== '') {
          setToken(JSON.parse(value))
        } else {
          console.log("no item")
        }
      } catch (error) {
        console.error('Error checking Token', error);
      }
    };
    getToken()
  }, [])


async function markAsPaid() {
  const db = getFirestore();
  const now = new Date();

  if(token){
      // Fetch the user document
      const userDocRef = doc(db, "deviceTokens", token);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Calculate subscription start date
        const trialEndDate = new Date(userData.trialEnd);
        const subscriptionStartDate = now > trialEndDate ? now : trialEndDate;

        // Calculate subscription end date (4 months from start)
        const subscriptionEndDate = new Date(subscriptionStartDate);
        subscriptionEndDate.setMonth(subscriptionStartDate.getMonth() + 4);

        // Update Firestore
        await updateDoc(userDocRef, {
          isPaid: true,
          subscriptionEnd: subscriptionEndDate.toISOString(),
          lastPaymentDate: now.toISOString()
        });

        navigation.navigate("Church Admin")
        Alert.alert("Church Administrator", "🎉 Subscription renewed!")
      }else {
        console.error("User document not found.");
      }
  }
  
}


 
  return (
    <BottomSheet visible={isBottomSheetVisible} onBackButtonPress={toggleBottomSheet}  onBackdropPress={toggleBottomSheet} >
      <View style={{height:200,alignItems:"center",borderTopRightRadius:50,borderTopLeftRadius:50,borderTopWidth:0.5,borderColor:"gray",padding:10,justifyContent:"center", backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>
            
            <View style={{position:"absolute", top:20}}>
                <Text style={{fontSize:18,fontWeight:"500", color:" rgba(100, 200, 255, 1)"}}>Church Administrator</Text>
            </View>

            <Paystack
                paystackKey="pk_live_a95ff80860ff5b1d69a43f28f6bc7ca955922a68"
                paystackSecretKey='sk_live_c5da0c92c832d407dff50489fe3b23ae3f953c5a'
                billingName='Church Administrator'
                billingEmail="churchad9@gmail.com"
                phone={'0241380745'}
                currency='GHS'
                amount={200}
                channels={[mode]}
                onCancel={(e) => {
                  navigation.replace("Church Admin");
                  Alert.alert("Church Administrator", "Payment cancelled!")
                  console.log(e)
                }}
                onSuccess={(res) => {
                  markAsPaid()
                  console.log(res.transactionRef)
                }}
                ref={paystackWebViewRef}
            />

            <TouchableOpacity style={{borderColor:" rgba(100, 200, 255, 1)", borderWidth:2, padding:10, borderRadius:10, width:'50%', alignItems:"center"}} onPress={()=> token ? paystackWebViewRef.current.startTransaction() : alert("Only Admin can renew subscription!")}>
                <Text style={{color:isDarkMode ? '#FFFFFF' : '#000000'}}>Pay Now</Text>
            </TouchableOpacity>
        </View>
      </BottomSheet>
  );
}