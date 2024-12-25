import React, {useEffect, useState} from "react";
import { View , Text, TouchableHighlight,useColorScheme, TextInput, ToastAndroid, Alert, ActivityIndicator, Keyboard} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getFirestore, doc,updateDoc, } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


export default function ChangeAccountName({route}){
    const navigation = useNavigation();

    const db = getFirestore()
    const {username, ChurchName, events, NoOfEvent} = route.params || {};
    const [editName , setEditName] = useState("")
    const isDarkMode = useColorScheme() === 'dark';
    const [pressed , setPressed] = useState(false)


    const updateChurchName = () => {

    if(editName !== ""){
        const changeName = async()=>{
                try{
                    const userDetailsDocRef = doc(db, 'UserDetails', ChurchName?.id);
            
                    // Set a document within the Members subcollection
                    await updateDoc(userDetailsDocRef, {
                        "userDetails.ChurchName": editName
                    });


                        const handleSaveChurchDetails = async () => {
                            ChurchName.ChurchName = editName;
                            try {
                            await AsyncStorage.setItem('churchInfo', JSON.stringify(ChurchName));
                            setPressed(false)
                            navigation.push("Settings", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events})
                             // Clear form fields after successful registration
                            ToastAndroid.show("Updated Successfully!", ToastAndroid.LONG);
                            } catch (e) {
                            console.error('Failed to save the data to the storage', e);
                            }
                        };
                        handleSaveChurchDetails();
                    } 
                    catch (error) {
                    console.error("Error updating church name: ", error);
                    Alert.alert("Name change Error", error.message);
                   
                }
        }
        changeName()
    }else{
        navigation.navigate("Settings", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events})
        ToastAndroid.show("No changes made!", ToastAndroid.SHORT)
    }
}

   

    return(
        <View style={{flex:1, backgroundColor:isDarkMode ? '#121212' : '#FFFFFF', justifyContent:"space-between"}}>
                <StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}/>


            <View style={{height:60, marginTop:20, width:"100%", alignItems:"center",flexDirection:'row',paddingHorizontal:15, elevation:5, backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>

                <MaterialIcons name="edit-document"  color={ isDarkMode ? '#FFFFFF' : '#000000'} size={30}/>

                <Text style={{fontSize:18,fontWeight:"400",color: isDarkMode ? '#FFFFFF' : '#000000', marginLeft:20}}>Enter a new church name</Text>
            </View>

            <View style={{flex:1}}>
                <TextInput autoFocus={true} value={editName || ChurchName?.ChurchName} onChangeText={(txt) => setEditName(txt)} style={{width:"100%", height:65, borderBottomWidth:2, borderColor: isDarkMode ? '#FFFFFF' : 'gray',color: isDarkMode ? '#FFFFFF' : '#000000', fontSize:18, paddingVertical:5, paddingHorizontal:10}} placeholderTextColor={ isDarkMode ? '#FFFFFF' : '#000000'} />
            </View>


            <View style={{borderTopWidth:1, borderColor:isDarkMode ?"dimgray" :"lightgray", height:65, flexDirection:"row", justifyContent:"space-between"}}>
                <TouchableHighlight onPress={() => navigation.navigate("Settings", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events})} underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"} style={{borderRightWidth:1,width:"50%",justifyContent:"center", alignItems:"center", borderColor:isDarkMode ? "dimgray" : "lightgray", backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>
                    <Text style={{color:"orangered"}}>Cancel</Text>
                </TouchableHighlight>
          
           
                <TouchableHighlight onPress={() => {updateChurchName(), setPressed(true), Keyboard.dismiss() }} underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"} style={{ width:"50%",justifyContent:"center", alignItems:"center", backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>
                   <>{pressed ? 
                   <ActivityIndicator size={"small"} color={" rgba(100, 200, 255, 1)"} />
                   :
                   <Text style={{ color: " rgba(100, 200, 255, 1)" }}>OK</Text>
                   }</>
                </TouchableHighlight>
            </View>
        </View>
    )
}