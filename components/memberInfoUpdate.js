import React, { useState, useLayoutEffect, useEffect } from "react";
import { View,FlatList, Text, Image, TextInput, TouchableOpacity, TouchableHighlight,StatusBar, ScrollView, Alert } from "react-native";
import AddMembers from "./memberReg";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,collection,getDocs, doc } from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';



export default function UpdateMemberInfo ({route}){

    const {params} = route || {}

    const navigation = useNavigation()

    const [selectedMember, setSelectedMember]=useState(false)
    const [search, setSearch] = useState("")
    const [member, setMember] = useState(null)
    const [show, setShow] = useState(true);
   
    const [showMembers, setshowMembers] = useState(null)
    const [churchName, setchurchName] = useState(null)
  
    const [username, setUsername] = useState("");
    const db = getFirestore()
    const auth = getAuth()

    

               // Step 1: Retrieve user email from Firebase authentication
               const GetMember = async(Email) => {

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
                    setchurchName(church);
                    try {
                        // Reference to the UserDetails document
                        const userDetailsDocRef = doc(db, 'UserDetails', church.id);
                
                        // Reference to the Members subcollection within UserDetails
                        const membersCollectionRef = collection(userDetailsDocRef, 'Members');
                
                        // Get all documents from the Members subcollection
                        const querySnapshot = await getDocs(membersCollectionRef);
                
                        if (!querySnapshot.empty) {
                            // If documents are found, extract their data and update the state with the tasks
                            const tasks = querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data().Member}));
                            setshowMembers(tasks)
                
                    }else {
                        alert('No updates');
                    }
                }
                    catch (error) {
                        console.log("Error getting member documents:", error);
                    }
                    }else {
                        throw new Error("No church details found in database");
                    }

                }
          
    


    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
              setUsername(value)
              GetMember(value)
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        };
        checkLoginStatus()
      }, [db]);



   

    const searchQueryHandler = (text) => {
        if (text) {
           setSearch(text)

        } else {
          setSearch("")
          setSelectedMember(false)

        }
    };

        //function to get selected member
    const getMember =(first, second) =>{
        setMember(showMembers.filter(item => item.FirstName === first  && item.SecondName === second))
    }

    return(
        <View style={{flex:1,backgroundColor:"rgba(30, 30, 30, 1)"}}>  

                <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"} />
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor:"rgba(50, 50, 50, 1)", elevation: 5 }}>
                            <Ionicons name="arrow-back" size={35} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: params?.username, ChurchName: params.ChurchName, events: params.events})} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "space-around",flexDirection:"row", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                            <Text style={{ fontSize: 20, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Update Member Data</Text>
                            <Ionicons name="pencil-sharp" size={26} color={"rgba(240, 240, 240, 1)"} />
                        </View>
                </View>

            <View style={{padding:10}}>

            <View>
                <Searchbar  elevation={1}  style={{backgroundColor:"rgba(50, 50, 50, 1)", color:"white",marginBottom:5}}   value={search}  iconColor="rgba(240, 240, 240, 1)" onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>
            </View>

            
            <FlatList 

             data={showMembers?.filter(member => (member.FirstName && member.SecondName).includes(search))}
             key={(index,item)=> item.id}

             ListEmptyComponent={()=> 
                (show ? 
                <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Fetching Data ...</Text>
                </View>
                : 
                <View></View>
             )
            }


             renderItem={({item , index}) => {
                return(
                    <View style={{flex:1,paddingHorizontal:15,paddingVertical:7}}>
                        

                       <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>

                            <>
                                <TouchableHighlight onPress={()=> {setSearch(item.FirstName + " " + item.SecondName); setShow(false); getMember(item.FirstName ,item.SecondName); setSelectedMember(true)}} underlayColor="rgba(70, 70, 70, 1)" style={{height:50, width:"100%",paddingHorizontal:10,elevation:2, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                                    <><View style={{flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>
                                        {item.Image ?
                                                <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                :
                                                <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                    <Fontisto name="person"  size={20} color={"gray"}/>
                                                </View>
                                
                                        }
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)", marginLeft:20}}>{item.FirstName} {item.SecondName}</Text>
                                    </View>
                                    <MaterialIcons name="arrow-right" size={25} color="gray" />
                                    </>
                                </TouchableHighlight>
                            </>
                        </View>
                    </View>
             )}}
            />
          

            </View>
            
            
          
            {selectedMember && 
                <AddMembers show = {true} info={member} Id={churchName.id} Show={(value)=>setSelectedMember(value)}/>
            }
            

        </View>
    )
}