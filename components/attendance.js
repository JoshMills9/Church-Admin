import React, { useState, useLayoutEffect, useEffect } from "react";
import { View,FlatList, Text, Image, TextInput, TouchableOpacity, TouchableHighlight,StatusBar, ScrollView, Alert } from "react-native";
import AddMembers from "./memberReg";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,collection,getDocs, doc } from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { CheckBox } from "@rneui/themed";




export default function Attendance ({navigation}){

    const [selectedMember, setSelectedMember]=useState(false)
    const [search, setSearch] = useState("")
    const [member, setMember] = useState(null)
    const [show, setShow] = useState(true);
    const [check1, setCheck1] = useState(false);
    const [showMembers, setshowMembers] = useState(null)
    const [churchName, setchurchName] = useState(null)
  

    const db = getFirestore()
    const auth = getAuth()
    
    useLayoutEffect(() =>{
               // Step 1: Retrieve user email from Firebase authentication
               const getMember = async() => {

                    const user = auth.currentUser;
                if (!user) {
                    throw new Error("No user signed in");
                }
                const userEmail = user.email;
        
                // Step 2: Fetch church details based on user email
                const tasksCollectionRef = collection(db, 'UserDetails');
                const querySnapshot = await getDocs(tasksCollectionRef);
        
                if (!querySnapshot.empty) {
                    // Filter tasks to find matching church based on user email
                    const tasks = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().userDetails
                    }));
        
                    const church = tasks.find(item => item.email === userEmail);
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
                        console.log('No updates');
                    }
                }
                    catch (error) {
                        console.log("Error getting member documents:", error);
                    }
                    }else {
                        throw new Error("No church details found in database");
                    }

                }
                getMember()
    }, [db,churchName])


   

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
        <View style={{flex:1,}}>  

                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "white", elevation: 5 }}>
                            <Ionicons name="arrow-back" size={35} color={"navy"} onPress={() => navigation.replace('ModalScreen',{username:"", ChurchName:""})} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "center", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "white" }}>
                            <Text style={{ fontSize: 24, color: "navy", fontWeight: "800" }}>Record Church Attendance</Text>
                        </View>
                </View>

            <View style={{padding:10}}>

            <View>
                <Searchbar  elevation={1} style={{backgroundColor:'white',marginBottom:6}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>
            </View>

            
            <FlatList 

             data={showMembers?.filter(member => (member.FirstName && member.SecondName).includes(search) )}
             key={(index,item)=> item.id}

             ListEmptyComponent={()=> 
                (show ? 
                <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:15,fontWeight:"300"}}>Fetching Data ...</Text>
                </View>
                : 
                <View></View>
             )
            }


             renderItem={({item , index}) => {
                return(
                    <View style={{flex:1,paddingHorizontal:20}}>
                        

                       <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <View style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:"white",elevation:2}}>
                                {item.Image ?
                                            <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                            :
                                            <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                <Fontisto name="person"  size={20} color={"gray"}/>
                                            </View>
                             
                                }
                                
                                <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center"}} adjustsFontSizeToFit={true}>{item.FirstName} {item.SecondName}</Text>
                            
                            </View>

                           
                            <CheckBox
                                center={true}
                                checked={check1}
                                onPress={() => setCheck1(!check1)}
                                size={24}
                                checkedColor="navy"
                                containerStyle={{backgroundColor:"white",width:"15%", borderLeftWidth:1, borderColor:"lightgray", borderTopRightRadius:50,borderBottomRightRadius:50, alignSelf:"center",}}
                                uncheckedColor="gray"
                                />
                                                    

                           
                        </View>
                    </View>
             )}}
            />
          

            </View>
            
        
            

        </View>
    )
}