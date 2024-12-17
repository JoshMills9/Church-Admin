import React, { useState ,useEffect } from "react";
import { View, Image, Text, ToastAndroid, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator } from "react-native";
import styles from "./styles";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";



import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState("");
    const [Username, setUsername] = useState("");
    const [showIndicator, setShowIndicator] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [upload, setUpload] = useState(false)
    const [ViewPass, setViewPass] = useState(true)
    const newAdmin = true
    const navigation = useNavigation()

    //add user  to  database
    const db = getFirestore();
    const auth = getAuth(); 

 const handleAddData = async () => {
   // Write data to Firebase Realtime Database
   const usersCollectionRef = collection(db, 'UserDetails'); // Reference to 'users' collection
   const newUserRef = await addDoc(usersCollectionRef, {
    userDetails:{
     ChurchName: Username,
     email: signUpEmail,
     password: signUpPassword,
     Image: selectedImage
    }
   })
   console.log("Data added successfully");
 };


 //sign up func
 const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      handleAddData();
      ToastAndroid.show("Account Created Succesfully!", ToastAndroid.LONG);
      setShowIndicator(false)
      navigation.push("Church Admin");
    } catch (error) {
      Alert.alert(error.message);
      setShowIndicator(false)
      console.error('Error signing up:' , error);
    }
  }



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
            setUpload(true)
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

 
  




        
        //useEffect to save list to Storage
  useEffect(() => {
    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('UserEmail',signUpEmail);
        } catch (e) {
          console.error('Failed to save the data to the storage', e);
        }
      };
      handleSave();
    }, [signUpEmail]);

      
   


    return(
        <View style={[styles.container,{justifyContent:"flex-start"}]}>
        
    
        <View style={[styles.searchView,{height:300,}]}>
            
            <View>
                <FontAwesome5 style={{position:"absolute", left:20, top:20,zIndex:2}}  name="home" size={22} color="dimgray" />
                <TextInput style={{ width:"100%",color:"white",  height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}value={Username} onChangeText ={(text) => setUsername(text)}  keyboardType="default" inputMode="text" placeholder="Church Name" placeholderTextColor={"lightgray"}  cursorColor={"dimgray"}/>
            </View>
            
            <View>
                <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color="dimgray" />
                <TextInput style={{ width:"100%",color:"white", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}} value={signUpEmail} onChangeText ={(text) => setSignUpEmail(text)}  keyboardType="email-address" inputMode="email" placeholder="Email" placeholderTextColor={"lightgray"} textContentType="emailAddress"  cursorColor={"dimgray"}/>
            </View>

            <View>
                <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color="dimgray" />
                <TextInput style={{ width:"100%",color:"white",  height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  keyboardType="default" inputMode="text" value ={signUpPassword} onChangeText={(txt) => setSignUpPassword(txt)} placeholder="Password"  secureTextEntry={ViewPass} textContentType="newPassword" placeholderTextColor={"lightgray"} cursorColor={"dimgray"}/>
                <TouchableOpacity onPress={()=> setViewPass(!ViewPass)} style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color="dimgray"/></TouchableOpacity>
            </View>


            <TouchableOpacity style={{flexDirection:"row",elevation:2, justifyContent:"space-evenly", width:"35%",alignItems:"center",borderRadius:10, backgroundColor:upload ?"white" : "rgba(50, 50, 50, 1)", height:40}} onPress={() => {
                Alert.alert("", "CHOOSE HOW TO UPLOAD IMAGE", [
                  { text: "CAMERA", onPress: () => {pickImage("camera")}},
                  { text: "GALLERY", onPress: () => {pickImage("gallery")}},
                ]);
              }} >
                <>
                    <Text style={{fontWeight:"500",color:upload ? " rgba(100, 200, 255, 1)" : " rgba(100, 200, 255, 1)"}}>{upload ? "Uploaded" :"Upload Logo"}</Text>
                    <Ionicons name="image" size={20} color={upload? " rgba(100, 200, 255, 1)" :  " rgba(100, 200, 255, 1)"}/>
                </>
            </TouchableOpacity>
           
        </View>

        <View style={{marginBottom:30}}>
            <TouchableOpacity onPress={() => {handleSignUp(); setShowIndicator(true)}} style={{width:"100%", height:55, marginTop:5, alignItems:"center", justifyContent:"center",backgroundColor:"rgba(50, 50, 50, 1)", borderRadius:50,elevation:3}}>
            { showIndicator ? <ActivityIndicator size={"small"} color={" rgba(100, 200, 255, 1)"}/> :
                <Text style={[styles.text,{fontWeight:"500", fontSize:18,color:" rgba(100, 200, 255, 1)"}]}>Register</Text>
            }
            </TouchableOpacity>
            
        </View>


        </View>
    

    )
}