import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StatusBar, Image, Modal, ScrollView,Pressable, ToastAndroid} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function ModalScreen({route}){
    const {username, ChurchName, events} = route.params
    const navigation = useNavigation();
    const [isActive, setActive] = useState(true)
  
   

 
    return (
        <View style={{flex:1,justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>
    
                    <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>


                    <View style={{height:60, width:"100%", alignItems:"center",flexDirection:'row',paddingHorizontal:15, elevation:5, backgroundColor:"rgba(50, 50, 50, 1)"}}>
    
                        <MaterialIcons name="dashboard"  color={"rgba(240, 240, 240, 1)"} size={30}/>

                        <Text style={{fontSize:25,fontWeight:"800",color:"rgba(240, 240, 240, 1)", marginLeft:20}}>Dashboard</Text>
                    </View>


                    <ScrollView>

                    <View style={{padding:10,}}>

                        <View style={{marginTop:10,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>

                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Registration", {username: username, ChurchName: ChurchName, events: events} )}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="person-add-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>Register Member</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Update Member Data", {username: username, ChurchName: ChurchName,events: events})}} style={{height:130, width:"48%",padding:10,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5 }}>
                                        <Ionicons name="pencil-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)", textAlign:'center'}} >Update Member Data</Text>
                                </TouchableOpacity>
                            </>
                        </View>
                        

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("MemberList", {username: username, ChurchName: ChurchName, events: events})}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="people-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>Members List</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {ToastAndroid.show("Upcoming feature!", ToastAndroid.LONG)/*navigation.navigate("Attendance", {username: username, ChurchName: ChurchName, events: events})*/}} style={{height:130, width:"48%",padding:10,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5}}>
                                        <Ionicons name="book-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)", textAlign:'center'}} >Record Church Attendance</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Events",{id: "" ,image : null, name: "", guest: "", About: "", start:"" ,username: username, ChurchName: ChurchName, events: events})}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="calendar-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>Create Event</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Send SMS", {username: username, ChurchName: ChurchName,events: events})}} style={{height:130, width:"48%",padding:15,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5 }}>
                                        <Ionicons name="chatbox-ellipses-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}} >Prepare SMS</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Receipt", {username: username, ChurchName: ChurchName, events: events})}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="receipt-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>SMS Receipt</Text>
                                </TouchableOpacity>
                            </>
                            <>
                                <TouchableOpacity onPress={()=> {navigation.navigate("Make Pledge", {username: username, ChurchName: ChurchName, events: events})}} style={{height:130, width:"48%",padding:15,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5 }}>
                                        <Ionicons name="cash-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}} >Make Pledge</Text>
                                </TouchableOpacity>
                            </>
                        </View>

                        <View style={{marginTop:15,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <>
                                <TouchableOpacity onPress={()=> {ToastAndroid.show("Upcoming feature!", ToastAndroid.LONG)}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="calculator-outline" color={" rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>Statistics</Text>
                                </TouchableOpacity>
                            </>

                            <>
                                <TouchableOpacity onPress={()=> {ToastAndroid.show("Upcoming feature!", ToastAndroid.LONG)}} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="add" color={"rgba(100, 200, 255, 1)"} size={50}/>
                                </TouchableOpacity>
                            </>
                        
                        </View>
                        
                       
                    </View>

                </ScrollView>


                <View>
    
                    <View  style={{flexDirection:"row",backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:"space-around",paddingVertical:10,borderTopWidth:1,borderColor:"gray"}}>
                            <Pressable style={{width:120}}>
                            {({pressed})=>(
                                    <View style={{alignItems:"center"}}>
                                        <MaterialIcons name="dashboard" size={27} color={pressed || isActive ? "rgba(100, 200, 255, 1)" :"gray"} />
                                        <Text style={{color: pressed || isActive ? "rgba(100, 200, 255, 1)" : "gray",fontWeight:"500", fontSize:12}}>
                                            More
                                        </Text>
                                    </View>
                                    )}
                            </Pressable>


                            <Pressable style={{width:120}}  onPress={()=> navigation.replace("Church Admin")}>
                               
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home-outline" size={27} color={"gray"}   />
                                    <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                           
                            </Pressable>
                         

                            <Pressable style={{width:120}}  onPress={()=> navigation.navigate("Settings", {username: username, ChurchName:ChurchName, events: events})}  >
                                    
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


