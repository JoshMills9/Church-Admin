import React ,{useLayoutEffect,useEffect, useState} from "react";
import { View, Text ,StatusBar ,TextInput, ToastAndroid,Alert,FlatList,Image, TouchableOpacity, TouchableHighlight} from "react-native";
import *  as SMS from 'expo-sms'

import { Ionicons } from '@expo/vector-icons';
import { RadioButton, Searchbar } from "react-native-paper";

import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';


import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SendSMS({navigation, route}){

    const {username, ChurchName, events} = route.params

    const [search, setSearch] = useState("")
    const [sms, setSms] = useState("")
    const [show, setShow] = useState(false)
    const [Members, setMembers] = useState('')
    const [showMembers, setshowMembers] = useState(null)
    const [getNumber, setGetNumber] = useState(null)
    const db = getFirestore()
    const auth = getAuth()
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [Show, setshow] = useState(false)




         const getMember = async(email) => {
   
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


   
    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
              getMember(value)
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        };
        checkLoginStatus()
      }, [db]);



    const sendSMS = async () => {
        try {
          await SMS.sendSMSAsync(
            getNumber, // Array of recipient phone numbers
            sms // Message body
          );
          ToastAndroid.show('Sms sent successfully!', ToastAndroid.SHORT);
          setGetNumber("")
          setSearch("")
        } catch (error) {
          Alert.alert('Error', 'Failed to send SMS');
        }
      };
      
      
     


    const searchQueryHandler = (text) => {
        if (text) {
           setSearch(text)
        } else {
          setSearch("")
          setshow(false)
          setShow(false)
          setMembers('')
        }
    };

    useLayoutEffect(()=>{
        if(showMembers !== null && Members === "All"){
            const number = showMembers.map(number => number.Number1)
            setGetNumber(number)
          
        }
    },[Members])
    


    return(
        <View style={{flex:1, justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>

                <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"} />
                <View>

                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Prepare SMS</Text>
                                <Ionicons name="chatbubbles-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                        </View>
                 

                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingHorizontal:10,marginBottom:15}}>

                             {Show ?
                                <Searchbar iconColor="rgba(240, 240, 240, 1)"  elevation={2} style={{backgroundColor:"rgba(50, 50, 50, 1)",marginBottom:6}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>
                            
                                :
                                <>
                                <View style={{ width:"90%"}}>
                                    <ButtonGroup
                                        buttons={['GENERAL', 'BIRTHDAY', 'PLEDGE','ABSENTEES']}
                                        selectedIndex={selectedIndex}
                                        onPress={(value) => {
                                            setSelectedIndex(value);
                                        }}
                                        buttonContainerStyle={{borderColor:"gray"}}
                                        containerStyle={{  elevation:5, borderBottomLeftRadius:15,borderTopLeftRadius:15, borderColor:"dimgray",  backgroundColor:"rgba(50, 50, 50, 1)"}}
                                        selectedButtonStyle={{backgroundColor:" rgba(100, 200, 255, 0.8)"}}                      
                                        />
                                </View>


                            <View style={{ width:"15%",backgroundColor:"rgba(50, 50, 50, 1)",height:39,alignItems:"center",justifyContent:"center",elevation:4, borderTopRightRadius:15,borderBottomRightRadius:15}}>
                                <TouchableOpacity onPress={()=> setshow(true)}>
                                    <Ionicons name="search" size={28} color={"rgba(240, 240, 240, 1)"}/>
                                </TouchableOpacity>
                            </View>
                            </>
                            }
                        </View>

                        {!Show && <View style={{flexDirection:"row",alignItems:"center",paddingHorizontal:20}}>
                            <Text style={{fontSize:15,color:"rgba(240, 240, 240, 1)"}}>Select All</Text>
                            <RadioButton color="navy"  status={Members === "All" ? "checked" : "unchecked"}  onPress={()=> { Members === "" ? (setMembers("All"), setSearch('All Members'), setshow(true)) : (setMembers(""), setSearch('')) }} />
                        </View>}
                      
                </View>

          
            <FlatList 

            data = {showMembers?.filter(member => 
                member.FirstName && member.SecondName && 
                (member.FirstName.toLowerCase().includes(search.toLowerCase()) || 
                member.SecondName.toLowerCase().includes(search.toLowerCase()))
            )}

             keyExtractor={(item)=> item.FirstName&&item.SecondName}

             ListEmptyComponent={()=>(
                <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                   <Text style={{fontSize:15,fontWeight:"300", color:"rgba(240, 240, 240, 1)"}}>{search ? "" : "Fetching Data ..."}</Text>
                </View>
                
                )}
   


             renderItem={({item , index}) => {
                return(
                    <View style={{flex:1,marginVertical:5, marginHorizontal:10}}>
                                            
                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>

                        <>
                            <TouchableHighlight onPress={()=>{setSearch(item.FirstName + " " + item.SecondName); setShow(false);setshow(true); setGetNumber(item.Number1)}} underlayColor="rgba(70, 70, 70, 1)"  style={{height:50, width:"100%",paddingHorizontal:10,elevation:2, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }} >
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
           


            <View style={{marginTop:10}}>
                <View style={{backgroundColor:"rgba(50, 50, 50, 1)", width:"100%", justifyContent:"center",height:70}}>
                    
                    <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
                        <TextInput multiline={true} style={{width:"80%",paddingHorizontal:20, height:50, borderColor:"gray",borderWidth:1,color:"rgba(240, 240, 240,1)", borderRadius:50,fontSize:18, fontWeight:"500"}}  value={sms} onChangeText={(txt) => setSms(txt)} placeholder="Send Message" placeholderTextColor={"gray"}/>
                        
                        <TouchableOpacity onPress={()=> {sendSMS();setSms("")}} >
                            <Ionicons name="arrow-up-circle-sharp" size={50}  color={"rgba(240, 240, 240, 0.5)"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}