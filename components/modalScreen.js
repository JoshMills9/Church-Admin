import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text,ActivityIndicator,Keyboard, ScrollView,Pressable, ToastAndroid, TextInput, TouchableHighlight} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";
import { BottomSheet } from 'react-native-btr';



export default function ModalScreen({route}){
    const {username, ChurchName, events} = route.params
    const navigation = useNavigation();
    const [isActive, setActive] = useState(true)
    const [create, setCreate] = useState(false);
    const [bottomTab, setBottomTab] = useState(true)
    const [showSubmitting, setSubmitting] = useState(false)
    const [cellName, setCellName] = useState("");
    const [cellLocation, setCellLocation] = useState("")
    const db = getFirestore()



      //Function to handle submit
      const handleSubmit = async (Email) => {
        setSubmitting(true);
        ToastAndroid.show("Creating...", ToastAndroid.SHORT)

        try {
    
            // Step 2: Fetch church details based on user email
            const tasksCollectionRef = collection(db, 'UserDetails');
            const querySnapshot = await getDocs(tasksCollectionRef);
    
            if (!querySnapshot.empty) {
                // Filter tasks to find matching church based on user email
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().userDetails
                }));
    
                const church = tasks.find(item => item.email === Email);
    
                if (!church) {
                    throw new Error("Church details not found for the logged-in user");
                }
    
                  // Step 3: Validate and submit member registration
                if (!cellName || !cellLocation) {
                    throw new Error("Cell Name and Location must be filled!");
                }

                  // Reference to the UserDetails document
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
    
            // Reference to the Members subcollection within UserDetails
            const membersCollectionRef = collection(userDetailsDocRef, 'Cells');
    
            // Example data for a member document within the subcollection
            const cell = {
                cellName,
                cellLocation,
            };
    
            // Set a document within the Members subcollection
            await setDoc(doc(membersCollectionRef), {Cell: cell});

            // Clear form fields after successful registration
            setCellName("");
            setCellLocation("");
            setSubmitting(false);
            toggleBottomSheet();

            ToastAndroid.show(`${cellName} cell created successfully!`, ToastAndroid.LONG);

            navigation.navigate("Update Cell",  {username: username, ChurchName: ChurchName,events: events})   
            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            ToastAndroid.show(`Creation Error: ${error.message}`, ToastAndroid.LONG);
            setSubmitting(false);
        }
    };
    


   

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

    const toggleBottomSheet = () => {
      setBottomSheetVisible(!isBottomSheetVisible);
    };


  
    const createCell = () => {
        return (
            <BottomSheet visible={isBottomSheetVisible} onBackButtonPress={toggleBottomSheet}  onBackdropPress={toggleBottomSheet} >
                <View style={{borderRadius:15,height:350,backgroundColor:"rgba(30, 30, 30, 1)",padding:10, width:"100%" ,justifyContent:"space-around"}}>
                    <Text style={{color:"white",fontSize:16, alignSelf:"center",fontWeight:"700"}}>CREATE CELL</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                        <TextInput onFocus={()=> setBottomTab(false)} value={cellName} onChangeText={(txt) => setCellName(txt)} style={{width:"47%", height:50,fontWeight:"600", color:"white",fontSize:16,textAlign:"center",  borderRadius:10,backgroundColor:"rgba(50, 50, 50, 1)",padding:10}}  cursorColor={"lightgray"} placeholderTextColor={"lightgray"}  placeholder="Cell name"/>
                        <TextInput onFocus={()=> setBottomTab(false)} value={cellLocation} onChangeText={(txt) => setCellLocation(txt)} style={{width:"47%", height:50,fontWeight:"600", color:"white",fontSize:16,textAlign:"center",  borderRadius:10,backgroundColor:"rgba(50, 50, 50, 1)",padding:10}} cursorColor={"lightgray"} placeholderTextColor={"lightgray"}  placeholder="Location"/>
                    </View>
                    <View style={{flexDirection:"row",height:70, justifyContent:"space-between",alignItems:"center",}}>
                        <TouchableHighlight style={{width:"30%", alignItems:"center",justifyContent:"center", height:35, borderRadius:8}} underlayColor="rgba(70, 70, 70, 1)" onPress={() => {toggleBottomSheet() ; navigation.navigate("Cell List",  {username: username, ChurchName: ChurchName,events: events})}}>
                            <Text style={{color:"rgba(100, 200, 255, 1)",fontSize:16}}>View</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={{width:"30%", alignItems:"center",justifyContent:"center", height:35, borderRadius:8}} underlayColor="rgba(70, 70, 70, 1)" onPress={() => {toggleBottomSheet() ; navigation.navigate("Update Cell",  {username: username, ChurchName: ChurchName,events: events})}}>
                            <Text style={{color:"rgba(100, 200, 255, 1)",fontSize:16}}>Update</Text>
                        </TouchableHighlight>

                        <TouchableHighlight  style={{width:"30%", alignItems:"center",justifyContent:"center", height:35, borderRadius:8}} underlayColor="rgba(70, 70, 70, 1)" onPress={() => {Keyboard.dismiss(); handleSubmit(username)}} >
                            {!showSubmitting ? <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:16}}>Create</Text>
                            :
                            <ActivityIndicator  color=" rgba(100, 200, 255, 1)"/> 
                            }
                        </TouchableHighlight>

                    </View>
                    <TouchableHighlight style={{width:"50%",alignSelf:"center", alignItems:"center",justifyContent:"center",flexDirection:"row", height:35, borderRadius:8}} underlayColor="rgba(70, 70, 70, 1)" onPress={toggleBottomSheet}>
                            <Text style={{color:"red",fontSize:16}}>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </BottomSheet>
        )
    }
   

 
    return (
        <View  style={{flex:1,justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>
    
            <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>


                    <View style={{height:60,marginTop:20, width:"100%", alignItems:"center",flexDirection:'row',paddingHorizontal:15, elevation:5, backgroundColor:"rgba(50, 50, 50, 1)"}}>
    
                        <MaterialIcons name="dashboard"  color={"rgba(240, 240, 240, 1)"} size={30}/>

                        <Text style={{fontSize:25,fontWeight:"800",color:"rgba(240, 240, 240, 1)", marginLeft:20}}>Dashboard</Text>
                    </View>


                    <ScrollView onScrollBeginDrag={() => setCreate(false)}>

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
                                <TouchableOpacity onPress={()=> {navigation.navigate("markAttendance", {username: username, ChurchName: ChurchName, events: events})}} style={{height:130, width:"48%",padding:10,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5}}>
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
                                <TouchableOpacity onPress={()=> {navigation.navigate("Prepare Sms", {username: username, ChurchName: ChurchName,events: events})}} style={{height:130, width:"48%",padding:15,alignItems:"center",  justifyContent:"space-between",borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", elevation:5 }}>
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
                                <TouchableOpacity onPress={() => toggleBottomSheet()} style={{height:130, width:"48%",padding:5,alignItems:"center",justifyContent:"space-around",borderRadius:20, backgroundColor:"rgba(50, 50, 50, 1)", elevation:6 }}>
                                        <Ionicons name="add" color={"rgba(100, 200, 255, 1)"} size={50}/>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>Create Cell</Text>
                                </TouchableOpacity>
                            </>
                        
                        </View>
                        
                       
                    </View>

                </ScrollView>


                <View>
    
                    <View  style={{flexDirection:"row",backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:"space-between",paddingVertical:5,borderTopWidth:1,borderColor:"gray"}}>
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
              {isBottomSheetVisible && createCell()}
        </View>
    );
};


