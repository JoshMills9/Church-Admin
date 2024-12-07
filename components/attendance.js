import React, { useState, useRef, useEffect } from "react";
import { View,FlatList, Text,PanResponder, Image,ToastAndroid,Dimensions, TouchableHighlight,StatusBar, ScrollView, Alert, ActivityIndicator } from "react-native";
import AddMembers from "./memberReg";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,collection,getDocs, doc, setDoc , addDoc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { CheckBox } from "@rneui/themed";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FAB , Badge} from "react-native-paper";


export default function Attendance ({navigation, route}){

    const {username, ChurchName, events} = route.params || {}
  
    const [selectedMember, setSelectedMember]=useState(false)
    const [search, setSearch] = useState("")
    const [member, setMember] = useState(null)
    const [Show, setshow] = useState(true);
    const [check1, setCheck1] = useState(false);
    const [showMembers, setshowMembers] = useState(null)
    const [churchName, setchurchName] = useState(null)
    const [save, setSave] = useState(false);


    const db = getFirestore()
    const auth = getAuth()



    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(false)
       // Handle date change
       const onChange = (event, selectedDate) => {
           if(event.type === 'dismissed') {
               setShow(false)
               setSelected(false)
               return;
           }else{
               const currentDate = selectedDate || date;
               setShow(false);
               setDate(currentDate);
           };
       }


       // Show the date picker
       const showDatePicker = () => {
           setShow(true);
           setSelected(true)
       };
      
        const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth = date.getDate();
        const monthOfYear = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();
    
        let suffix = 'th';
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = 'rd';
        }
        const formattedDate = `${dayOfMonth}${suffix} ${monthOfYear}, ${year}`;


    
   
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



                //marking attendance functionality
                const [AttendanceList, setAttendanceList] = useState([]);

                const handleAttendance = (id) => {
                    setshowMembers((prevMembers) => {
                        const updatedMembers = prevMembers.map((member) => {
                            if (member.id === id) {
                                const updatedMember = { ...member, Check: !member.Check }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setAttendanceList((prevList) => [updatedMember, ...prevList]);
                                } else {
                                    setAttendanceList([]); // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                            }
                            return member;
                        });
                        return updatedMembers;
                    });
                };
              


            //add attendance to db
        const markAttendance = async(Email) => {
    
            if (AttendanceList.length !== 0 ){
                setSave(true)

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
            
                        // Reference to the UserDetails document
                    const userDetailsDocRef = doc(db, 'UserDetails', church.id);
            
                    // Reference to the Members subcollection within UserDetails
                    const membersCollectionRef = collection(userDetailsDocRef, 'Attendance');
            
                    // Set a document within the Members subcollection
                    await setDoc(doc(membersCollectionRef), {AttendanceList,Date:{formattedDate}});
            
                    ToastAndroid.show("Attendance saved successful!", ToastAndroid.LONG);
                    setSave(false);
                    setClearAll(true)
                    setAttendanceList([])

                    } else {
                        throw new Error("No church details found in database");
                    }
            
                
            
                } catch (error) {
                    console.error("Error adding document: ", error);
                    ToastAndroid.show(`Error saving attendance: ${error.message}`, ToastAndroid.LONG);
                    setSave(false)
                }
        } else{
            ToastAndroid.show("Please mark attendance!", ToastAndroid.LONG);
            return;
        }
       
        }
        


        //handle clear marked items
        const [marked, setMarked] = useState([ ]);
        const [clearAll, setClearAll] = useState(false);
        const [selectAll, setSelectAll] = useState(false);


        useEffect(() => {
            if(selectAll){
                const markedAll = () =>{
                    if (showMembers) {
                        const updatedList = showMembers.map(member => {
                            // Create a new object with Check set to true for each member
                            return { ...member, Check: true };
                        });
            
                        // Update the state with the modified list
                        setshowMembers(updatedList);
                        setAttendanceList(updatedList);
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
                        setAttendanceList([])
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
            
        },[save, clearAll, selectAll]
    )
   



    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
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

        //gesture handler logic
            const [positionY, setPositionY] = useState(720); // Only track Y position
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
        <View style={{flex:1,backgroundColor:"rgba(30, 30, 30, 1)"}}>  

                <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>
                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Record Church Attendance</Text>
                                <Ionicons name="book-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                        </View>
                  

            <View style={{padding:10, flex:1}}>

            <View>
                <Searchbar  elevation={1} style={{backgroundColor:"rgba(50, 50, 50, 1)",marginBottom:6}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={"rgba(240, 240, 240, 1)"} iconColor="rgba(240, 240, 240, 1)" placeholder="Search by name"/>
            </View>



            <View style={{flexDirection:"row",width:"100%" ,marginVertical:10, alignItems:"center",justifyContent:"space-evenly"}}>
                <View style={{flexDirection:"row" ,justifyContent:selected ? "space-around" : "flex-start" ,alignItems:"center"}}>
                    <TouchableHighlight  underlayColor="rgba(70, 70, 70, 1)"  onPress={showDatePicker} style={{flexDirection:"row",paddingVertical:3,paddingHorizontal:5, borderRadius:8, alignItems:"center"}}>
                        <>
                        <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:13}}>{selected ? formattedDate : "Select date"}</Text>

                        <MaterialIcons name={"keyboard-arrow-down"} size={25} color="gray" />
                        </>    
                    </TouchableHighlight>
                </View>

                <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setSelectAll(true)} style={{flexDirection:"row",borderRadius:10, width:"20%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Select all</Text>         
                </TouchableHighlight>

                <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setClearAll(true)} style={{flexDirection:"row",borderRadius:10, width:"20%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Clear all</Text>         
                </TouchableHighlight>

                <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => markAttendance(username)} style={{flexDirection:"row", borderRadius:10, width:"20%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    {save ?  
                        <View style={{flexDirection:"row"}}>
                            <Text style={{color:" rgba(100, 200, 255, 1)"}}>Saving </Text>
                            <ActivityIndicator size={"small"} color={" rgba(100, 200, 255, 1)"} />
                        </View>
                        :    
                        <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>{"Save"}</Text>
                    }          
                </TouchableHighlight>
           
            </View>
            
            
            <FlatList 

            data = {showMembers?.filter(member => 
                member.FirstName && member.SecondName && 
                (member.FirstName.toLowerCase().includes(search.toLowerCase()) || 
                member.SecondName.toLowerCase().includes(search.toLowerCase()))
            )}
             showsVerticalScrollIndicator={false}
             key={(index,item)=> item.id && item.Check}

             ListEmptyComponent={()=> 
                (Show ? 
                <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Fetching Data ...</Text>
                </View>
                : 
                <View></View>
             )
            }


             renderItem={({item , index}) => {
                return(
                    <View style={{flex:1,paddingHorizontal:20,marginTop:10}}>
                        

                       <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                            <View style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:2}}>
                                {item.Image ?
                                            <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                            :
                                            <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                <Fontisto name="person"  size={20} color={"gray"}/>
                                            </View>
                             
                                }
                                
                                <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true}>{item.FirstName} {item.SecondName}</Text>
                            
                            </View>

                           
                            <CheckBox
                                center={true}
                                checked={item.Check}
                                onPress={() => {handleAttendance(item.id); setMarked(prevList => [...prevList , index])}}
                                size={24}
                                checkedColor="rgba(240, 240, 240, 1)"
                                containerStyle={{backgroundColor:"rgba(50, 50, 50, 1)",width:"15%", borderLeftWidth:1, borderColor:"gray", borderTopRightRadius:50,borderBottomRightRadius:50, alignSelf:"center",}}
                                uncheckedColor="gray"
                                />
                                                    

                           
                        </View>
                    </View>
             )}}
            />
          

            </View>
            
            {show && (<DateTimePicker testID="dateTimePicker" value={date} mode={"date"} 
             display={"calendar"} onChange={onChange} />
            )}
            
            <View {...panResponder.panHandlers}  style={[{position:"absolute",width:120, height:55,
                backgroundColor:"white",borderRadius:15,top: positionY, left: screenWidth - 110 }]}>
                    <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => navigation.navigate("AttendanceList", {username: username, ChurchName: ChurchName, events: events})} style={{color:"rgba(30, 30, 30, 1)",justifyContent:"center", alignItems:"center",width:"100%", height:"100%",borderRadius:15}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text>Attendance</Text>
                            <MaterialIcons name={"keyboard-arrow-right"} size={20} />
                        </View>
                    </TouchableHighlight>
            </View>
        </View>
    )
}