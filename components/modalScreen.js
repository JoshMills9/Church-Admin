import React, { useState } from "react";
import { View, TouchableOpacity, Text, StatusBar, Image, Modal, ScrollView,Pressable} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';


export default function ModalScreen({route}){
    const {username, ChurchName} = route.params
    const navigation = useNavigation();
    const [isActive, setActive] = useState(true)
    

    return (
        <View style={{flex:1,justifyContent:"space-between"}}>
    
                    <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>


                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:5}}>
                            <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"white",elevation:6}}>
                                <MaterialIcons name="dashboard"  color={"rgba(0, 0, 128, 0.8)"} size={30}/>
                            </View>

                            <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"center", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"white" }}>
                                <Text style={{fontSize:23,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)"}}>Dashboard</Text>
                            </View>
                    </View>

                    <ScrollView>

                    <View style={{padding:10,}}>

                        <View style={{marginTop:10,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>

                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Registration")}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="person-add-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}}>Register Member</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Update Member Data")}} style={{height:130, width:"48%",padding:10,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"white", elevation:5 }}>
                                        <Ionicons name="pencil-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black", textAlign:'center'}} >Update Member Data</Text>
                                </TouchableOpacity>
                            </>
                        </View>
                        

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("MemberList")}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="people-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}}>Members List</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Attendance")}} style={{height:130, width:"48%",padding:10,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"white", elevation:5 }}>
                                        <Ionicons name="book-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black", textAlign:'center'}} >Record Church Attendance</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Events",{id: "" ,image : null, name: "", guest: "", About: "", start:"" })}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="calendar-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}}>Create Event</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Send SMS")}} style={{height:130, width:"48%",padding:15,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"white", elevation:5 }}>
                                        <Ionicons name="chatbox-ellipses-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}} >Prepare SMS</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Receipt")}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="receipt-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}}>SMS Receipt</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> navigation.navigate("Make Pledge")} style={{height:130, width:"48%",padding:15,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"white", elevation:5 }}>
                                        <Ionicons name="cash-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}} >Make Pledge</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="calculator-outline" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"black"}}>Statistics</Text>
                                </TouchableOpacity>
                            </>

                            <>
                                <TouchableOpacity onPress={()=> {}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"white", elevation:6 }}>
                                        <Ionicons name="add" color={"rgba(0, 0, 128, 0.8)"} size={50}/>
                                </TouchableOpacity>
                            </>
                        
                        </View>
                        
                       
                    </View>

                </ScrollView>


                <View>
    
                    <View  style={{flexDirection:"row",backgroundColor:"white", justifyContent:"space-around",paddingVertical:5,borderTopWidth:1,borderColor:"lightgray"}}>
                            <Pressable >
                            {({pressed})=>(
                                    <View style={{alignItems:"center"}}>
                                        <MaterialIcons name="dashboard" size={27} color={pressed || isActive ? "rgba(0, 0, 128, 0.8)" :"gray"} />
                                        <Text style={{color: pressed || isActive ? "rgba(0, 0, 128, 0.8)" : "gray",fontWeight:"500", fontSize:12}}>
                                            More
                                        </Text>
                                    </View>
                                    )}
                            </Pressable>


                            <Pressable onPress={()=> navigation.replace("Church Admin")}>
                               
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home-outline" size={27} color={"gray"}   />
                                    <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                           
                            </Pressable>
                         

                            <Pressable onPress={()=> navigation.navigate("Settings", {username: username, ChurchName:ChurchName})}  >
                                    
                                    <View style={{alignItems:"center"}}>
                                        <Ionicons name="settings-outline" size={27} color= "gray"  />
                                        <Text style={{color: "gray",fontWeight:"500", fontSize:12}}>
                                            Settings
                                        </Text>
                                    </View>
                            
                            </Pressable>
                            
                    </View>
                </View>
        </View>
    );
};


