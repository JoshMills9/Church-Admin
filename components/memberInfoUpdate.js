import React, { useState, useLayoutEffect, useEffect } from "react";
import { View,FlatList, Text, Image,ToastAndroid,useColorScheme,  TouchableHighlight} from "react-native";
import AddMembers from "./memberReg";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,collection,getDocs, doc } from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";


import AsyncStorage from '@react-native-async-storage/async-storage';



export default function UpdateMemberInfo ({route}){

    const {params} = route || {}

    const navigation = useNavigation()

    const [selectedMember, setSelectedMember]=useState(false)
    const [search, setSearch] = useState("")
    const [member, setMember] = useState(null)
    const [show, setShow] = useState(true);
    const [seen, setSeen] = useState(true)
    const [showMembers, setshowMembers] = useState([])
    const [churchName, setchurchName] = useState(null)
    const isDarkMode = useColorScheme() === 'dark';
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
                            if(tasks){
                                setshowMembers(tasks)
                            }
                    }else {
                        ToastAndroid.show("Please register a member!", ToastAndroid.SHORT);
                        setSeen(false)
                        return;

                    }
                }
                    catch (error) {
                        console.log("Error getting member documents:", error);
                    }
                    }else {
                        throw new Error("No church details found in database");
                    }

                }
          
    


    useLayoutEffect(() => {
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
        <View style={{flex:1,backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' }}>  

                <StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF' }/> 

                    <View style={{height:70,width:"100%",marginTop:20,borderBottomWidth:0.5, borderColor:"gray", alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' ,justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                        <Ionicons name="arrow-back" size={25} style={{width:40,}} color={isDarkMode ? '#FFFFFF' : '#000000' } onPress={() => navigation.navigate('ModalScreen',{username: params?.username, ChurchName: params.ChurchName,events: params.events})} />
                        <Text style={{ fontSize: 22, color: isDarkMode ? '#FFFFFF' : '#000000', fontWeight: "800" }}>Update Member Data</Text>
                        <Ionicons name="pencil-sharp" size={24} color={isDarkMode ? '#FFFFFF' : '#000000' } />

                    </View>

            <View style={{padding:8}}>
                <Searchbar  elevation={2}  style={{backgroundColor: isDarkMode ? "rgba(50, 50, 50, 1)" : "white", color:isDarkMode ? '#FFFFFF' : '#000000' ,marginBottom:5}}   value={search}  iconColor={isDarkMode ? '#FFFFFF' : '#000000'}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search by name"/>
            </View>

            <View style={{flex: selectedMember ? 0 : 1 ,paddingBottom: selectedMember ? 0 : 20,  justifyContent: showMembers?.length !== 0 ? "flex-start" : "center" , alignItems: "center"}}>
                    {showMembers?.length !== 0 ?

                            <FlatList
                            data = {showMembers?.filter(member => 
                                member.FirstName && member.SecondName && 
                                (member.FirstName.toLowerCase().includes(search.toLowerCase()) || 
                                member.SecondName.toLowerCase().includes(search.toLowerCase()))
                            )}

                            key={(index,item)=> item.id}

                            ListEmptyComponent={()=> 
                                (show ? 
                                <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                                    <Text style={{fontSize:15,fontWeight:"300",color:isDarkMode ? '#FFFFFF' : '#000000'}}>Not Found!</Text>
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
                                                <TouchableHighlight onPress={()=> {setSearch(item.FirstName + " " + item.SecondName); setShow(false); getMember(item.FirstName ,item.SecondName); setSelectedMember(true)}} underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}style={{height:50, width:"100%",paddingHorizontal:10,elevation:4, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:isDarkMode ?  "rgba(50, 50, 50, 1)" : '#FFFFFF'}}>
                                                    <><View style={{flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>
                                                        {item.Image ?
                                                                <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                                :
                                                                <View style={{width:30,height:30,borderColor:"gray" ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                                    <Fontisto name="person"  size={20} color={"gray"}/>
                                                                </View>
                                                
                                                        }
                                                        <Text style={{fontSize:18,fontWeight:"400",color:isDarkMode ? '#FFFFFF' : '#000000' , marginLeft:20}}>{item.FirstName} {item.SecondName}</Text>
                                                    </View>
                                                    <MaterialIcons name="arrow-right" size={25} color="gray" />
                                                    </>
                                                </TouchableHighlight>
                                            </>
                                        </View>
                                    </View>
                            )}}
                            />
                            :
                            <View style={{alignItems:"center",justifyContent:"center", backgroundColor:isDarkMode ? 'rgba(100, 100, 100, 0.2)' : "lightgray",width:230, height:45, borderRadius:10}}>
                                <Text style={{color:isDarkMode ? "white" :"black"}}>{ seen ? "Loading ..." : "No Members"}</Text>
                            </View>
                        }
              </View>  
                
        
            {selectedMember && 
               <AddMembers show = {true} info={member} Id={churchName.id} Show={(value)=>setSelectedMember(value)}/>
               }
        </View>
    )
}