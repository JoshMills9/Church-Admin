import React,{useState,useEffect} from "react";
import { TextInput, View, Text, Image, TouchableOpacity,Alert,ActivityIndicator, StatusBar,Platform, ScrollView} from "react-native";

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";
import { getAuth, } from 'firebase/auth';


export default function Events({navigation, route}){
    const {name,About,start,image,guest,id} = route.params

    const [selectedImage, setSelectedImage] = useState(null);

    const [eventName, setEventName] = useState("")
    const [guestName, setGuestName] = useState("")
    const [about, setAbout] = useState("")
    const [showSubmitting, setSubmitting] = useState(false)
    const auth = getAuth()
    const db = getFirestore()


    //useEffect and function to select image
    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access the camera roll is required!');
        }
      };

      //function to pik image
      const pickImage = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            
          });
            setSelectedImage(result.assets[0].uri);
          
        } catch (error) {
          console.error('Error picking image: ', error);
        }
      };
    




    const [date, setDate] = useState(new Date());

    //state to update the mode of datetime (date or time)
    const [mode, setMode] = useState('');
    const [value,setValue] = useState(false)
    const [show, setShow] = useState(false);

    //state to update the display of datetime (calendar or clock)
    const [display, setDisplay] = useState("")

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[date.getDay()];
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

    const formattedDate = `${dayOfWeek}, ${dayOfMonth}${suffix} ${monthOfYear}, ${year}`;
   
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    //function to update the dateTime
    const onchange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

    };




    //Function to handle submit
    const handleSubmit = async () => {
        try {
            // Step 1: Retrieve user email from Firebase authentication
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

    
                if (!church) {
                    throw new Error("Church details not found for the logged-in user");
                }
                  // Step 3: Validate and submit member registration

                  // Reference to the UserDetails document
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
    
            // Reference to the Members subcollection within UserDetails
            const membersCollectionRef = collection(userDetailsDocRef, 'Events');
    
            // Example data for a member document within the subcollection
            const Event = {
                EventName: eventName,
                StartDate: formattedDate,
                Guests: guestName,
                About: about,
                Image: selectedImage
            };
    
            // Set a document within the Members subcollection
            await setDoc(doc(membersCollectionRef), {Events: Event});

            // Clear form fields after successful registration
            setEventName("");
            setGuestName("");
            setAbout("")
            setSelectedImage(null)
            setSubmitting(false);
    
            Alert.alert("Success", "Event Created Successful!");
              
            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Creation Error", error.message);
            setSubmitting(false);
        }
    };


    const handleUpdate = async () => {
            
            try {


                // Step 1: Retrieve user email from Firebase authentication
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

                    // Reference to the UserDetails document
                    const userDetailsDocRef = doc(db, 'UserDetails', church.id);
            
                    // Reference to the Members subcollection within UserDetails
                    const memberDocRef = doc(userDetailsDocRef, 'Events', id); // Replace 'documentId' with the actual document ID of memberData
                    // Update fields in the memberData document within the Members subcollection
                    await updateDoc(memberDocRef, {
                        Events: {
                            EventName: eventName || name,
                            StartDate: formattedDate || start,
                            Guests: guestName || guest,
                            About: about || About,
                            Image: selectedImage || image
                        }
                    });
            
                    Alert.alert("Success","Event updated successfully!")

                    setSubmitting(false)
                    navigation.replace("Church Admin")
                }
                    
            } catch (error) {
                console.error("Error updating member document:", error);
                Alert.alert('Update Error', error.message);
                setSubmitting(false); 
            }
        }
            
    



    return(
        <View style={{flex:1, justifyContent:"space-between" ,}}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "white", elevation: 7 }}>
                            <Ionicons name="arrow-back" size={35} color={"navy"} onPress={() => navigation.replace('ModalScreen', {username:"", ChurchName:""})} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "center", elevation: 7, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "white" }}>
                            <Text style={{ fontSize: 24, color: "rgba(0, 0, 128, 0.8)", fontWeight: "800" }}>Create Events</Text>
                        </View>
                </View>


                
                
                <ScrollView contentContainerStyle={{justifyContent:"space-between",height:600, paddingBottom:40}}>
                <View style={{borderRadius:10,borderWidth:1,borderColor:"lightgray", justifyContent:"center",height:250}}>
                    
                    <Image source={{ uri: selectedImage || image }} style={{  height: 250 }} resizeMode="stretch"/>
                   
                    <TouchableOpacity onPress={pickImage} style={{position:"absolute", right:10, backgroundColor: 'rgba(0, 0, 0, 0.5)',width:selectedImage || image ? 90 :140, height:45, bottom:10, flexDirection:"row",borderRadius:10,paddingHorizontal:5, justifyContent:"space-between",alignItems:"center"}} >
                        <Text style={{color:"white", fontSize: selectedImage || image ? 18:15 ,fontWeight:"800"}}>{selectedImage || image ? "Edit":"Upload photo"}</Text>
                        <Ionicons name="camera-outline" size={33} color={"white"}/>
                    </TouchableOpacity>
                    

                </View>

                
                <View style={{marginTop:10,marginHorizontal:10, justifyContent:"space-between", height:340,paddingBottom:10}}>
                    
                
                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10, borderWidth:1,padding:15,borderColor:"lightgray"}} value={eventName} onChangeText={(text) => setEventName(text)} placeholder={name ? name : "Event name"}/>
                        </View>

                        <View style={{borderWidth:1,borderColor:"lightgray", height:70, flexDirection:"row",borderRadius:10,padding:15, alignItems:"center" ,}}>
                            <TouchableOpacity onPress={() => {showMode("date");setDisplay("calendar");setValue(true)}}>
                                <Ionicons name="calendar-number" size={40} color={"rgba(0, 0, 128, 0.8)"}/>
                            </TouchableOpacity>
                            
                            <Text style={{fontSize:18,marginLeft:20}}>{value ? formattedDate : (start ? start : "Start date")}</Text>

                        </View>

                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10, borderWidth:1,padding:15,borderColor:"lightgray"}}  value={guestName} onChangeText={(text) => setGuestName(text)} placeholder={guest ? guest :  "Guests"}/>
                        </View>

                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10, borderWidth:1,padding:15,borderColor:"lightgray"}} value={about} onChangeText={(text) => setAbout(text)} placeholder={About? About : "What are the details"}/>
                        </View>

                     

                    </View>
                 

                </ScrollView>

                    <View style={{flexDirection: name ? "row" : "column" , justifyContent:"space-between",paddingHorizontal:20}}>
                        <TouchableOpacity onPress={()=>{setSubmitting(true); (name ? handleUpdate(): handleSubmit())}} style={{justifyContent:"center",marginBottom:15,elevation:2,borderRadius:10,height:50,width:"45%",flexDirection:"row", alignSelf:"center",alignItems:"center", backgroundColor:"white"}}>
                        {showSubmitting ? 
                            <ActivityIndicator  color="navy"/> 
                            :
                            <Text style={{fontSize:20,fontWeight:"700", color:"navy"}}>
                                {name ? "Edit" : "Create"}
                            </Text>
                        }
                        </TouchableOpacity>

                        {name &&
                            <TouchableOpacity onPress={()=>{ }} style={{justifyContent:"center",marginBottom:15,elevation:2,borderRadius:10,height:50,width:"45%",flexDirection:"row", alignSelf:"center",alignItems:"center", backgroundColor:"white"}}>
                                {showSubmitting ? 
                                    <ActivityIndicator  color="navy"/> 
                                    :
                                    <Text style={{fontSize:20,fontWeight:"700", color:"orangered"}}>
                                        Delete
                                    </Text>
                                }
                            </TouchableOpacity>
                        }
                    </View>
                

                {show && (<DateTimePicker testID="dateTimePicker" value={date} mode={mode} 
             display={display} onChange={onchange} />
            )}

            
        </View>
    )
}