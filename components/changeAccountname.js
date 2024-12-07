import React, {useEffect, useState} from "react";
import { View , StatusBar, Text, TouchableHighlight, TextInput, ToastAndroid, Alert, ActivityIndicator, Keyboard} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {getFirestore, doc,updateDoc, } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


export default function ChangeAccountName({route}){
    const navigation = useNavigation();

    const db = getFirestore()
    const {username, ChurchName, events, NoOfEvent} = route.params || {};
    const [editName , setEditName] = useState("")

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
        <View style={{flex:1, backgroundColor:"rgba(30, 30, 30, 1)", justifyContent:"space-between"}}>
             <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>


            <View style={{height:60, width:"100%", alignItems:"center",flexDirection:'row',paddingHorizontal:15, elevation:5, backgroundColor:"rgba(50, 50, 50, 1)"}}>

                <MaterialIcons name="edit-document"  color={"rgba(240, 240, 240, 1)"} size={30}/>

                <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)", marginLeft:20}}>Enter a new church name</Text>
            </View>

            <View style={{flex:1}}>
                <TextInput value={editName || ChurchName?.ChurchName} onChangeText={(txt) => setEditName(txt)} style={{width:"100%", height:65, borderBottomWidth:2, borderColor:"white",color:"white", fontSize:18, paddingVertical:5, paddingHorizontal:10}} placeholderTextColor={"white"} />
            </View>


            <View style={{borderTopWidth:1, borderColor:"dimgray", height:65, flexDirection:"row", justifyContent:"space-between"}}>
                <TouchableHighlight onPress={() => navigation.navigate("Settings", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events})} underlayColor="rgba(70, 70, 70, 1)" style={{borderRightWidth:1,width:"50%",justifyContent:"center", alignItems:"center", borderColor:"dimgray", backgroundColor:"rgba(50, 50, 50, 1)"}}>
                    <Text style={{color:"orangered"}}>Cancel</Text>
                </TouchableHighlight>
          
           
                <TouchableHighlight onPress={() => {updateChurchName(), setPressed(true), Keyboard.dismiss() }} underlayColor="rgba(70, 70, 70, 1)" style={{ width:"50%",justifyContent:"center", alignItems:"center", backgroundColor:"rgba(50, 50, 50, 1)"}}>
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