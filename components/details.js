import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, TouchableHighlight, } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { doc,getFirestore, collection, deleteDoc } from 'firebase/firestore';
import { ToastAndroid } from "react-native";


export default function Details ({navigation, route}){

    const {member,id ,username, ChurchName,events} = route.params 
    const db = getFirestore()

    const [Delete, SetDelete] = useState(false)
   

        const handleDeleteDocument = async (documentId) => {
            try {

                const userDetailsDocRef = doc(db, 'UserDetails', id);
                
                // Reference to the Members subcollection within UserDetails
                const membersCollectionRef = collection(userDetailsDocRef, 'Members');


                const docRef = doc(membersCollectionRef, documentId); 

                await deleteDoc(docRef);

                ToastAndroid.show(`${member[0].FirstName} ${member[0].SecondName} removed successfully!`, ToastAndroid.LONG)
                SetDelete(false)
                navigation.replace('MemberList',{username: username, ChurchName: ChurchName, events:events})
         
            } catch (error) {
                Alert.alert("Error deleting document: ", error);
                SetDelete(false)
            }
        };


    return(
        <View style={{flex:1,justifyContent:"space-between",backgroundColor:"rgba(30, 30, 30, 1)"}}>

                <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>

                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:50,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('MemberList',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Member Details</Text>
                                <Ionicons name="book-outline" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                        </View>

                
                <View style={{marginHorizontal:15, flex:1,justifyContent:"center",}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:"center", alignSelf:"center",width:120,height:120,alignItems:"center"}}>
                         {member[0]?.Image  ? (
                            <View style={{borderWidth:2.5, borderRadius:60,height:120,width:120, alignItems:"center",justifyContent:"center", borderColor:"dimgray"}}>
                                <Image source={{ uri: member[0].Image}} style={{ width: 115, height: 115 ,borderRadius:60}} />
                            </View>
                            )
                            :
                            <View style={{borderWidth:2.5,borderColor:"gray",elevation:5,alignSelf:"center", width:120,height:120,alignItems:"center",justifyContent:"center", borderRadius:100}}>
                                <Ionicons name="person-circle-sharp" size={138} style={{width:135, position:"absolute",right:-8.5 }} color="dimgray"/>
                            </View>
                        }
                    </View>

                    <View style={{marginTop:30,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Full Name:</Text>
                        <View style={{width:"50%"}}>
                            <Text style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].FirstName} {member[0].SecondName}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Date Of Birth:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Date_Of_Birth}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Registration Date:</Text>
                        <View  style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Registration_Date}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Phone Number 1:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Number1}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Phone Number 2:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Number2}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Email:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Email}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Residential Address:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Location}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Marital Status:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Marital_Status}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>No. of children:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].No_Of_Children}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Department:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Department}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Baptized:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Baptized}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Visiting:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}}  adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].Visting}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:16, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Occupation:</Text>
                        <View style={{width:"50%"}}>
                            <Text  style={{fontSize:16, fontWeight:"500",color:"rgba(100, 200, 255, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>{member[0].occupation}</Text>
                        </View>
                    </View>
                    </ScrollView>
                </View>

                

                
                <TouchableHighlight  underlayColor="rgba(70, 70, 70, 1)" onPress={()=> {handleDeleteDocument(member[0].id); SetDelete(true)}}
                    style={{justifyContent:"center",marginVertical:20,alignItems:"center" ,alignSelf:"center",height:55, borderRadius:10,  width:180,backgroundColor:"rgba(50, 50, 50, 1)", elevation:3}}>
                    { Delete ? 
                        <ActivityIndicator color={"orangered"} />
                        :

                        <Text  style={{color:"orangered",fontSize:15,fontWeight:"500",textAlign:"center", alignSelf:"center"}}>{`Remove\n ${member[0].FirstName.toUpperCase()} ${member[0].SecondName.toUpperCase()}`}</Text> 
                    }
                </TouchableHighlight>


        </View>
    )
}