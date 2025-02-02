import React, {useState, useLayoutEffect, useEffect} from "react";
import { View, Text, TextInput,useColorScheme, TouchableOpacity,Image,Platform, ScrollView, Alert, ToastAndroid, TouchableHighlight } from "react-native";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import { ActivityIndicator, RadioButton, Switch } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { getAuth, } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const PushNotification = require("./sendNotification")


export default function AddMembers(props){

    const {params} = props?.route || {};
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation()
    const db = getFirestore()
    const [churchName, setchurchName] = useState(null)
    const auth = getAuth()
    const isDarkMode = useColorScheme() === 'dark';

    const [username, setUsername] = useState("");

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djb8fanwt/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'my_images';  // Replace with your upload preset


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

            if (data.secure_url) {
              // The uploaded image URL from Cloudinary
              console.log('Uploaded Image URL:', data.secure_url);
              setSelectedImage(data.secure_url);
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

   
    


    const [regDate, setRegDate] = useState(new Date())
    const [mode, setMode] = useState('');
    const [Birthdate, setBirthDate] = useState(new Date())
    const [show, setShow] = useState(false);
    const [department, setDepartment] = useState("")
    const [marital, setMarital] = useState("")
    const [selectedValue, setSelectedValue] = useState("");
    const [baptized, setBaptized] = useState("")
    const [phone1, setPhone1] = useState("")
    const [phone2, setPhone2] = useState("")
    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [email, setemail] = useState("")
    const [Occupation, setOccupation] = useState("")
    const [visiting, setVisiting] = useState("")
    const [showSubmitting, setSubmitting] = useState(false)
    const [location, setLocation] = useState("")
    const [NewDateShow, setNewDateShow] = useState(false)
    const [calendar, setCalendar] = useState("")



    //state to update the display of datetime (calendar or clock)
    const [display, setDisplay] = useState("")

    const showMode = (currentMode,value) => {
        setShow(true);
        setMode(currentMode);
        setCalendar(value)
    };



    //function to update the dateTime
    const onchange = (event, selectedDate) => {
        if(calendar === "BirthDate"){
            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setBirthDate(currentDate);
        }else{
            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setRegDate(currentDate)
        }
        
    };



        
        
        const monthsOfYear1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth1 = Birthdate.getDate();
        const monthOfYear1 = monthsOfYear1[Birthdate.getMonth()];
        const year1 = Birthdate.getFullYear();
    
        let Suffix = 'th';
        if (dayOfMonth1 === 1 || dayOfMonth1 === 21 || dayOfMonth1 === 31) {
            Suffix = 'st';
        } else if (dayOfMonth1 === 2 || dayOfMonth1 === 22) {
            Suffix = 'nd';
        } else if (dayOfMonth1 === 3 || dayOfMonth1 === 23) {
            Suffix = 'rd';
        }

      
        const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth = regDate.getDate();
        const monthOfYear = monthsOfYear[regDate.getMonth()];
        const year = regDate.getFullYear();
    
        let suffix = 'th';
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = 'rd';
        }

        

        const [formattedRegDate, setFormattedRegDate ] = useState()
        const [formattedDateOfBirth, setFormattedDate] = useState()
        
        useEffect(()=>{
                setFormattedDate(`${dayOfMonth1}${Suffix} ${monthOfYear1} , ${year1}`)
                setFormattedRegDate(`${dayOfMonth}${suffix} ${monthOfYear} , ${year}`);
        },[Birthdate, regDate])
     
   
   
    
        // function for radioButtons
    const radiobtn = (value) =>{
        if (value === "single"){
            setMarital("single")
           
        }else  if (value === "married"){
            setMarital("married")
          
        }else  if (value === "divorced"){
            setMarital("divorced")
    
        }else  if (value === "widowed"){
            setMarital("widowed")
            
        }else  if (value === "youth"){
            setDepartment("youth")
            
        }else  if (value === "men"){
            setDepartment("men")
            
        }else  if (value === "women"){
            setDepartment("women")
            
        }else  if (value === "children"){
            setDepartment("children")
            
        }
    }


     
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
    const handleSubmit = async (Email) => {
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
    
                setchurchName(church); // Set church details in state
                  // Step 3: Validate and submit member registration
                if (!firstName || !secondName) {
                    throw new Error("First Name and Second Name must be filled!");
                }

                  // Reference to the UserDetails document
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
    
            // Reference to the Members subcollection within UserDetails
            const membersCollectionRef = collection(userDetailsDocRef, 'Members');
    
            // Example data for a member document within the subcollection
            const member = {
                FirstName: firstName,
                SecondName: secondName,
                Date_Of_Birth: formattedDateOfBirth || "N/A",
                Registration_Date: formattedRegDate || "N/A",
                Number1: phone1 || "N/A",
                Number2: phone2 || "N/A",
                Email: email || "N/A",
                Marital_Status: marital || "N/A",
                No_Of_Children: selectedValue || "N/A",
                Department: department || "N/A",
                Baptized: baptized || "N/A",
                Visting: visiting || "N/A",
                occupation: Occupation || "N/A",
                Location: location || "N/A",
                Image: selectedImage || null,
                Check: false
            };

            PushNotification("New Member Registered", `Added ${firstName} ${secondName}`)
            // Set a document within the Members subcollection
            await setDoc(doc(membersCollectionRef), {Member: member});
            // Clear form fields after successful registration
            setFirstName('');
            setSecondName('');
            setPhone1('');
            setPhone2('');
            setemail('');
            setMarital('');
            setSelectedValue('');
            setDepartment('');
            setBaptized('');
            setVisiting('');
            setOccupation('');
            setLocation('');
            setSelectedImage(null);
    
            setSubmitting(false);
    
            ToastAndroid.show("Member registration successful!", ToastAndroid.LONG);
              
            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            ToastAndroid.show(`Registration Error: ${error.message}`, ToastAndroid.LONG);
            setSubmitting(false);
        }
    };
    


   


    const handleUpdate = async () => {
        try {
            if (!props?.info[0]?.id) {
                throw new Error("Missing document ID for update.");
            }

            try {
                // Reference to the UserDetails document
                const userDetailsDocRef = doc(db, 'UserDetails', props?.Id);
        
                // Reference to the Members subcollection within UserDetails
                const memberDocRef = doc(userDetailsDocRef, 'Members', props?.info[0]?.id); // Replace 'documentId' with the actual document ID of memberData
                
                PushNotification("Member Data Updated", `Successfully updated ${firstName || props?.info[0].FirstName} ${secondName  || props?.info[0].SecondName}`)
                // Update fields in the memberData document within the Members subcollection
                await updateDoc(memberDocRef, {
                    Member:{
                        FirstName : firstName || props?.info[0].FirstName,
                        SecondName: secondName || props?.info[0].SecondName,
                        Date_Of_Birth : formattedDateOfBirth || props?.info[0].Date_Of_Birth,
                        Registration_Date : formattedRegDate || props?.info[0].Registration_Date,
                        Number1 : phone1 || props?.info[0].Number1,
                        Number2: phone2 || props?.info[0].Number2,
                        Email : email || props?.info[0].Email,
                        Marital_Status: marital || props?.info[0].Marital_Status,
                        No_Of_Children: selectedValue || props?.info[0].No_Of_Children,
                        Department: department || props?.info[0].Department,
                        Baptized : baptized || props?.info[0].Baptized,
                        Visting : visiting || props?.info[0].Visting,
                        occupation: Occupation || props?.info[0].occupation,
                        Location: location || props?.info[0].Location,
                        Image: selectedImage || props?.info[0].Image
                    }
                });
        
                ToastAndroid.show("Member data updated successfully!", ToastAndroid.LONG)
                props?.Show(false); 
            } catch (error) {
                console.error("Error updating member document:", error);
                Alert.alert('Update Error', error.message);
                setSubmitting(false); 
            }
        }catch(error){
            console.log(error)
        }
            
    };


    

    return(
        <View style={{flex:1, justifyContent:"space-between",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>

            {!props?.show &&
                <><StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}/>

                    <View style={{height:70, marginTop:20,width:"100%",borderBottomWidth:0.5, borderColor:"gray", alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF',justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                         <Ionicons name="arrow-back" size={25} style={{width:40,}} color={ isDarkMode ? '#FFFFFF' : '#000000'} onPress={() => navigation.navigate('ModalScreen',{username: params?.username, ChurchName: params.ChurchName,events: params.events})} />
                         <Text style={{ fontSize: 22, color: isDarkMode ? '#FFFFFF' : '#000000', fontWeight: "800" }}>Registration</Text>
                         <Ionicons name="person-add-sharp" size={25} color={ isDarkMode ? '#FFFFFF' : '#000000'} />

                    </View>
                </>
                }

            <ScrollView contentContainerStyle={{padding:10}} showsVerticalScrollIndicator={false}>
            <View style={{margin:10, alignItems:'center'}}>
                <Text style={{fontSize:16, fontWeight:"400",color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                    MEMBERSHIP DETAILS
                </Text>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center", marginTop:10}}>
                <TextInput style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}}  value={firstName || (props?.info?.length > 0 ? props?.info[0]?.FirstName : "")} onChangeText={(text) => setFirstName(text)} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'} placeholder={"First Name" }/>
                <TextInput style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}}   value={secondName || (props?.info?.length > 0 ? props?.info[0]?.SecondName : "")} onChangeText={(text) => setSecondName(text)} placeholder={"Last Name" } placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'}/>
            </View>

            <View style={{flexDirection:"row",marginTop:30, justifyContent:"space-between"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", width:"45%",alignItems:"center"}}>

                    <TouchableOpacity onPress={() => {setNewDateShow(true);showMode("date", "BirthDate");setDisplay("calendar")}}>
                        <Ionicons name="calendar-outline" size={37} color={" rgba(100, 200, 255, 1)"}/>
                    </TouchableOpacity>

                    <TextInput readOnly={true}   style={{width:"80%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:45, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}}placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'}   placeholder={NewDateShow ? formattedDateOfBirth : (props.info ? props.info[0].Date_Of_Birth : "Date of Birth" )} />
                </View>

                <View style={{flexDirection:"row", justifyContent:"space-between", width:"45%",alignItems:"center"}}>

                <TouchableOpacity onPress={() => {setNewDateShow(true);showMode("date","RegDate");setDisplay("calendar")}}>
                    <Ionicons name="calendar-outline" size={37} color={" rgba(100, 200, 255, 1)"}/>
                </TouchableOpacity>

                <TextInput readOnly={true}  style={{width:"80%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:45, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'}  placeholder={NewDateShow ? formattedRegDate : (props.info ? props.info[0].Registration_Date : "Registration Date" ) } />
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", justifyContent:"space-between"}}>
                <TextInput  style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15, color: isDarkMode ? '#FFFFFF' : '#000000'}}placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'}  inputMode="tel"  value={phone1 || (props?.info?.length > 0 ? props?.info[0]?.Number1 : "")} onChangeText={(text) => setPhone1(text)} placeholder={"Phone Number 1"} />
                <TextInput  style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15, color: isDarkMode ? '#FFFFFF' : '#000000'}} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'} inputMode="tel"  value={phone2 || (props?.info?.length > 0 ? props?.info[0]?.Number2 : "")} onChangeText={(text) => setPhone2(text)} placeholder={"Phone Number 2" } />
            </View>

            <View style={{marginTop:30, flexDirection:"row"}}>
                <TextInput  style={{width:"100%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'} inputMode="email"  value={email || (props?.info?.length > 0 ? props?.info[0]?.Email : "")} onChangeText={(text) => setemail(text)} placeholder={"Email address" } />
            </View>

            <View style={{marginTop:30, flexDirection:"row"}}>
                <TextInput  style={{width:"100%", borderWidth:1,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15,color: isDarkMode ? '#FFFFFF' : '#000000'}} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'} inputMode="text"  value={location || (props?.info?.length > 0 ? props?.info[0]?.Location : "")} onChangeText={(text) => setLocation(text)} placeholder={"Residential address" } />
            </View>

            <View style={{marginTop:30}}>
                <Text style={{fontSize:16, fontWeight:"normal", color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                    Marital status:
                </Text>
                <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14, fontWeight:"300", color: isDarkMode ? '#FFFFFF' : '#000000'}}>Single  </Text> 
                        <RadioButton  status={(marital  || (props?.info && props?.info[0]?.Marital_Status)) === "single"  ? "checked" : "unchecked"} onPress={()=> radiobtn("single")}/>
                    </View>
                   
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Married  </Text> 
                        <RadioButton  status={(marital || (props?.info && props.info[0].Marital_Status)) === "married" ? "checked" : "unchecked"}  onPress={()=> radiobtn("married")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Divorced  </Text> 
                        <RadioButton  status={(marital || (props.info && props?.info[0]?.Marital_Status)) === "divorced" ? "checked" : "unchecked"} onPress={()=> radiobtn("divorced")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Widowed  </Text> 
                        <RadioButton  status={(marital || (props.info && props?.info[0]?.Marital_Status)) === "widowed" ? "checked" : "unchecked"} value="" onPress={() => radiobtn("widowed")}/>
                    </View>
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <Text style={{fontSize:16, fontWeight:'400',color: isDarkMode ? '#FFFFFF' : '#000000'}}>Number of Children</Text>
                <View style={{borderRadius:10,borderWidth:1,height:45, borderColor:"gray", flexDirection:"row", minWidth:100,justifyContent:"space-around",alignItems:"center",paddingHorizontal:5}}><Text style={ { fontSize:16, color: isDarkMode ? '#FFFFFF' : '#000000'}}>{selectedValue || "Select"}</Text>
                            <Picker
                                selectedValue={selectedValue || (props?.info && props?.info[0].No_Of_Children)}
                                dropdownIconColor={ isDarkMode ? '#FFFFFF' : '#000000'}
                                enabled={marital === "single" ? false : true}
                                style={{ height:20, width:40, color: isDarkMode ? '#FFFFFF' : '#000000'}}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="4" value="4" />
                                <Picker.Item label="5" value="5" />
                                <Picker.Item label="6" value="6" />
                                <Picker.Item label="7" value="7" />
                                <Picker.Item label="8" value="8" />
                                <Picker.Item label="9" value="9" />
                                <Picker.Item label="10" value="10" />

                            </Picker>
                            </View>
            </View>

            <View style={{marginTop:30}}>
            <Text style={{fontSize:16, fontWeight:"normal",color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                    Department:
                </Text>
                <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Youth</Text> 
                        <RadioButton  status={(department || (props.info && props?.info[0]?.Department)) === "youth" ? "checked" : "unchecked"} onPress={()=> radiobtn("youth")}/>
                    </View>
                   
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Men</Text> 
                        <RadioButton  status={(department || (props.info && props?.info[0]?.Department)) === "men" ? "checked" : "unchecked"}  onPress={()=> radiobtn("men")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14, fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Women </Text> 
                        <RadioButton status={(department || (props.info && props?.info[0]?.Department)) === "women" ? "checked" : "unchecked"} onPress={()=> radiobtn("women")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Children</Text> 
                        <RadioButton    status={(department || (props.info && props?.info[0]?.Department)) === "children" ? "checked" : "unchecked"} value="" onPress={() => radiobtn("children")}/>
                    </View>
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:16,color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                    Are you Baptized?
                </Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Yes</Text>
                    <Switch thumbColor={"gray"}   value={(baptized || (props.info && props?.info[0]?.Baptized)) === "Yes" ? true : false} onValueChange={() => setBaptized("Yes")} />
                </View>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>No</Text>
                    <Switch thumbColor={"gray"}  value={(baptized || (props.info && props?.info[0]?.Baptized)) === "No" ? true : false } onValueChange={() => setBaptized("No")} />
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:16,color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                    Are you Visiting?
                </Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>Yes</Text>
                    <Switch thumbColor={"gray"}  value={(visiting || (props.info && props?.info[0]?.Visting)) === "Yes" ? true : false} onValueChange={() => setVisiting("Yes")} />
                </View>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color: isDarkMode ? '#FFFFFF' : '#000000'}}>No</Text>
                    <Switch thumbColor={"gray"} value={(visiting || (props.info && props?.info[0]?.Visting)) === "No" ? true : false } onValueChange={() => setVisiting("No")} />
                </View>
            </View>

            <View style={{marginTop:30}}>
                <TextInput  style={{width:"100%",color: isDarkMode ? '#FFFFFF' : '#000000', borderWidth:1, marginTop:5,borderColor:"gray",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '', height:50, borderRadius:10,padding:10, fontSize:15}} placeholderTextColor={isDarkMode ? '#FFFFFF' : 'gray'} inputMode="text" value={Occupation || (props?.info?.length > 0 ? props?.info[0]?.occupation : "")} onChangeText={(text) => setOccupation(text)} placeholder={"Occupation"} />
            </View>

            <View style={{marginTop:30, flexDirection:'row',justifyContent:"space-around",alignItems:"center"}}> 
                
                <TouchableHighlight onPress={() => {
                Alert.alert("", "CHOOSE HOW TO UPLOAD IMAGE", [
                  { text: "CANCEL", onPress: () => {} , style:"cancel"},
                  { text: "CAMERA", onPress: () => {pickImage("camera")}},
                  { text: "GALLERY", onPress: () => {pickImage("gallery")}},
                ]);
              }} underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray" }style={{borderRadius:60}} >
                <>
                    {(selectedImage || (props.info && props?.info[0]?.Image !== null) ) ? (
                        <View style={{borderWidth:2.5, borderRadius:60,height:120,width:120, alignItems:"center",justifyContent:"center", borderColor:"dimgray"}}>
                            <Image source={{ uri: selectedImage  ||  (props.info && props?.info[0]?.Image)}} style={{ width: 115, height: 115 ,borderRadius:60}} />
                        </View>
                        )
                        :
                        <View style={{borderWidth:2.5,borderColor:isDarkMode ? "gray" : "dimgray",elevation:5,alignSelf:"center", width:120,height:120,alignItems:"center",justifyContent:"center", borderRadius:100}}>
                            <Ionicons name="person-circle-sharp" size={138} style={{width:135, position:"absolute",right:-8.5 }} color="dimgray"/>
                        </View>
                    }
                    <View style={{position:'absolute', bottom:2,elevation:5, right:6, backgroundColor:"lightgray",width:30, justifyContent:"center",alignItems:"center", height:30, borderRadius:50}}>
                        <Ionicons name="camera-outline" size={16}/>
                    </View>
                </>
                </TouchableHighlight>
            </View>


            
            <View style={{marginTop:30 ,marginBottom:10, alignItems:"center"}}>
                <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" :"lightgray"} onPress={() => {setSubmitting(true); (props.show ? handleUpdate() : handleSubmit(username))}} style={{backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" :  "rgba(100, 200, 255, 1)", width:"60%",height:50, borderRadius:10,elevation:3, alignItems:"center", justifyContent:"center"}}>
                    {showSubmitting ? 
                    <ActivityIndicator  color={ isDarkMode ? "rgba(100, 200, 255, 1)" : "white"}/> 
                    :
                    <Text style={{color: isDarkMode ? "rgba(100, 200, 255, 1)" :"white", fontSize:18, fontWeight:"500"}}>{props?.show? "Update Data":"Register Member"}</Text>
                    }
                </TouchableHighlight>
            </View>

            </ScrollView>

            {show && (<DateTimePicker testID="dateTimePicker" value={props?.info ? Birthdate : Birthdate || regDate} mode={mode} 
             display={display} onChange={onchange} />
            )}
        </View>
    )
}