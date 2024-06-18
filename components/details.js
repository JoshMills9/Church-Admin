import React, { useState } from "react";
import { View, StatusBar,Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { doc,getFirestore, collection, deleteDoc } from 'firebase/firestore';


export default function Details ({navigation, route}){

    const {member,id } = route.params 
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
                navigation.replace("MemberList")
         
            } catch (error) {
                console.error("Error deleting document: ", error);
                SetDelete(false)
            }
        };


    return(
        <View style={{flex:1,justifyContent:"space-between"}}>
              <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "white", elevation: 5 }}>
                            <Ionicons name="arrow-back" size={35} color={"navy"} onPress={() => navigation.replace('MemberList')} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "center", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "white" }}>
                            <Text style={{ fontSize: 26, color: "navy", fontWeight: "800" }}>Member Details</Text>
                        </View>
                </View>
                
                <View style={{marginHorizontal:15, height:550 ,paddingVertical:10,justifyContent:"center",}}>
                    <ScrollView>
                    <View style={{justifyContent:"center", alignSelf:"center", borderRadius:15, borderWidth:1,borderColor:"gray",width:120,height:120}}>
                        {member[0].Image ? 
                            <Image source={{uri: member[0].Image}}  style={{width:100,alignSelf:"center", height:100, borderRadius:50}} />
                            : <MaterialIcons name="person"  size={120} color={"gray"}/>
                        }
                    </View>

                    <View style={{marginTop:30,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Full Name:</Text>
                        <Text style={{fontSize:18, fontWeight:"500"}}>{member[0].FirstName} {member[0].SecondName}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Date Of Birth:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Date_Of_Birth}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Registration Date:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Registration_Date}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Phone Number 1:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Number1}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Phone Number 2:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Number2}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Email:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Email}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Residential Address:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Location}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Marital Status:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Marital_Status}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Department:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Department}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Baptized:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Baptized}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Visiting:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].Visting}</Text>
                    </View>

                    <View style={{marginTop:15,flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"300"}}>Occupation:</Text>
                        <Text  style={{fontSize:18, fontWeight:"500"}}>{member[0].occupation}</Text>
                    </View>
                    </ScrollView>
                </View>

                

                <View style={{justifyContent:"center",marginBottom:15 ,alignSelf:"center",height:50, borderRadius:15,  width:170,backgroundColor:"white", elevation:5}}>
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