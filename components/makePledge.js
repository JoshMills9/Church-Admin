import React, { useState,useEffect } from "react";
import { View , Text, TextInput, TouchableOpacity,useColorScheme, TouchableHighlight,ActivityIndicator,Alert, ScrollView, ToastAndroid} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs,deleteDoc, } from "firebase/firestore";
import { getAuth, } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Pledge(){
    const [mode, setMode] = useState(false)
    const [payment, setPayment] = useState("")
    const [fullName, setFullName] = useState("")
    const [contact, setContact] = useState("")
    const [pledgeTitle, setPledgeTitle] = useState("")
    const [Amount, setAmount] = useState("")
    const [duration, setDuration] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [display, setDisplay] = useState(false);
    const [username, setUsername] = useState("");
    const isDarkMode = useColorScheme() === 'dark';



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDisplay(true);
        setDate(currentDate);
        // Handle date changes or store selected date
    };

    const monthsOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthOfYear = monthsOfYear[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${monthOfYear} ${dayOfMonth} ${year}`;

    const Mode = () =>(
        <View style={{width:200,height:120,position:"absolute",top:210,elevation:8,right:100,borderRadius:8, backgroundColor:"rgba(50, 50, 50, 1)"}}>
           <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" style={{padding:8,borderRadius:5}} onPress={()=>{setMode(prevMode=>!prevMode);setPayment("Mobile Money")}}><Text style={{fontSize:16,fontWeight:"500", color:"rgba(240, 240, 240, 1)"}}>1. Mobile Money</Text></TouchableHighlight>
           <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" style={{padding:8,borderRadius:5}} onPress={()=>{setMode(prevMode=>!prevMode);setPayment("Cash")}}><Text style={{fontSize:16,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>2. Cash</Text></TouchableHighlight>
           <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" style={{padding:8,borderRadius:5}} onPress={()=>{setMode(prevMode=>!prevMode);setPayment("Check")}}><Text style={{fontSize:16,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>3. Check</Text></TouchableHighlight>
        </View>
    )


    const auth = getAuth()
    const db = getFirestore()

   
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
    try {

        if(!fullName || !pledgeTitle){
            setSubmitting(false)
            return ToastAndroid.show("Please fill all fields", ToastAndroid.LONG)
        }

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
        const membersCollectionRef = collection(userDetailsDocRef, 'Pledges');

        // Example data for a member document within the subcollection
        const Pledge = {
            Title: pledgeTitle || "N/A",
            FullName: fullName || "N/A",
            Number1: contact || "N/A",
            PledgeDate: formattedDate || "N/A",
            Amount: Amount || "N/A",
            ModeOfPayment : payment || "N/A",
            Duration : duration || "N/A",
            Redeemed: false,
            createdAt: new Date().getTime(),
        };

        // Set a document within the Members subcollection
        await setDoc(doc(membersCollectionRef), {Pledges: Pledge});

        // Clear form fields after successful registration
        setFullName("");
        setPledgeTitle("");
        setAmount("");
        setPayment("");
        setContact("")
        setDuration("")
        setDisplay(false)
        setSubmitting(false);

        ToastAndroid.show("Pledge made Successfully!", ToastAndroid.LONG);
          
        } else {
            throw new Error("No church details found in database");
        }

    

    } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Creation Error" , error.message);
        setSubmitting(false);
    }
};


    return(

        <ScrollView>
        <View style={{flex:1, backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }}>

            <View>
                <TextInput value={fullName} onChangeText={(txt) => setFullName(txt)}  inputMode="text" placeholder="Full Name" placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} style={{width:"100%", borderColor:"gray",color:isDarkMode ? '#FFFFFF' : '#000000', height:60,borderWidth:1,borderRadius:10,padding:15,fontSize:17,backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '',}}/>
            </View>

            <View>
                <TextInput value={contact} onChangeText={(txt) => setContact(txt)}  inputMode="numeric" placeholder="Contact" placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} style={{width:"100%", borderColor:"gray",color:isDarkMode ? '#FFFFFF' : '#000000', height:60,borderWidth:1,marginTop:20,borderRadius:10,padding:15,fontSize:17,backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '',}}/>
            </View>

            <View style={{marginVertical:30,justifyContent:"space-between",flexDirection:"row"}}>
                <TextInput value={pledgeTitle} onChangeText={(txt) => setPledgeTitle(txt)} placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} inputMode="text" placeholder="Title of Pledge" style={{width:"45%", borderColor:"gray", color:isDarkMode ? '#FFFFFF' : '#000000', height:60,borderWidth:1,borderRadius:10,padding:10,alignItems:"center",fontSize:17,backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : '',}}/>
                <TextInput value={Amount} onChangeText={(txt) => setAmount(txt)} placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} inputMode="numeric" placeholder={ "Amount"} style={{width:"45%", borderColor:"gray", height:60,borderWidth:1,borderRadius:10, color:isDarkMode ? '#FFFFFF' : '#000000',padding:15,fontSize:17,backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : ''}}/>
            </View>

            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text style={{fontSize:18, color:isDarkMode ? '#FFFFFF' : '#000000'}}>Mode of Payment</Text>
                <TouchableOpacity onPress={()=>setMode(prevMode => !prevMode)} style={{backgroundColor: isDarkMode ? "rgba(50, 50, 50, 1)" : "rgba(100, 200, 255, 1)",borderRadius:10, width:150,height:45,marginLeft:20,alignItems:"center",justifyContent:"center",elevation:3}}><Text style={{fontSize:17,color:payment ? (isDarkMode ? " rgba(100, 200, 255, 1)" :"white") : "rgba(240, 240, 240, 1)"}}>{payment ? payment : "Select"}</Text></TouchableOpacity>
            </View>

            <View style={{flexDirection:"row",alignItems:"center",marginVertical:30}}>
                <Text style={{fontSize:18,marginRight:20,color:isDarkMode ? '#FFFFFF' : '#000000'}}>Select Date</Text>
                <Ionicons name="calendar-number" size={40} color={" rgba(100, 200, 255, 1)"} onPress={()=> {setShowPicker(true); setDisplay(true)}}/>
                {display && <Text style={{fontSize:16,marginLeft:20,borderWidth:1,borderRadius:5, height:40,padding:10,borderColor:"gray",color:isDarkMode ? '#FFFFFF' : '#000000'}}>{formattedDate}</Text>}
            </View>

            <View>
                <TextInput  value={duration} onChangeText={(txt) => setDuration(txt)} placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'} inputMode="text" placeholder="Duration" style={{width:"100%", borderColor:"gray", height:60,borderWidth:1,color:isDarkMode ? '#FFFFFF' : '#000000',borderRadius:10,padding:15,fontSize:17,backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : ''}}/>
            </View>


            <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : ""}   onPress={()=> {setSubmitting(true);handleSubmit(username)}} style={{marginVertical:40,alignItems:"center",backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : 'rgba(100, 200, 255, 1)',height:50,justifyContent:"center",borderRadius:15,elevation:3}}>
                {submitting ?  <ActivityIndicator  color={isDarkMode ? "rgba(100, 200, 255, 1)" :"#FFFFFF"}/> : <Text style={{fontSize:17,fontWeight:"500",color:isDarkMode ? "rgba(100, 200, 255, 1)" :"#FFFFFF"}}>Pledge</Text>}
            </TouchableHighlight>

          {mode && Mode()} 
          {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date" // Choose between 'date', 'time', or 'datetime'
                        display="calendar"
                        onChange={onChange}
                    />
            )} 
        </View>
        </ScrollView>
    )
}