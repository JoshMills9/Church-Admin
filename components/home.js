import React, {useLayoutEffect, useState, useEffect} from "react";
import { View, Text, Pressable, Modal, StatusBar,ToastAndroid, Linking,Image,ScrollView,RefreshControl, TouchableOpacity, FlatList, Alert, ImageBackground } from "react-native";
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { getAuth,} from 'firebase/auth';
import { ActivityIndicator, Badge ,FAB} from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';


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


    const navigation = useNavigation()
   
    const [userEmail , setuserEmail] = useState("")
    const [noOfUsers , setNoOfUsers] = useState(null)
    const [notAdmin, setNotAdmin] = useState(null)
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState("");
    const [ChurchName, setChurchName] = useState(null);
    const [NumberOfEvent, setNumberOfEvent] = useState('');
    const [totalNumberOfMembers, setTotalNumberOfMembers] = useState("");
    const [birthDayComing, setBirthdaysComing] = useState("");
    const [isActive, setisActive] = useState(true);
    const [newMember, setNewMember] = useState("");
    const [events, setEvents] = useState(null);
    const [NoOfEvent, setNoOfEvent] = useState(null)
    const auth = getAuth();
    const db = getFirestore();

    const [loading,setLoading] = useState(false)
    const phoneNumber = '+233241380745';
    const message = "Hello there!";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const [refreshing, setRefreshing] = useState(true);
    const [Refreshing, setrefreshing] = useState(false)

    const date = new Date();
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthOfYear = monthsOfYear[date.getMonth()];




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



    const getMember = async (userEmail) => {

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

                 // Fetch user
                    {/*const userDetailsDoc = doc(db, 'UserDetails', church?.id);
                    const userCollectionRef = collection(userDetailsDoc, 'Users');
                    const userSnapshot = await getDocs(userCollectionRef);

                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().User
                        }));
                        setUser(userData.find(item => item.email === userEmail))
                        setNoOfUsers(userData)
                    }*/}
               

                // Fetch events
                const userDetailsDocRef = doc(db, 'UserDetails', church?.id);
                const eventsCollectionRef = collection(userDetailsDocRef, 'Events');
                const eventsSnapshot = await getDocs(eventsCollectionRef);

                if (!eventsSnapshot.empty) {
                    const eventsData = eventsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().Events
                    }));
                    setEvents(eventsData);
                    setNoOfEvent(eventsData.length);
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


                    const date = new Date();
                    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthOfYear = monthsOfYear[date.getMonth()];
              

                    const monthAbr = monthOfYear.slice(0, 3);
                    const upcomingBirthdays = membersData.filter(member => {
                        const memberMonth = member.Date_Of_Birth.split(' ')[1];
                        return memberMonth === monthAbr;
                    });
                    setBirthdaysComing(upcomingBirthdays.length);

                    const newMembers = membersData.filter(member => {
                        const memberMonth = member.Registration_Date.split(' ')[1];
                        return memberMonth === monthAbr;
                    });
                    setNewMember(newMembers.length);
                }
               
            }else{
                Alert.alert("Server Error!","Check network connection")
            };
        }catch(error){
            ToastAndroid.show("Internet connection error", ToastAndroid.LONG);
            console.log(error)
           
        }

    };


    
    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
                console.log(value)
              getMember(value)
              setUsername(value)
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        };
        checkLoginStatus()
      }, []);




    const onRefresh = () => {
        setrefreshing(true);
      
        // Your refresh logic here
        getMember(username); // Example: Fetch new data from an API
      
        // After refreshing completes, set refreshing to false
        setTimeout(() => {
          setrefreshing(false);
        }, 2000); // Simulating a delay
      };
      





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
  





    return(
        <View  style={{flex:1, backgroundColor:"rgba(30, 30, 30, 1)", justifyContent:"space-between"}}>


                <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>


                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:5}}>
                                    { !refreshing ?
                                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"rgba(50, 50, 50, 1)",elevation:5}}>
                                        <Ionicons name="laptop-outline" size={35} color={"rgba(240, 240, 240, 1)"} />
                                    </View>
                                    : 
                                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"rgba(50, 50, 50, 1)",elevation:5}}>
                                       <ActivityIndicator animating={refreshing} size={"small"} color="rgba(240, 240, 240, 1)"/>
                                    </View>
                                    }

                                    <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"center", elevation:3, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)"}}>
                                        <Text style={{fontSize:25,fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Church Administrator</Text>
                                    </View>
                                   
                        </View>

                        <View   style={{flex:1, paddingHorizontal:15,width:"100%", marginTop:20}}>
                            <View style={{ marginBottom:10,alignItems:"flex-start",justifyContent:"space-between" , flexDirection:"row",borderRadius:15, width:"100%"}}>
                                        <View style={{justifyContent:"space-between", height:120, width:"18%"}}>
                                        
                                            <View style={{height:55,width:65,justifyContent:"center", borderTopLeftRadius:20,borderBottomRightRadius:50,padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:6}}>
                                                <MaterialIcons  name="notifications-active" color={" rgba(100, 200, 255, 1)"} size={30}/>
                                                {events && <Badge style={{position:"absolute",top:10,right:20}} size={18}>{NoOfEvent ? NoOfEvent : 0}</Badge>}   
                                            </View>

                                            <View style={{height:55,width:65,justifyContent:"center", borderBottomLeftRadius:20,borderTopRightRadius:50,padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:6}}>
                                                <MaterialIcons  name="monetization-on" color={" rgba(100, 200, 255, 1)"} size={30}/>
                                                <Badge style={{position:"absolute",top:9,right:16}} size={18}>100</Badge>
                                            </View>

                                        </View>

                                        <View style={{width:305,elevation:9,backgroundColor:"rgba(50, 50, 50, 1)",height:120, borderRadius:20}}>
                                        <FlatList 
                                            ListEmptyComponent={()=>(
                                                <ImageBackground source={require("../assets/new1.jpg")} borderRadius={15} style={{width:305,backgroundColor:"rgba(50, 50, 50, 1)",height:120, borderRadius:15}}>         
                                                            <TouchableOpacity onPress={()=> { navigation.replace("Events",{id: "" ,image:null, name: "", guest: "", About: "", start:"",username: username, ChurchName: ChurchName, events: events  })}} style={{position:"absolute",width:95,justifyContent:"center",flexDirection:"row",alignItems:"center",top:5,left:5,borderRadius:10, height:30,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:18,fontWeight:"800",color:"white", marginRight:10}} adjustsFontSizeToFit={true}>Create</Text>
                                                                <MaterialIcons name="edit" size={24} color={"white"} />
                                                            </TouchableOpacity>

                                                            <View style={{position:"absolute", width:150,justifyContent:"center",alignItems:"center",bottom:5,right:5,borderRadius:10, height:35,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:20,fontWeight:"800",color:"white"}} adjustsFontSizeToFit={true}>No Upcoming Event</Text>
                                                            </View>
                                        
                                                </ImageBackground>
                                            )}

                                            data={events?.sort((a, b) => b.createdAt - a.createdAt)}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({item, index})=>{
                                                return(
                                                    <View style={{width:305,backgroundColor:"rgba(50, 50, 50, 1)",height:120, borderRadius:15}}>
                                                        <Animated.View  style={[slideInStyle]}>
                                                                    
                                                            <Image source={{uri: item.Image }}  style={{width:305,height:120,borderRadius:15}} resizeMode="cover" />

                                                            <TouchableOpacity onPress={()=> { navigation.replace("Events", {id: item.id ,image : item.Image, name: item.EventName, guest: item.Guests, About: item.About, start:item.StartDate , username: username, ChurchName: ChurchName, events: events})}} style={{position:"absolute",width:85,justifyContent:"center",flexDirection:"row",alignItems:"center",top:5,left:5,borderRadius:10, height:30,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:18,fontWeight:"800",color:"white", marginRight:10}}>Edit</Text>
                                                                <MaterialIcons name="edit" size={24} color={"white"} />
                                                            </TouchableOpacity>

                                                            <View style={{position:"absolute", width:150,justifyContent:"center",alignItems:"center",bottom:5,right:5,borderRadius:10, height:35,paddingHorizontal:5, backgroundColor:"rgba(0,0,0,0.5)"}}>
                                                                <Text style={{fontSize:20,fontWeight:"800",color:"white"}} adjustsFontSizeToFit={true}>{item.EventName}</Text>
                                                            </View>
                                                        </Animated.View>
                                                    </View>
                                                )
                                            }}
                                            />
                                    </View>
                                        
                            </View>

                            <ScrollView refreshControl={
                                <RefreshControl
                                refreshing={Refreshing}
                                onRefresh={onRefresh}
                                colors={["rgba(240, 240, 240, 1)"]}
                                progressBackgroundColor="rgba(50, 50, 50, 1)"
                                />
                                } 
                                >

                                <View style={{ width: "100%", height: 180, margin: 10, elevation: 2, borderRadius: 25, alignSelf: "center", padding: 10, backgroundColor: "rgba(50, 50, 50, 1)" }}>
                                    <View style={{}}>
                                        <Text style={[styles.Update, { alignSelf: "center" }]}>
                                            Updates For {monthOfYear}
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                            Total No. Of Members:       <Text style={{fontWeight:"500"}}>{totalNumberOfMembers ? totalNumberOfMembers : "-"}</Text>
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                            Upcoming Events:               <Text style={{fontWeight:"500",}}>{NoOfEvent? NoOfEvent : "-"}</Text>
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                            Upcoming Birthdays:          <Text style={{fontWeight:"500"}}>{birthDayComing ? birthDayComing : "-"}</Text> 
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ width: "100%", height: 180, margin: 10, elevation: 2, borderRadius: 25, alignSelf: "center", padding: 10, backgroundColor: "rgba(50, 50, 50, 1)" }}>
                                    <View style={{}}>
                                        <Text style={[styles.Update, { alignSelf: "center" }]}>
                                            Update On Members
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                                Total No. Of Members:         <Text style={{fontWeight:"500"}}>{totalNumberOfMembers ? totalNumberOfMembers : "-"}</Text>
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                                Attendants/week:                <Text style={{fontWeight:"500",}}>-</Text>
                                        </Text>
                                        <Text style={styles.updateTxt}>
                                                New Members/month:          <Text style={{fontWeight:"500",}}>{newMember ? newMember : "-"}</Text>
                                        </Text>
                                    </View>
                                </View>


                            </ScrollView>
                        </View>
                                    

                    <FAB variant="surface" loading={loading} onPress={()=> {setLoading(true); Linking.openURL(whatsappUrl) ; setLoading(false); ToastAndroid.show("Thank you for the feedback!", ToastAndroid.SHORT);}}  icon={"whatsapp"} color="rgba(100, 200, 255, 1)"  style={{width:60,alignItems:"center",justifyContent:"center", height:60, position:"absolute" ,zIndex:9, bottom:70,elevation:5, backgroundColor:"rgba(50, 50, 50, 1)", right:15}}/>

                    <View>
                        
                        <View  style={{flexDirection:"row",backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:"space-between",paddingVertical:5,borderTopWidth:1,borderColor:"gray"}}>
                           
                            <Pressable style={{width:120}} onPress={()=> navigation.navigate("ModalScreen", {username:username, ChurchName: ChurchName, events: events})}>
                                    
                                    <View style={{alignItems:"center"}}>
                                        <MaterialCommunityIcons name="view-dashboard-outline" size={28} color={"gray"} />
                                        <Text style={{fontWeight:"500",fontSize:12, color:"gray"}}>
                                            More
                                        </Text>
                                    </View>
                                    
                            </Pressable>

                            <Pressable style={{ width:120}}>
                                {({pressed})=>(
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home" size={27} color={pressed || isActive ? "rgba(100, 200, 255, 1)" :"gray"}   />
                                    <Text style={{color: pressed || isActive ? "rgba(100, 200, 255, 1)": "gray",fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                                    )}
                            </Pressable>
           
                            <Pressable style={{width:120}} onPress={()=> navigation.navigate("Settings", {username:username, ChurchName: ChurchName, events: events})} >
                                    
                                    <View style={{alignItems:"center"}}>
                                        <Ionicons name="settings-outline" size={27} color= "gray"  />
                                        <Text style={{color: "gray",fontWeight:"500", fontSize:12}}>
                                            Settings
                                        </Text>
                                    </View>
                            
                            </Pressable>
                            
                    
                        </View>
                </View>

                </View>
            )


}
