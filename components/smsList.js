import React, {useEffect, useState} from "react";
import { View, Text, Image, TouchableHighlight,useColorScheme, Alert, FlatList, ToastAndroid } from "react-native";
import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from '@expo/vector-icons';
import *  as SMS from 'expo-sms'




export default function SmsList({navigation, route}){
    const {username, ChurchName, events} = route.params || {};
    const isDarkMode = useColorScheme() === 'dark';
    const [sms, setSms] = useState();
 
   
    //get sms sent from storage
    useEffect(()=>{
        const getSms = async () => {
            try {
              const value = await AsyncStorage.getItem('SMS');
              if (value !== '') {
                setSms(JSON.parse(value))
              } else {
                console.log("no item")
              }
            } catch (error) {
              console.error('Error checking sms', error);
            }
          };
          getSms();
          
    }, [])

    


    const deleteSms = async (index) => {
        
         // Create a copy of the original list
         const updatedList = [...sms];
        
         // Remove the item at the specified index
         updatedList.splice(index, 1);

         // Update the state with the modified list
         setSms(updatedList);
         ToastAndroid.show("Sms deleted!", ToastAndroid.SHORT)

         if (updatedList){
            try {
                await AsyncStorage.setItem('SMS', JSON.stringify(updatedList));
            } catch (e) {
                console.error('Failed to save the data to the storage', e);
            }
         }    
    }


  
    const sendSMS = async (i) => {
        ToastAndroid.show("Sending ...", ToastAndroid.SHORT)
        try {
          await SMS.sendSMSAsync(
            sms[i]?.smsList, // Array of recipient phone numbers
            `${sms[i]?.defaultHeader}\n\n${sms[i]?.sms}` // Message body
          );
          ToastAndroid.show('Sms sent successfully!', ToastAndroid.SHORT);
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      };



   



    return(
        <View style={{flex:1, backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' }}>
             <StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF' }/>

             <View style={{alignItems:"center",borderBottomWidth:0.5, borderColor:"gray", flexDirection:"row", justifyContent:"space-between",marginTop:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' ,justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={28} style={{width:40,}} color={isDarkMode ? '#FFFFFF' : '#000000' } onPress={() => navigation.push('Prepare Sms',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: isDarkMode ? '#FFFFFF' : '#000000' , fontWeight: "800" }}>All SMS</Text>
                                <Ionicons name={"chatbox-ellipses-outline"} size={25} color={isDarkMode ? '#FFFFFF' : '#000000' } />

                            </View>
            </View>

            <View style={{flex:1, justifyContent: sms?.length !== 0 ? "flex-start" : "center", alignItems: sms?.length !== 0 ? "" : "center", paddingHorizontal:10, marginBottom:10}}>
             
             {sms?.length !== 0 ?    
             
             <FlatList 
            
                data={sms}

                keyExtractor={(item) => item?.sms?.length + item?.smsList?.length}  

                renderItem={({item, index}) => (
                    <View style={{flex:1, marginVertical:10}}>
            
                        <TouchableHighlight onPress={() => {
                            Alert.alert("", "Select option", [
                            { text: "CANCEL", onPress: () => {}, style:"cancel"},
                            { text: "RESEND", onPress: () => {sendSMS(index.toString())}},
                            { text: "DELETE", onPress: () => {deleteSms(index?.toString())}, style: "cancel" },
                            ]);
                        }}  underlayColor={ isDarkMode ? "rgba(70, 70, 70, 0.5)" :"lightgray"} style={{ backgroundColor:isDarkMode ? "#1F2C34" : "#DCF8C6",padding: 10,elevation:3,  borderRadius:5, maxWidth: '85%', alignSelf: 'flex-end',}}>
                            <>
                                <Text style={{fontSize: 16,marginBottom:10, color:isDarkMode ? '#FFFFFF' : '#000000', fontWeight:"800", alignSelf:"center"}} numberOfLines={1} adjustsFontSizeToFit={true}>{item?.defaultHeader}</Text>
                                <Text style={{fontSize: 13,lineHeight: 18, color:isDarkMode ? '#FFFFFF' : '#000000',  fontWeight:"300", textAlign:"justify"}}>{item?.sms}</Text>
                                <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:20}}>
                                
                                    <View style={{flexDirection:"row", backgroundColor:isDarkMode ? "gray" : "lightgray",borderRadius:15,justifyContent:"space-around",height:25,alignItems:"center", width:90}}>
                                      {item?.smsListImg?.slice(0, 4).map((i , index)=> {
                                        return(
                                          <View key={index}>
                                            {(i !== null) ? 
                                                  <View style={{ width:item.smsListImg.length < 4 ? 10 : 15,height:20,marginRight:-12,position:"relative", }}>
                                                    <Image key={index + i} source={{uri : i}} style={{zIndex: item?.smsListImg?.length - index  || 0, width:20,height:20,borderWidth:1,borderColor:"white", borderRadius:10,position:"absolute",top:0,left:index * -7, }} />
                                                  </View>
                                                :
                                                 <Ionicons style={{zIndex: item?.smsListImg?.length - index  || 0, width:23,height:23,borderRadius:10,position:"absolute",top:-12.5,left:index * -5.5, }} key={index + i} name="person-circle-sharp" size={24} color="lightgray"/>  
                                            }
                                          </View>
                                        )})
                                  
                                      }
                                      <Text style={{fontSize: 12,color:isDarkMode ? "lightgray" : 'gray', height:25, verticalAlign:"middle"}}>{item?.smsListImg.length}</Text>
                                    </View>
                                    <Text style={{fontSize: 12,color: 'gray',height:25, verticalAlign:"middle"}}>{item?.date}</Text>
                                </View>
                            </> 
                        </TouchableHighlight>
                    </View>
               
                )}
            
                />
                :
                <View style={{alignItems:"center",justifyContent:"center", backgroundColor:isDarkMode ? 'rgba(100, 100, 100, 0.2)' : "lightgray",width:230, height:45, borderRadius:10}}>
                    <Text style={{color: isDarkMode ? "white" :"black"}}>No Messages</Text>
                </View>
            }
            </View>

        </View>
    )
}