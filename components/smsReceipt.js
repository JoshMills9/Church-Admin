import React ,{useLayoutEffect, useState} from "react";
import { View, Text ,StatusBar ,TextInput, Platform,Alert,FlatList,Image, TouchableOpacity, TouchableHighlight} from "react-native";
import *  as SMS from 'expo-sms'

import { Ionicons } from '@expo/vector-icons';
import { RadioButton, Searchbar } from "react-native-paper";

import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';





export default function SmsReceipt({navigation}){

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

        
    }, [db,navigation,auth])

    const sendSMS = async () => {
        try {
          await SMS.sendSMSAsync(
            getNumber, // Array of recipient phone numbers
            sms // Message body
          );
          Alert.alert('Success', 'SMS sent successfully!');
          setGetNumber("")
          setSearch("")
        } catch (error) {
          Alert.alert('Error', 'Failed to send SMS');
        }
      };
      
      
     


    const searchQueryHandler = (text) => {
        if (text) {
           setSearch(text)
           setShow(true)
         
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
        <View style={{flex:1, justifyContent:"space-between"}}>

                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <View>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
                                <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "white", elevation: 5 }}>
                                    <Ionicons name="arrow-back" size={35} color={"rgba(0, 0, 128, 0.8)"} onPress={() => navigation.navigate('ModalScreen',{username:"", ChurchName:""})} />
                                </View>

                                <View style={{ height: 70, width: "80%", alignItems: "center", flexDirection:"row",justifyContent: "space-around", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "white" }}>
                                    <Text style={{ fontSize: 20, color: "rgba(0, 0, 128, 0.8)", fontWeight: "800" }}>SMS Receipt</Text>
                                    <Ionicons name="receipt" size={26} color={"rgba(0, 0, 128, 0.8)"} />
                                </View>
                        </View>

                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingHorizontal:10,marginBottom:15}}>

                             {Show ?
                                <Searchbar  elevation={1} style={{backgroundColor:'white',marginBottom:6}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>
                            
                                :
                                <>
                                <View style={{ width:"90%"}}>
                                    <ButtonGroup
                                        buttons={['GENERAL', 'TITHE', 'PLEDGE']}
                                        selectedIndex={selectedIndex}
                                        onPress={(value) => {
                                            setSelectedIndex(value);
                                        }}
                                        containerStyle={{  elevation:5, borderBottomLeftRadius:15,borderTopLeftRadius:15}}
                                        selectedButtonStyle={{backgroundColor:"rgba(0, 0, 128, 0.8)"}}                      
                                        />
                                </View>


                            <View style={{ width:"15%",backgroundColor:"white",height:40,alignItems:"center",justifyContent:"center",elevation:5, borderTopRightRadius:15,borderBottomRightRadius:15}}>
                                <TouchableOpacity onPress={()=> setshow(true)}>
                                    <Ionicons name="search" size={28} color={"gray"}/>
                                </TouchableOpacity>
                            </View>
                            </>
                            }
                        </View>
                      

                </View>

            {show && <View style={{flexDirection:"row",alignItems:"center",paddingHorizontal:20}}>
                <Text style={{fontSize:15}}>Select All</Text>
                <RadioButton color="navy"  status={Members === "All" ? "checked" : "unchecked"}  onPress={()=> { Members === "" ? (setMembers("All"), setSearch('All Members'), setShow(false)) : (setMembers(""), setSearch('')) }} />
            </View>
            }       
            
            <FlatList 

             data={showMembers?.filter(member => (member.FirstName && member.SecondName) && (member.FirstName && member.SecondName).includes(search) )}

             ListEmptyComponent={()=>(
                <>{!Show && <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:15,fontWeight:"300"}}>Fetching Data ...</Text>
             </View>
                 }</>
                )}
   


             keyExtractor={(item)=> item.FirstName&&item.SecondName}
             renderItem={({item , index}) => {
                return(
                    <View style={{flex:1,marginVertical:5, marginHorizontal:10}}>
                                            

                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                        <View style={{height:40,width:"18%",justifyContent:"center", borderTopLeftRadius:20,borderBottomRightRadius:50,padding:10, backgroundColor:"white",elevation:5}}>
                            {item.Image ?
                                        <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                        :
                                        <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                            <Fontisto name="person"  size={20} color={"gray"}/>
                                        </View>
                        
                            }
                        </View>

                        <>
                            <TouchableHighlight onPress={()=>{setSearch(item.FirstName + " " + item.SecondName); setShow(false); setGetNumber(item.Number1);setshow(true)}} underlayColor="#ccc" style={{height:40, width:"80%",paddingLeft:25, paddingRight:10, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:80,borderBottomLeftRadius:15, backgroundColor:"white" }}>
                                <><Text style={{fontSize:18,fontWeight:"400"}}>{item.FirstName} {item.SecondName}</Text>
                                <MaterialIcons name="arrow-right" size={25} color="gray" />
                                </>
                            </TouchableHighlight>
                        </>
                    </View>
                    </View>
             )}}
            />
           


            <View style={{marginTop:10}}>
                <View style={{backgroundColor:"lightgray", width:"100%", justifyContent:"center",height:70}}>
                    
                    <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
                        <TextInput multiline={true} style={{width:"80%",paddingHorizontal:20, height:50, backgroundColor:"white", borderRadius:50,fontSize:18, fontWeight:"500"}} value={sms} onChangeText={(txt) => setSms(txt)} placeholder="Send Message" placeholderTextColor={"gray"}/>
                        
                        <TouchableOpacity onPress={()=> {sendSMS();setSms("")}} >
                            <Ionicons name="arrow-up-circle-sharp" size={50}  color={"white"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}