import React, {useLayoutEffect, useState, useEffect} from "react";
import { View, Text, Pressable, Modal,ToastAndroid,useColorScheme, Linking,Image,ScrollView,RefreshControl, TouchableOpacity, FlatList, Alert, ImageBackground } from "react-native";
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';

import { MaterialIcons } from '@expo/vector-icons';
import { getAuth,} from 'firebase/auth';
import { ActivityIndicator, Badge ,FAB} from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import InvertedSemiCircularProgressBar from './semi-circle bar/SemiCircularProgressBar'
import { getFirestore,doc, addDoc, collection, getDoc, setDoc, updateDoc,getDocs } from "firebase/firestore";


import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    EasingNode,
    useAnimatedStyle,
    Easing

} from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Home(){

    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation()

    const [clicked, setclicked] = useState(false)
    const [attendance, setAttendance] = useState(null)
    const [username, setUsername] = useState("");
    const [ChurchName, setChurchName] = useState(null);
    const [totalNumberOfMembers, setTotalNumberOfMembers] = useState("");
    const [birthDayComing, setBirthdaysComing] = useState("");
    const [isActive, setisActive] = useState(true);
    const [newMember, setNewMember] = useState("");
    const [events, setEvents] = useState(null);
    const [NoOfEvent, setNoOfEvent] = useState(null)
    const auth = getAuth();
    const db = getFirestore();
    const [NoOfPleges, setNoOfPledges] = useState(null);
    const [showDetails, setShowDetails] = useState(false)


    const [loading,setLoading] = useState(false)
    const phoneNumber = '+233241380745';
    const message = "Assistance needed!";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const [refreshing, setRefreshing] = useState(true);
    const [Refreshing, setrefreshing] = useState(false)

    const date = new Date();
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthOfYear = monthsOfYear[date.getMonth()];


    //alert user abt wen tri
    useEffect(() =>{
        const sub = async() => {
            const value =  await AsyncStorage.getItem('subscription')
            if(value === 'true'){
                Alert.alert("Church Administrator", "Your trial period expires in 14 days!",
                [ {text: "Continue", onPress: async() => await AsyncStorage.removeItem("subscription")},
                  {text: "Subscribe", onPress: async() =>{await AsyncStorage.removeItem("subscription"); navigation.navigate("Payment",{username: username, ChurchName:ChurchName , events: events})}}
                ]
                )
            }
        }
        sub()
    },[])



    //app subscription function
    async function checkAccess() {
        const value = await AsyncStorage.getItem('isLogged In');
        const userEmail = await AsyncStorage.getItem('UserEmail');
        const token = await AsyncStorage.getItem('deviceToken');
        const deviceToken = JSON.parse(token)

    
        // Fetch church details based on user email
        const tasksCollectionRef = collection(db, 'UserDetails');
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
            const tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().userDetails
            }));

        const churchFound = tasks?.find(item => item.email === userEmail);

        const db = getFirestore();
              
        if(value === "true"){
            const tasksCollectionRef = collection(db, 'deviceTokens');
            const querySnapshot = await getDocs(tasksCollectionRef);

            if (!querySnapshot.empty) {
                // Filter tasks to find matching church based on user email
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                const church = tasks.find(item => item.ChurchName === churchFound?.ChurchName);
      
                const userDocRef = doc(db, "deviceTokens", church?.deviceToken);

                const userDocSnap = await getDoc(userDocRef);
            
                if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const now = new Date();
            
                const trialActive = now < new Date(userData.trialEnd);
                const subscriptionActive = userData.isPaid && now < new Date(userData.subscriptionEnd);
            
                if ((trialActive || subscriptionActive)) {
                    console.log("LoggedIn Access granted.");
                    return
                } else {
                    // Block access
                    const blockedDocRef = doc(db, "blockedDevices", church.deviceToken);
                    await setDoc(blockedDocRef, {
                    deviceToken: church.deviceToken,
                    blockedAt: now.toISOString(),
                    reason: "Trial and subscription expired."
                    });
            
                    Alert.alert(
                    "Subscription Expired!",
                    "Your subscription has expired. Please renew to continue using the app.",
                    [
                        { 
                        text: "Renew", 
                        onPress: () => navigation.navigate("Payment",{username: username, ChurchName:ChurchName , events: events})
                        }
                    ]
                    );
                    return
                }
                } else {
                    console.log("Device not registered.");
                    return
                }
            
            }
        }else if (!value){  
            const userDocRef = doc(db, "deviceTokens", deviceToken);
            const userDocSnap = await getDoc(userDocRef);
        
            if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const now = new Date();
        
            const trialActive = now < new Date(userData.trialEnd);
            const subscriptionActive = userData.isPaid && now < new Date(userData.subscriptionEnd);
        
            if ((trialActive || subscriptionActive)) {
                console.log("Signup Access granted.");
                return
            } else {
                // Block access
                const blockedDocRef = doc(db, "blockedDevices", deviceToken);
                await setDoc(blockedDocRef, {
                deviceToken: deviceToken,
                blockedAt: now.toISOString(),
                reason: "Trial and subscription expired."
                });
        
                Alert.alert(
                "Subscription Expired!",
                "Your subscription has expired. Please renew to continue using the app.",
                [
                    { 
                    text: "Renew", 
                    onPress: () => navigation.navigate("Payment",{username: username, ChurchName:ChurchName , events: events}) 
                    }
                ]
                );
            }
            } 
        }else {
            console.log("Device not registered.");
            }
    }}


    
    useEffect(() => {
        checkAccess();
        const interval = setInterval(checkAccess, 20000); // Check every 5 seconds
        return () => clearInterval(interval);
    },[])
      


    //useEffect to save list to Storage
  useEffect(() => {
    const handleSave = async () => {
        try {
          await AsyncStorage.setItem('Token', 'true');
      
        } catch (e) {
          console.error('Failed to save the data to the storage', e);
        }
      };
      handleSave();
    }, []);


    const [updated, setUpdated] = useState([])

  
    const getUpdates = async () => {
        try {
          const value = await AsyncStorage.getItem('update');
          if (value !== '') {
            setUpdated(JSON.parse(value))
          } else {
            console.log("no item")
          }
        } catch (error) {
          console.error('Error checking onboarding status', error);
        }
      };

    


        

    const getMember = async (userEmail) => {
        const value = await AsyncStorage.getItem('isLogged In');
        let update = { };

        try {
            // Fetch church details based on user email
            const tasksCollectionRef = collection(db, 'UserDetails');
            const querySnapshot = await getDocs(tasksCollectionRef);

            if (!querySnapshot.empty) {
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().userDetails
                }));
  
                const church = tasks?.find(item => item.email === userEmail);
                setChurchName(church);
          
                const handleSaveChurchDetails = async () => {
                    try {
                    await AsyncStorage.setItem('churchInfo', JSON.stringify(church));
                
                    } catch (e) {
                    console.error('Failed to save the data to the storage', e);
                    }
                };
                handleSaveChurchDetails();

               

                // Fetch events
                const userDetailsDocRef = doc(db, 'UserDetails', church?.id);
                const eventsCollectionRef = collection(userDetailsDocRef, 'Events');
                const eventsSnapshot = await getDocs(eventsCollectionRef);

                if (!eventsSnapshot.empty) {
                    const eventsData = eventsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().Events
                    }));

                    function parseFormattedDate(dateString) {
                        // Remove the suffix from the day (e.g., 'st', 'nd', 'rd', 'th')
                        const dayWithoutSuffix = dateString?.replace(/(\d)(st|nd|rd|th)/, '$1');
                      
                        // Parse the formatted date using Date constructor (after removing the suffix)
                        return new Date(dayWithoutSuffix);
                      }
                      
                      function filterFutureEvents(items) {
                        const currentDate = new Date();
                        
                        return items.filter(item => {
                          const eventDate = parseFormattedDate(item.StartDate);
                          return (eventDate.toLocaleDateString() >= currentDate.toLocaleDateString());  // Filter events in the future
                        });
                      }

                    const event = filterFutureEvents(eventsData)
                    setEvents(event);
                    setNoOfEvent(event.length);
                    update.NoOfEvent = event?.length;
                    update.event = event;
                    setclicked(true)
                }

                setRefreshing(false)

                // Fetch members
                const membersCollectionRef = collection(userDetailsDocRef, 'Members');
                const membersSnapshot = await getDocs(membersCollectionRef);

                if (!membersSnapshot.empty) {
                    const membersData = membersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().Member
                    }));
                    setTotalNumberOfMembers(membersData.length);
                    update.totalNumberOfMembers = membersData.length;


                    const date = new Date();
                    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthOfYear = monthsOfYear[date.getMonth()];
              

                    const monthAbr = monthOfYear.slice(0, 3);
                    const upcomingBirthdays = membersData.filter(member => {
                        const memberMonth = member.Date_Of_Birth.split(' ')[1];
                        return memberMonth === monthAbr;
                    });
                    setBirthdaysComing(upcomingBirthdays.length);
                    update.birthDayComing = upcomingBirthdays.length;

                    const newMembers = membersData.filter(member => {
                        const memberMonth = member.Registration_Date.split(' ')[1];
                        return memberMonth === monthAbr;
                    });
                    setNewMember(newMembers.length);
                    update.NewMember = newMembers.length;
                }

                 // Fetch pledges
                 try{
                    const pledgesCollectionRef = collection(userDetailsDocRef, "Pledges");
                    const pledgesSnapshot = await getDocs(pledgesCollectionRef);

                    if (!pledgesSnapshot.empty) {
                        const Data = pledgesSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data().Pledges,
                        }));
                        const pledge = Data.filter(i => i.Redeemed === false)
                        setNoOfPledges(pledge.length);
                        update.pledges = pledge.length;
                    
                        }
                    }catch(error){
                        console.log("Error fetching Pledges", error)
                    }


                    // Helper function to remove ordinal suffix (st, nd, rd, th)
                const removeOrdinalSuffix = (dateString) => {
                    if (dateString) {
                        // Ensure the dateString is a string
                        const dateStr = typeof dateString === 'string' ? dateString : dateString.toString();

                        // Remove ordinal suffix (st, nd, rd, th) from the day part of the date
                        return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Matches and removes ordinal suffixes like '7th'
                    }
                    return "";
                };

                // Convert month name to month number (e.g. "Dec" -> 12)
                const monthNameToNumber = (monthName) => {
                    const months = {
                        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
                        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
                    };
                    return months[monthName] || 0; // Return 0 if monthName is invalid
                };

                // Function to get the week number of the year
                const getWeekOfYear = (date) => {
                    const start = new Date(date.getFullYear(), 0, 1); // January 1st of the year
                    const diff = date - start;
                    const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds
                    const dayOfYear = Math.floor(diff / oneDay);
                    return Math.ceil((dayOfYear + 1) / 7); // Calculate the week number
                };



                // Fetch Attendance
                try {
                        const AttendanceCollectionRef = collection(userDetailsDocRef, 'Attendance');
                        const attendanceSnapshot = await getDocs(AttendanceCollectionRef);

                        // Check if snapshot is empty
                        if (!attendanceSnapshot.empty) {

                        const attendanceData = attendanceSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().Date,
                        }));

                        

                        const date = new Date();
                        const currentWeek = getWeekOfYear(date); // Get the current week number of the year
                        

                        const newAttendance = attendanceData.filter(attendance => {
                            if (!attendance.formattedDate) {
                                console.warn(`Missing formattedDate for attendance with ID: ${attendance.id}`);
                                return false; // Skip if no formattedDate is present
                            }

                            // Clean the date string (e.g. "7th Dec, 2024" -> "7 Dec, 2024")
                            const cleanedDateString = removeOrdinalSuffix(attendance.formattedDate);
                  

                            // Split the cleaned date string into day, month, year
                            const [day, month, year] = cleanedDateString.split(' ');

                               // Remove any trailing commas or spaces from the month part
                            const cleanMonth = month.replace(',', '').trim();


                            // Convert the month name to a number (e.g. "Dec" -> 12)
                            const monthNumber = monthNameToNumber(cleanMonth);

                            if (!monthNumber) {
                                console.warn(`Invalid month name: ${month}`);
                                return false; // Skip if month is invalid
                            }

                            // Reformat the date into "YYYY-MM-DD" format for reliable parsing
                            const formattedDateString = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
                        

                            // Parse the cleaned and formatted date string into a Date object
                            const attendanceDate = new Date(formattedDateString);

                            // Check if the date is valid
                            if (isNaN(attendanceDate.getTime())) {
                                console.warn(`Invalid date found: ${attendance.formattedDate}`);
                                return false; // Skip invalid dates
                            }

                            // Get the week number for the attendance date
                            const attendanceWeek = getWeekOfYear(attendanceDate);
                           

                            return attendanceWeek === currentWeek;
                    });
                    if(newAttendance){
                      
                        const attendanceData = attendanceSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().AttendanceList,
                        }));
                      
                        const attendance = attendanceData.filter(i => newAttendance.map(a => a.id).includes(i.id));
                        
                        let totalNumericCount = 0;  // Initialize the counter for numeric keys

                                // Loop through each object in attendance array
                                attendance.forEach(item => {
                                // Loop through each top-level key in the object (skip nested objects)
                                Object.keys(item).forEach(key => {
                                    // Only count the numeric keys at the top level of the object
                                    if (!isNaN(key) && typeof item[key] === 'object') {
                                    totalNumericCount++;  // Increment for each numeric key at the top level
                                    }
                                });
                            });
                  
                            
                            setAttendance(totalNumericCount)
                            update.attendance = totalNumericCount;
                        }
                     
                    }
                    } catch (error) {
                        console.error("Error fetching or processing attendance data:", error);
                    }
                }else{
                    ToastAndroid.show("No data found, check your network!", ToastAndroid.LONG);
                    setrefreshing(false)
                    return;
                };

    
            
                const handleSave = async (update) => {
                    try {
                    await AsyncStorage.setItem('update', JSON.stringify(update));
                
                    } catch (e) {
                    console.error('Failed to save the data to the storage', e);
                    }
                };
                handleSave(update);

                }catch(error){
                    ToastAndroid.show("Something went wrong, please try again!", ToastAndroid.SHORT);
                    console.log(error)
                
                }

    };



    
    useLayoutEffect(() => {
        setrefreshing(true)
        getUpdates();

        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            const networkState = await Network.getNetworkStateAsync();
            if (value !== '') {

              setUsername(value);
              const checkConnectivity = () => {
                    if(networkState.isConnected === true){
                        getUpdates()
                        getMember(value);
                    }else if (networkState.isConnected === false){
                        ToastAndroid.show("No internet connection, please check your network!", ToastAndroid.SHORT)
                    }
                };
        
                checkConnectivity();
        
                const interval = setInterval(checkConnectivity, 5000); // Check every 5 seconds
                return () => clearInterval(interval);
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        };
        checkLoginStatus()
      }, []);




    // Animation related state and functions
    const [animate, setAnimate] = useState(true);

    const slideAnimation = useSharedValue(0);

    useEffect(() => {
        const interval = setInterval(() => {
          startAnimation();
        }, 15000); // Repeat every 15 seconds
    
        return () => clearInterval(interval);
      }, [navigation,events]);
    
      const startAnimation = () => {
        slideAnimation.value = withTiming(-10, { duration: 180, easing: Easing.linear }, () => {
          slideAnimation.value = withTiming(10, { duration: 180, easing: Easing.linear }, () => {
            slideAnimation.value = withTiming(0, { duration: 130, easing: Easing.linear });
          });
        });
      };
    
      const slideInStyle = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: slideAnimation.value }],
        };
      });


      const [attendancePercent, setAttendancePercent] = useState()
      const [status, setStatus] = useState()

      const calculatePercent = (a, b) => {
         const percent = Math.min(Math.max(a / b, 0), 1) * 100;
         if(percent < 50){
            setStatus("low");
            setAttendancePercent(percent);
         }else if(percent >= 50){
            setStatus("high");
            setAttendancePercent(percent)
         }
      }

      useEffect(() => {
        if(totalNumberOfMembers && attendance){
            calculatePercent(attendance, totalNumberOfMembers)
        }
      },[totalNumberOfMembers, attendance])



      const showView = (id) => {
        if (showDetails === id){
            setShowDetails(null)
        }else{
            setShowDetails(id)
        }
      }


    return(
        <View  style={{flex:1, backgroundColor:isDarkMode ? '#121212' : '#FFFFFF', justifyContent:"space-between"}}>


                <StatusBar backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} style="auto"/>


                        <View style={{alignItems:"center",marginTop:20, flexDirection:"row", justifyContent:"space-between",marginBottom:5}}>
                                <View style={{height:60, width:"100%", alignItems:"center",flexDirection:'row',borderBottomWidth:0.5,borderColor:"gray", paddingHorizontal:15,elevation:5, backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>
                                    { !refreshing ?
                                        <Ionicons name="laptop-outline" size={33} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                                    : 
                                       <ActivityIndicator animating={refreshing} size={"small"} color={isDarkMode ? '#FFFFFF' : '#000000'}/>
                                    }

                                    <Text style={{fontSize:25,fontWeight:"700",color: isDarkMode ? '#FFFFFF' : '#000000', marginLeft:20}}>Church Administrator</Text>
                                </View>
                                   
                        </View>

                        <View   style={{flex:1, paddingHorizontal:15,width:"100%", marginTop:10}}>
                            <View style={{ marginBottom:10,borderRadius:15, width:"100%"}}>

                                        <View style={{width:'100%',elevation:9,backgroundColor:"rgba(50, 50, 50, 1)",height:150,borderWidth:2,elevation:3, borderColor:'#24739e', borderRadius:15}}>
                                        <FlatList 
                                            ListEmptyComponent={()=> ( 
                                                <ImageBackground source={ updated && updated.event && updated.event.length > 0 ? {uri : updated?.event[0]?.Image} : require("../assets/new1.jpg")} borderRadius={15} style={{width:'100%',backgroundColor:isDarkMode ? '#000000' : '#FFFFFF',height:146, borderRadius:15}}>         
                                                            <TouchableOpacity onPress={()=> { navigation.replace("Events",{id: "" ,image:null, name: "", guest: "", About: "", start:"",username: username, ChurchName: ChurchName, events: events  })}} style={{position:"absolute",width:100,justifyContent:"center",flexDirection:"row",alignItems:"center",top:5,left:5,borderRadius:10, height:30,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:18,fontWeight:"600",color:"white", marginRight:10}} numberOfLines={1} adjustsFontSizeToFit={true}>{updated?.event && updated.event.length > 0 ? "Upcoming" :  "Create"}</Text>
                                                                { !updated?.event && <MaterialIcons name="edit" size={20} color={"white"} />}
                                                            </TouchableOpacity>

                                                            <View style={{position:"absolute", width:150,justifyContent:"center",alignItems:"center",bottom:5,right:5,borderRadius:10, height:35,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:20,fontWeight:"800",color:"white"}} adjustsFontSizeToFit={true}>{updated && updated.event && updated.event.length > 0 ? updated?.event[0]?.EventName : "No Upcoming Event"}</Text>
                                                            </View>
                                        
                                                </ImageBackground>
                                            )}

                                            data={events?.sort((a, b) => b.createdAt - a.createdAt)}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({item, index})=>{
                                                return(
                                                    <View style={{width:"100%",backgroundColor:isDarkMode ? '#000000' : '#FFFFFF',height:146,borderRadius:15}}>
                                                        <Animated.View  style={[slideInStyle]}>
                                                                    
                                                            <Image source={{uri: item?.Image }}  style={{width:"100%",height:146,borderRadius:15}} resizeMode="cover" />

                                                            <TouchableOpacity onPress={()=> { navigation.replace("Events", {id: item.id ,image : item.Image, name: item.EventName, guest: item.Guests, About: item.About, start:item.StartDate , username: username, ChurchName: ChurchName, events: events})}} style={{position:"absolute",width:85,justifyContent:"center",flexDirection:"row",alignItems:"center",top:5,left:5,borderRadius:10, height:30,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:18,fontWeight:"600",color:"white", marginRight:10}}>edit</Text>
                                                                <MaterialIcons name="edit" size={20} color={"white"} />
                                                            </TouchableOpacity>

                                                            <View style={{position:"absolute", width:150,justifyContent:"center",alignItems:"center",bottom:5,right:5,borderRadius:10, height:35,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:18,fontWeight:"800",color:"white"}} adjustsFontSizeToFit={true}>{item.EventName}</Text>
                                                            </View>

                                                            <View style={{position:"absolute", width:120,justifyContent:"center",alignItems:"center", bottom:5,left:5,borderRadius:10, height:35,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:17,fontWeight:"800",color:"white"}} numberOfLines={1} adjustsFontSizeToFit={true}>{item.StartDate}</Text>
                                                            </View>
                                                        </Animated.View>
                                                    </View>
                                                )
                                            }}
                                            />
                                    </View>
                                        
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} >

                                <Pressable onPress={() => showView(1)}  style={{ width: "100%",alignItems:"center",justifyContent:"space-between", backgroundColor:'#24739e', height: showDetails === 1 ? 480 : 260, margin: 10, elevation: 5, borderRadius: 25, alignSelf: "center", padding: 10, }}>
                                    
                                    <View style={{borderBottomWidth:0.5,width:"100%",flex:1,alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:35,padding:8, borderColor:"rgba(240, 240, 240, 0.5)"}}>
                                        <View style={{flexDirection:"row"}}>
                                            <Ionicons name="people-circle-sharp" size={40} style={{elevation:3}} color={"white"}/>
                                            <View style={{marginLeft:10}}>
                                                <Text style={[styles.Update]}>{monthOfYear}</Text>
                                                <Text style={{fontSize:10, color:"rgba(240, 240, 240, 0.7)"}}>Monthly membership updates</Text>
                                            </View>
                                        </View>
                                        <MaterialIcons name={ showDetails ? "keyboard-arrow-up" :"keyboard-arrow-down"} size={26} color={"white"} />
                                    </View>

                                    <View style={{flex:3, width:"100%", marginBottom:35}}>
                                         <InvertedSemiCircularProgressBar high={"Present"} low={"Absent"} stats={"Members"} attendance={attendancePercent}  present={attendance ? attendance : updated?.attendance ||  0} percentage={totalNumberOfMembers ? totalNumberOfMembers : updated?.totalNumberOfMembers || 0} radius={140} strokeWidth={15} />
                                    </View>

                                    {(showDetails === 1)  && 
                                        <View style={{width:"100%",justifyContent:"space-between",alignItems:"center", flex:5}}>
                                            <View style={{flex:1,flexDirection:"row",marginVertical:15}}>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderRightWidth:0.5,paddingVertical:18 ,borderColor:"rgba(240, 240, 240, 0.5)",}}>
                                                    <Text style={{fontSize:13, color:"white",}}>New Members</Text>
                                                    <View style={{flexDirection:"row",}}>
                                                        <Text style={styles.updateTxt}>{newMember ? newMember : updated?.NewMember || 0}</Text>
                                                        <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>/month</Text>
                                                    </View>
                                                </View>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)", padding:18}}>
                                                    <Text style={{fontSize:13, color:"white",}}>Attendance</Text>
                                                    <View style={{flexDirection:"row",}}>
                                                        <Text style={styles.updateTxt}>{attendance ? attendance : updated?.attendance ||  0}</Text>
                                                        <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>/week</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{flex:1,flexDirection:"row" ,marginBottom:5 }}>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)",borderRightWidth:0.5, paddingVertical:18}}>
                                                        <Text style={{fontSize:13, color:"white",}}>Birthdays</Text>
                                                        <View style={{flexDirection:"row",}}>
                                                            <Text style={styles.updateTxt}>{birthDayComing ? birthDayComing : updated?.birthDayComing ||  0}</Text>
                                                            <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>/month</Text>
                                                        </View>
                                                </View>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)", padding:18}}>
                                                        <Text style={{fontSize:13, color:"white",}}>Events</Text>
                                                        <View style={{flexDirection:"row",}}>
                                                            <Text style={styles.updateTxt}>{NoOfEvent ? NoOfEvent : updated?.NoOfEvent || 0}</Text>
                                                            <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>Upcoming</Text>
                                                        </View>
                                                </View>
                                            </View>  
                                        </View>
                                    }
                                </Pressable>

                                <Pressable onPress={() => showView(2)}  style={{ width: "100%",alignItems:"center",justifyContent:"space-between", backgroundColor:'#24739e', height: showDetails === 2 ? 480 : 260, margin: 10, elevation: 5, borderRadius: 25, alignSelf: "center", padding: 10, }}>
                                    
                                    <View style={{borderBottomWidth:0.5,width:"100%",flex:1,alignItems:"center",flexDirection:"row",justifyContent:"space-between",marginBottom:35,padding:8, borderColor:"rgba(240, 240, 240, 0.5)"}}>
                                        <View style={{flexDirection:"row"}}>
                                            <Ionicons name="calculator-outline" size={40} style={{elevation:3}} color={"white"}/>
                                            <View style={{marginLeft:10}}>
                                                <Text style={[styles.Update]}>{monthOfYear}</Text>
                                                <Text style={{fontSize:10, color:"rgba(240, 240, 240, 0.7)"}}>Monthly statistic updates</Text>
                                            </View>
                                        </View>
                                        <MaterialIcons name={ showDetails ? "keyboard-arrow-up" :"keyboard-arrow-down"} size={26} color={"white"} />
                                    </View>

                                    <View style={{flex:3, width:"100%", marginBottom:35}}>
                                         <InvertedSemiCircularProgressBar high={"High"} low={"Low"} stats={"Performance"} present={attendance ? attendance : updated?.attendance ||  0} percentage={totalNumberOfMembers ? totalNumberOfMembers : updated?.totalNumberOfMembers || 0} radius={140} strokeWidth={15} />
                                    </View>

                                    {(showDetails ===2) && 
                                        <View style={{width:"100%",justifyContent:"space-between",alignItems:"center", flex:5}}>
                                            <View style={{flex:1,flexDirection:"row",marginVertical:15}}>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderRightWidth:0.5,paddingVertical:18 ,borderColor:"rgba(240, 240, 240, 0.5)",}}>
                                                    <Text style={{fontSize:13, color:"white",}}>New Members</Text>
                                                    <View style={{flexDirection:"row",}}>
                                                        <Text style={styles.updateTxt}>{newMember ? newMember : updated?.NewMember || 0}</Text>
                                                        <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>/month</Text>
                                                    </View>
                                                </View>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)", padding:18}}>
                                                    <Text style={{fontSize:13, color:"white",}}>Attendance</Text>
                                                    <View style={{flexDirection:"row",}}>
                                                        <Text style={styles.updateTxt}>{attendancePercent ? (attendancePercent).toFixed(1) : 0}</Text>
                                                        <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>% {status}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{flex:1,flexDirection:"row" ,marginBottom:5 }}>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)",borderRightWidth:0.5, paddingVertical:18}}>
                                                        <Text style={{fontSize:13, color:"white",}}>Birthdays</Text>
                                                        <View style={{flexDirection:"row",}}>
                                                            <Text style={styles.updateTxt}>{birthDayComing ? birthDayComing : updated?.birthDayComing ||  0}</Text>
                                                            <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>/month</Text>
                                                        </View>
                                                </View>
                                                <View style={{width:"38%",borderTopWidth:0.5,borderColor:"rgba(240, 240, 240, 0.5)", padding:18}}>
                                                        <Text style={{fontSize:13, color:"white",}}>Pledges</Text>
                                                        <View style={{flexDirection:"row",}}>
                                                            <Text style={styles.updateTxt}>{NoOfPleges ? NoOfPleges : updated?.pledges || 0}</Text>
                                                            <Text style={{color:"white" ,alignSelf:"flex-end",marginBottom:8, fontWeight:"normal", fontSize:10}}>Pending</Text>
                                                        </View>
                                                </View>
                                            </View>  
                                        </View>
                                    }
                                </Pressable>

                            </ScrollView>
                        </View>
                                    

                    <FAB variant="surface"  loading={loading} onPress={()=> {setLoading(true); Linking.openURL(whatsappUrl) ; setLoading(false); ToastAndroid.show("Thank you for the feedback!", ToastAndroid.SHORT);}} 
                     icon={"whatsapp"} color="rgba(30, 30, 30, 1)"  style={{width:55,alignItems:"center",justifyContent:"center", height:55, position:"absolute" ,zIndex:9, bottom:70,elevation:5, backgroundColor:"white", right:15}}/>

                    <View>
                        
                        <View  style={{flexDirection:"row",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF', justifyContent:"space-between",paddingVertical:5,borderTopWidth:0.5,borderColor:"gray"}}>
                           
                            <Pressable style={{width:120}} onPress={()=> navigation.navigate("ModalScreen", {username:username, ChurchName: ChurchName, events: events})}>
                                    
                                    <View style={{alignItems:"center"}}>
                                        <MaterialCommunityIcons name="view-dashboard-outline" size={28} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                                        <Text style={{fontWeight:"500",fontSize:12, color:isDarkMode ? '#FFFFFF' : '#000000'}}>
                                            More
                                        </Text>
                                    </View>
                                    
                            </Pressable>

                            <Pressable style={{ width:120}}>
                                {({pressed})=>(
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home" size={27} color={pressed || isActive ? "rgba(100, 200, 255, 1)" :"gray"}   />
                                    <Text style={{color: pressed || isActive ? "rgba(100, 200, 255, 1)": isDarkMode ? '#FFFFFF' : '#000000',fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                                    )}
                            </Pressable>
           
                            <Pressable style={{width:120}} onPress={()=> {navigation.navigate("Settings", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events}); setclicked(false)}} >
                                    
                                    <View style={{alignItems:"center"}}>
                                        <Ionicons name="settings-outline" size={27} color= {isDarkMode ? '#FFFFFF' : '#000000'}  />
                                        <Text style={{color: isDarkMode ? '#FFFFFF' : '#000000',fontWeight:"500", fontSize:12}}>
                                            Settings
                                        </Text>
                                        {(events && clicked) &&  <Badge style={{position:"absolute",top:0,right:38}} size={8}/>} 
                                    </View>
                            
                            </Pressable>
                            
                    
                        </View>
                </View>

                </View>
            )


}
