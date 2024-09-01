import React, { useState } from "react";
import { View, StatusBar,Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, } from "react-native";

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { doc,getFirestore, collection, deleteDoc } from 'firebase/firestore';


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

                Alert.alert("Member successfully Removed!", `You Have Removed  ${member[0].FirstName} ${member[0].SecondName}`)
                SetDelete(false)
                navigation.replace('MemberList',{username: username, ChurchName: ChurchName, events:events})
         
            } catch (error) {
                Alert.alert("Error deleting document: ", error);
                SetDelete(false)
            }
        };


    return(
        <View style={{flex:1,justifyContent:"space-between",backgroundColor:"rgba(30, 30, 30, 1)"}}>

              <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"} />

                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "rgba(50, 50, 50, 1)", elevation: 5 }}>
                            <Ionicons name="arrow-back" size={35} color="rgba(240, 240, 240, 1)" onPress={() => navigation.replace('MemberList',{username: username, ChurchName: ChurchName, events:events})} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "center", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "rgba(50, 50, 50, 1)" }}>
                            <Text style={{ fontSize: 26, color:"rgba(240, 240, 240, 1)", fontWeight: "800" }}>Member Details</Text>
                        </View>
                </View>
                
                <View style={{marginHorizontal:15, height:600 ,paddingVertical:10,justifyContent:"center",}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent:"center", alignSelf:"center", borderRadius:15, borderWidth:1, borderColor:"lightgray",width:120,height:120}}>
                        {member[0]?.Image ? 
                            <Image source={{uri: member[0].Image}}  style={{width:110,alignSelf:"center", height:110, borderRadius:55}} />
                            : <MaterialIcons name="person"  size={120} color={"gray"}/>
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

                

                <View style={{justifyContent:"center",marginBottom:15 ,alignSelf:"center",height:50, borderRadius:15,  width:170,backgroundColor:"rgba(50, 50, 50, 1)", elevation:5}}>
                    { Delete ? 
                        <ActivityIndicator color={"orangered"} />
                        :
                        <TouchableOpacity onPress={()=> {handleDeleteDocument(member[0].id); SetDelete(true)}}>
                            <Text style={{color:"orangered",fontSize:15,fontWeight:"500", alignSelf:"center"}}>Remove Member</Text>
                        </TouchableOpacity>
                    }
                </View>


        </View>
    )
}