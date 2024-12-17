import React, {useEffect, useState} from "react";
import { View, Text,Image, FlatList, TouchableHighlight ,ToastAndroid} from "react-native";
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth,} from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MemberList ({route}){
    const {params} = route || {};
    const navigation = useNavigation()

    const [showMembers, setshowMembers] = useState([])
    const db = getFirestore()
    const auth = getAuth()
    const [Id, setId] = useState(null)
    const [seen, setSeen] = useState(true)

    const [search, setSearch] = useState("")

    const [username, setUsername] = useState("");


         const GetMember = async(email) => {
   
        // Step 2: Fetch church details based on user email
        const tasksCollectionRef = collection(db, 'UserDetails');
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
            // Filter tasks to find matching church based on user email
            const tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().userDetails
            }));

            const church = tasks.find(item => item.email === email);
            setId(church.id)

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
        }
    };



  
    const getMember =(first, second) =>{
        const Member = showMembers.filter(item => item.FirstName === first  && item.SecondName === second)
        navigation.navigate("Details", {member: Member , id : Id, username: params?.username, ChurchName: params.ChurchName, events: params.events})
    }

   
    return(
        <View style={{flex:1, backgroundColor:"rgba(30, 30, 30, 1)"}}>

            <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/> 

            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                    <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: params?.username, ChurchName: params.ChurchName,events: params.events})} />
                    <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Members List</Text>
                    <Ionicons name="people-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                </View>
            </View>

            <View style={{paddingHorizontal:15, marginBottom:10}}>
                <Searchbar  elevation={2}  style={{backgroundColor:"rgba(50, 50, 50, 1)", color:"white",marginBottom:5}}   value={search}  iconColor="rgba(240, 240, 240, 1)" onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search by name"/>
            </View>

            <View style={{flex:1 , justifyContent: showMembers?.length !== 0 ? "flex-start" : "center" , alignItems:"center"}}>
                {showMembers?.length !== 0 ?
                        <FlatList 

                        data =  {showMembers?.filter(member => 
                            member.FirstName && member.SecondName && 
                            (member.FirstName.toLowerCase().includes(search.toLowerCase()) || 
                            member.SecondName.toLowerCase().includes(search.toLowerCase()))
                        )}

                        ListEmptyComponent={()=>(
                        <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Not Found!</Text>
                        </View>
                        )}

                        keyExtractor={(item)=> item.id}
                        renderItem={({item , index}) => {
                            return(

                                <View style={{flex:1,paddingHorizontal:15,paddingVertical:8}}>
                                                        

                                <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                                
                                        <>
                                            <TouchableHighlight onPress={()=>{getMember(item.FirstName, item.SecondName)}} underlayColor="rgba(70, 70, 70, 1)" style={{height:50, width:"100%",paddingHorizontal:10,elevation:2, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                                                <><View style={{flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>
                                                    {item.Image ?
                                                                <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                                :
                                                                <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                                    <Fontisto name="person"  size={20} color={"gray"}/>
                                                                </View>
                                                
                                                    }
                                                    <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)",marginLeft:20}}>{item.FirstName} {item.SecondName}</Text>
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
                        <View style={{alignItems:"center",justifyContent:"center", backgroundColor:'rgba(100, 100, 100, 0.2)',width:230, height:45, borderRadius:10}}>
                            <Text style={{color:"white"}}>{ seen ? "Loading ..." : "No Members"}</Text>
                        </View>
                    }
            </View>
        </View>
    )
}