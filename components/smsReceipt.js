import React ,{useRef,useEffect, useState} from "react";
import { View, Text ,PanResponder,Dimensions,TextInput, ToastAndroid,Alert,FlatList,Image, TouchableOpacity, TouchableHighlight} from "react-native";
import *  as SMS from 'expo-sms'
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { RadioButton, Searchbar } from "react-native-paper";

import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';
import { CheckBox } from "@rneui/themed";




import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SendSMS({navigation, route}){

    const {username, ChurchName, events} = route.params

    const [search, setSearch] = useState("")
    const [sms, setSms] = useState("")
    const [show, setShow] = useState(false)
    const [Members, setMembers] = useState('')
    const [showMembers, setshowMembers] = useState([])
    const [messageStatus, setMessageStatus] = useState(false)
    const db = getFirestore()
    const auth = getAuth()
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [Show, setshow] = useState(false)
    const [smsList, setSmsList] = useState([]);
    const [seen, setSeen] = useState(true)

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
                        setshow(false)
            }else {
                ToastAndroid.show("Please register a member!", ToastAndroid.SHORT);
                setSeen(false)
                return
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
      }, []);



    const defaultHeader = `•| ${ChurchName?.ChurchName?.toUpperCase()} |•`;

  
    const sendSMS = async () => {

        if(!ChurchName?.ChurchName){
            return ToastAndroid.show("No Church Name Found!, Visit Home Screen and try again!",  ToastAndroid.LONG)
        }else if(sms === "" ){
            return ToastAndroid.show("Please type a message to send!", ToastAndroid.LONG)
        }else if(smsList.length === 0){
            return ToastAndroid.show("Please select recipients",  ToastAndroid.LONG)
        }else{
            setMessages(prevList => [{sms, defaultHeader, smsList , date }, ...prevList])
        }

        try {
          await SMS.sendSMSAsync(
            smsList, // Array of recipient phone numbers
            `${defaultHeader}\n\n${sms}` // Message body
          );
          ToastAndroid.show('Sms sent successfully!', ToastAndroid.SHORT);
          setSmsList([])
          setClearAll(true)
          setSms("")
        } catch (error) {
          Alert.alert('Error', error.message);
          setMessageStatus(false)
        }
      };



      let date = new Date();
      const monthsOfYear1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayOfMonth1 = date.getDate();
      const monthOfYear1 = monthsOfYear1[date.getMonth()];
      const year1 = date.getFullYear();
  
      let suffix = 'th';
      if (dayOfMonth1 === 1 || dayOfMonth1 === 21 || dayOfMonth1 === 31) {
          suffix = 'st';
      } else if (dayOfMonth1 === 2 || dayOfMonth1 === 22) {
          suffix = 'nd';
      } else if (dayOfMonth1 === 3 || dayOfMonth1 === 23) {
          suffix = 'rd';
      }

      date = `${dayOfMonth1}${suffix} ${monthOfYear1} , ${year1}`
      const [messages, setMessages] = useState([ ]);

      
    
        const handleSave = async (m) => {
            try {
             await AsyncStorage.setItem('SMS Receipt', JSON.stringify(m ? m : messages));
                
            } catch (e) {
            console.error('Failed to save the data to the storage', e);
            }
        };
        
    

       //get sms sent from storage
    useEffect(()=>{
        const getSms = async () => {
            try {
              const value = await AsyncStorage.getItem('SMS Receipt');
              if (value !== null) {
                setMessages(JSON.parse(value))
              } else {
                return
              }
            } catch (error) {
              console.error('Error checking sms', error);
            }
          };
          getSms();
    }, [])
      
      
     


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




                //handle clear marked items
                const [marked, setMarked] = useState([ ]);
                const [clearAll, setClearAll] = useState(false);
                const [selectAll, setSelectAll] = useState(false);


                useEffect(() => {
                    if(selectAll){
                        const markedAll = () =>{
                            if (showMembers) {
                                const updatedList = showMembers.map(member => {
                                const updatedMember = { ...member, Check: true }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setSmsList((prevList) => [updatedMember?.Number1 , ...prevList]);
                                } else {
                                    setSmsList([]); // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                                });
                    
                                setshowMembers(updatedList);
                                setSelectAll(false); // Reset the selectAll flag
                            }
                        };

                        markedAll();
                    
                    }else if(clearAll && selectAll === false) {
                        const clearAll = () =>{
                            if (showMembers) {
                                const updatedList = showMembers.map(member => {
                                    // Create a new object with Check set to true for each member
                                    return { ...member, Check: false };
                                });
                    
                                // Update the state with the modified list
                                setshowMembers(updatedList);
                                setSmsList([])
                                setClearAll(false); // Reset the selectAll flag
                            }
                        };

                        clearAll();
                    } else if (clearAll){
                        const clearMarked = () =>{
                            if (showMembers){
                            const updatedList = [...showMembers];
                            // Update the Check property of items at marked indices
                            marked.forEach(i => {
                                if (updatedList[i]) {
                                    updatedList[i] = { ...updatedList[i], Check: false }; // Create a new object to avoid mutation
                                }
                        });
                        
                    // Update the state with the modified list
                    setshowMembers(updatedList);
                    setAttendanceList([])
                    setClearAll(false)
                    }
                    }
                    clearMarked()
                }
                    
                },[clearAll, selectAll]
            )



                //marking attendance functionality
               

                const handleAttendance = (id, number) => {
                    setshowMembers((prevMembers) => {
                        const updatedMembers = prevMembers.map((member) => {
                            if (member.id === id) {
                                const updatedMember = { ...member, Check: !member.Check }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setSmsList((prevList) => [updatedMember?.Number1 , ...prevList]);
                                } else {
                                    setSmsList([]); // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                            }
                            return member;
                        });
                        return updatedMembers;
                    });
                };
              
            
                //gesture handler logic
                const [positionY, setPositionY] = useState(580); // Only track Y position
                const screenWidth = Dimensions.get('window').width; // Get screen width

            // PanResponder to handle the drag gesture
            const panResponder = useRef(
                PanResponder.create({
                onStartShouldSetPanResponder: () => true, // Enable touch response
                onMoveShouldSetPanResponder: () => true,  // Keep responding to move gestures

                onPanResponderMove: (event, gestureState) => {
                    // Only update Y position when dragging vertically
                    setPositionY(gestureState.moveY); 
                },

                onPanResponderRelease: () => {
                    // Optionally handle release if needed
                },
                })
            ).current;






    return(
        <View style={{flex:1, justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>
                <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>


                <View>

                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={28} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>SMS Receipt</Text>
                                <Ionicons name="chatbubbles-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                        </View>
                 

                        <View  style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingHorizontal:10,marginBottom:15}}>

                             {Show ?
                                <Searchbar iconColor="rgba(240, 240, 240, 1)"   elevation={2} style={{backgroundColor:"rgba(50, 50, 50, 1)",marginBottom:6}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>
                            
                                :
                                <>
                                <View style={{ width:"95%"}}>
                                    <ButtonGroup
                                        buttons={['GENERAL', 'TITHE', 'PLEDGE']}
                                        selectedIndex={selectedIndex}
                                        onPress={(value) => {
                                            setSelectedIndex(value);
                                        }}
                                        buttonContainerStyle={{borderColor:"gray"}}
                                        containerStyle={{  elevation:5, borderBottomLeftRadius:15,borderTopLeftRadius:15, borderColor:"dimgray",  backgroundColor:"rgba(50, 50, 50, 1)"}}
                                        selectedButtonStyle={{backgroundColor:" rgba(100, 200, 255, 0.8)"}}                      
                                        />
                                </View>


                            <View style={{ width:"10%",backgroundColor:"rgba(50, 50, 50, 1)",height:39,alignItems:"center",justifyContent:"center",elevation:4, borderTopRightRadius:15,borderBottomRightRadius:15}}>
                                <TouchableOpacity onPress={()=> setshow(true)}>
                                    <Ionicons name="search" size={28} color={"rgba(240, 240, 240, 1)"}/>
                                </TouchableOpacity>
                            </View>
                            </>
                            }
                        </View>

                        <View style={{flexDirection:"row",marginHorizontal:10 , justifyContent:"space-evenly", alignItems:"center"}}>
                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setSelectAll(true)} style={{flexDirection:"row",borderRadius:10, width:"30%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                                <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Select all</Text>         
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setClearAll(true)} style={{flexDirection:"row",borderRadius:10, width:"30%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                                <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Clear all</Text>         
                            </TouchableHighlight>
                        </View>
                        
                      
                </View>

                <View style={{flex:1 , justifyContent: showMembers?.length !== 0 ? "flex-start" : "center" , alignItems:"center"}}>
                {showMembers?.length !== 0 ?
                        <FlatList 

                        data = {showMembers?.filter(member => 
                            member.FirstName && member.SecondName && 
                            (member.FirstName.toLowerCase().includes(search.toLowerCase()) || 
                            member.SecondName.toLowerCase().includes(search.toLowerCase()))
                        )}
                        showsVerticalScrollIndicator={false}
                        key={(index,item)=> item.id}

                        ListEmptyComponent={()=> 
                            (Show ? 
                            <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Not Found!</Text>
                            </View>
                            : 
                            <View></View>
                        )
                        }


                        renderItem={({item , index}) => {
                            return(
                                <View style={{flex:1,paddingHorizontal:20,marginTop:10}}>
                                    

                                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                    
                                        <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                            style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:2}}>
                                            <>
                                                {item.Image ?
                                                            <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                            :
                                                            <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                                <Fontisto name="person"  size={20} color={"gray"}/>
                                                            </View>
                                            
                                                }
                                                
                                                <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true}>{item.FirstName} {item.SecondName}</Text>
                                            </>
                                        </TouchableHighlight>

                                    
                                        <CheckBox
                                            center={true}
                                            checked={item.Check}
                                            onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                            size={24}
                                            checkedColor="rgba(240, 240, 240, 1)"
                                            containerStyle={{backgroundColor:"rgba(50, 50, 50, 1)",width:"15%", borderLeftWidth:1, borderColor:"gray", borderTopRightRadius:50,borderBottomRightRadius:50, alignSelf:"center",}}
                                            uncheckedColor="gray"
                                            />
                                                                

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


            <View style={{marginTop:10}}>
                <View style={{ width:"100%", justifyContent:"center", maxHeight:200, marginBottom:8}}>
                    
                    <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
                        <TextInput  multiline={true} style={{width:"80%",paddingHorizontal:28,paddingVertical:10,textAlign:"justify", minHeight:45, elevation:1,backgroundColor:"rgba(50, 50, 50, 1)",color:"rgba(240, 240, 240,1)", borderRadius:50,fontSize:16, fontWeight:"300"}}   value={sms} onChangeText={(txt) => setSms(txt)} placeholder="Send Message" placeholderTextColor={"gray"}/>
                        
                        <TouchableOpacity style={{flexDirection:"row", alignSelf:"flex-end"}} onPress={()=>{handleSave(); sendSMS()}} >
                            <Ionicons name="arrow-forward-circle-sharp" size={50}  color={"rgba(240, 240, 240, 0.5)"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View {...panResponder.panHandlers}  style={[{position:"absolute",width:120, height:55,
                backgroundColor:"white",borderRadius:15,top: positionY, left: screenWidth - 110 }]}>
                    <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() =>{handleSave(); navigation.navigate("Sms Receipt", {username: username, ChurchName: ChurchName, events: events})}} style={{color:"rgba(30, 30, 30, 1)",justifyContent:"center", alignItems:"center",width:"100%", height:"100%",borderRadius:15}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{marginRight:5}}>Receipts</Text>
                            <Ionicons name={"receipt-outline"} size={24}  color={"rgba(50, 50, 50, 1)"} />
                        </View>
                    </TouchableHighlight>
            </View>
        </View>
    )
}
