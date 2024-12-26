import React,{useState,useEffect} from "react";
import { TextInput, View, Text, Image,ToastAndroid,useColorScheme, TouchableOpacity,Alert,ActivityIndicator, Platform, ScrollView, TouchableHighlight} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs,deleteDoc, } from "firebase/firestore";
import { getAuth, } from 'firebase/auth';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djb8fanwt/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my_images';  

import AsyncStorage from '@react-native-async-storage/async-storage';

const PushNotification = require("./sendNotification")

export default function Events({navigation, route}){
    const {name,About,start,image,guest,id} = route.params

    const [selectedImage, setSelectedImage] = useState(null);
    const isDarkMode = useColorScheme() === 'dark';

    const [eventName, setEventName] = useState("")
    const [guestName, setGuestName] = useState("")
    const [about, setAbout] = useState("")
    const [showSubmitting, setSubmitting] = useState(false)
    const auth = getAuth()
    const db = getFirestore()
    const [Delete,SetDelete] = useState(false)
    const [username, setUsername] = useState("");

    //useEffect and function to select image
    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access the camera roll is required!');
        }
           // Request camera permissions
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access the camera is required!');
        }
      };

      //function to pick image
      const pickImage = async (selected) => {
        let result;
        try {
            if(selected === "gallery"){
                result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
    
          })
        }else if (selected === "camera"){
                result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                })
            }
          
          if (!result.canceled) {
            const uri = result.assets[0].uri; // URI of the selected image
    
            // Create a form data object to upload to Cloudinary
            const formData = new FormData();
            formData.append('file', {
              uri: uri,
              type: 'image/jpeg',  // Make sure to set the correct mime type (e.g., image/jpeg, image/png)
              name: uri.split('/').pop(),
            });
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            ToastAndroid.show('Loading...', ToastAndroid.SHORT)
            // Upload the image to Cloudinary
            const response = await fetch(CLOUDINARY_URL, {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {// The uploaded image URL from Cloudinary
              console.log('Uploaded Image URL:', data.secure_url);
              setSelectedImage(data.secure_url);
              ToastAndroid.show('Loading...', ToastAndroid.LONG)
            } else {
              console.log('Error', 'Failed to upload image to Cloudinary')
              Alert.alert('Error', 'Failed to upload image to Cloudinary');
            }
          }
        } catch (error) {
          console.log('Error picking or uploading image: ', error);
          Alert.alert('Error', 'An error occurred while uploading the image.');
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



    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
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




    //Function to handle submit
    const handleSubmit = async (email) => {
        if (!eventName || !formattedDate || !about ){
            setSubmitting(false)
            return ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT)
        }else if(!selectedImage){
            setSubmitting(false)
            return ToastAndroid.show("Please upload an event photo!", ToastAndroid.SHORT)
        }

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
    
                const church = tasks.find(item => item.email === email);

    
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
                Image: selectedImage,
                createdAt: new Date().getTime(),
            };
    
            PushNotification("Upcoming Event", `New event added ${eventName}`)
            // Set a document within the Members subcollection
            await setDoc(doc(membersCollectionRef), {Events: Event});

            // Clear form fields after successful registration
            setEventName("");
            setGuestName("");
            setAbout("")
            setSelectedImage(null)
            setSubmitting(false);
    
            ToastAndroid.show("Event Created Successfully!", ToastAndroid.SHORT);
            navigation.replace("Church Admin")
              
            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Creation Error", error.message);
            setSubmitting(false);
        }
    };


    const handleUpdate = async (email) => {
            
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
        
                    const church = tasks.find(item => item.email === email);

                    // Reference to the UserDetails document
                    const userDetailsDocRef = doc(db, 'UserDetails', church.id);
            
                    // Reference to the Members subcollection within UserDetails
                    const memberDocRef = doc(userDetailsDocRef, 'Events', id); // Replace 'documentId' with the actual document ID of memberData
                    PushNotification("Successfully updated an event", `Event updated ${eventName || name}`)
                    // Update fields in the memberData document within the Members subcollection
                    await updateDoc(memberDocRef, {
                        Events: {
                            EventName: eventName || name,
                            StartDate: formattedDate || start,
                            Guests: guestName || guest,
                            About: about || About,
                            Image: selectedImage || image,
                            createdAt: new Date().getTime(),
                        }
                    });
            
                    ToastAndroid.show("Event updated successfully!", ToastAndroid.SHORT)

                    setSubmitting(false)
                    navigation.replace("Church Admin")
                }
                    
            } catch (error) {
                console.error("Error updating member document:", error);
                Alert.alert('Update Error', error.message);
                setSubmitting(false); 
            }
        }


        const handleDeleteEvent = async (documentId,email) => {
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
               
                const church = tasks.find(item => item.email === email);

                const userDetailsDocRef = doc(db, 'UserDetails', church.id);
                
                // Reference to the Members subcollection within UserDetails
                const membersCollectionRef = collection(userDetailsDocRef, 'Events');


                const docRef = doc(membersCollectionRef, documentId); 

                await deleteDoc(docRef);

                alert("Success!")
                SetDelete(false)
                navigation.replace("Church Admin")
         
            }} catch (error) {
                console.error("Error deleting document: ", error);
                SetDelete(false)
            }
        };
            
    



    return(
        <View style={{flex:1, justifyContent:"space-between" ,backgroundColor: isDarkMode ? '#121212' : '#FFFFFF'}}>
                   <StatusBar style={'auto'} backgroundColor={ isDarkMode ? '#121212' : '#FFFFFF'}/>

                    <View style={{height:70,borderBottomWidth:0.5,borderColor:"gray",width:"100%",marginTop:20, alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF',justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                         <Ionicons name="arrow-back" size={25} style={{width:40,}} color={isDarkMode ? '#FFFFFF' : '#000000'} onPress={() => navigation.navigate('ModalScreen',{username:"", ChurchName:""})} />
                         <Text style={{ fontSize: 22, color: isDarkMode ? '#FFFFFF' : '#000000', fontWeight: "800" }}>{name? "Edit Event" : "Create Event"}</Text>
                         <Ionicons name="calendar-sharp" size={25} color={isDarkMode ? '#FFFFFF' : '#000000'} />

                    </View>
              
                
                <ScrollView contentContainerStyle={{justifyContent:"space-between",height:600, paddingBottom:40}}>
                <View style={{borderRadius:10,borderWidth:1,borderColor:"gray", justifyContent:"center",height:250}}>
                    
                    <Image source={(selectedImage  || image) ? { uri: selectedImage || image } : require("../assets/new1.jpg")} style={{  height: 250 , width:420, alignSelf:"center", borderRadius:15 }} resizeMode="cover"/>
                   
                    <TouchableOpacity onPress={() => { Alert.alert("", "CHOOSE HOW TO UPLOAD IMAGE", [
                        { text: "CAMERA", onPress: () => {pickImage("camera")}},
                        { text: "GALLERY", onPress: () => {pickImage("gallery")}},])
                    
                    }}
                         style={{position:"absolute", right:10, backgroundColor: 'rgba(0, 0, 0, 0.5)',width:selectedImage || image ? 95 :145, height:45, bottom:10, flexDirection:"row",borderRadius:10,paddingHorizontal:5, justifyContent:"space-around",alignItems:"center"}} >
                        
                        <Text style={{color:"white", fontSize: selectedImage || image ? 18:15 ,fontWeight:"800"}}>{selectedImage || image ? "Edit":"Upload photo"}</Text>
                        
                        <Ionicons name="camera-outline" size={30} color={"white"}/>

                    </TouchableOpacity>
                    

                </View>

                
                <View style={{marginTop:10,marginHorizontal:10, justifyContent:"space-between", height:340,paddingBottom:10}}>
                    
                
                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10,color:isDarkMode ? '#FFFFFF' : '#000000', borderWidth:1,padding:15,borderColor: eventName ? " rgba(100, 200, 255, 1)" : "gray"}} placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} value={eventName || (name ? name : "") } onChangeText={(text) => setEventName(text)} placeholder={"Event name"}/>
                        </View>

                        <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => {showMode("date");setDisplay("calendar");setValue(true)}}style={{borderWidth:1,borderColor:value ? "rgba(100, 200, 255, 1)" : "gray", height:70, flexDirection:"row",borderRadius:10,padding:15, alignItems:"center" ,}}>
                            <>
                                <View>
                                    <Ionicons name="calendar-number" size={40} color={" rgba(100, 200, 255, 1)"}/>
                                </View>
                                
                                <Text style={{fontSize:18,marginLeft:20,color:isDarkMode ? '#FFFFFF' : '#000000'}}>{value ? formattedDate : (start ? start : "Start date")}</Text>
                            </>
                        </TouchableHighlight>

                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10, borderWidth:1,padding:15,borderColor: guestName ? " rgba(100, 200, 255, 1)" : "gray",color:isDarkMode ? '#FFFFFF' : '#000000'}} placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000' } value={guestName || (guest ? guest : "")} onChangeText={(text) => setGuestName(text)} placeholder={"Guests"}/>
                        </View>

                        <View>
                            <TextInput   style={{height:70,fontSize:18, borderRadius:10, borderWidth:1,padding:15,borderColor: about ? " rgba(100, 200, 255, 1)" :  "gray",color:isDarkMode ? '#FFFFFF' : '#000000'}}placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000' } value={about || (About? About : "")} onChangeText={(text) => setAbout(text)} placeholder={"What are the details"}/>
                        </View>

                     

                    </View>
                 

                </ScrollView>

                    <View style={{flexDirection: name ? "row" : "column" , justifyContent:"space-between",paddingHorizontal:20,marginBottom:3}}>
                        <TouchableOpacity onPress={()=>{setSubmitting(true); (name ? handleUpdate(username): handleSubmit(username))}} style={{justifyContent:"center",marginBottom:8,elevation:4,borderRadius:10,height:50,width:"45%",flexDirection:"row", alignSelf:"center",alignItems:"center", backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : "rgba(100, 200, 255, 1)"}}>
                        {showSubmitting ? 
                            <ActivityIndicator  color={isDarkMode ? "rgba(100, 200, 255, 1)" :"white"}/> 
                            :
                            <Text style={{fontSize:20,fontWeight:"700", color:isDarkMode ? "rgba(100, 200, 255, 1)" :"white"}}>
                                {name ? "Edit" : "Create"}
                            </Text>
                        }
                        </TouchableOpacity>

                        {name &&
                            <TouchableOpacity onPress={()=>{handleDeleteEvent(id, username); SetDelete(true)}} style={{justifyContent:"center",marginBottom:8,elevation:4,borderRadius:10,height:50,width:"45%",flexDirection:"row", alignSelf:"center",alignItems:"center", backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : "red"}}>
                                {Delete ? 
                                    <ActivityIndicator  color={isDarkMode ? "red" : "white"}/> 
                                    :
                                    <Text style={{fontSize:20,fontWeight:"700", color:isDarkMode? "red" : "white"}}>
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