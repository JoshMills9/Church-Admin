import React, { useState ,useEffect } from "react";
import { View, Image, Text, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator } from "react-native";
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




export default function SignUp() {

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState("");
    const [Username, setUsername] = useState("");
    const [showIndicator, setShowIndicator] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [upload, setUpload] = useState(false)
    const [ViewPass, setViewPass] = useState(true)

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
      setSignUpEmail('');
      setSignUpPassword('');
      Alert.alert("Sign Up Success", "Account Created Succesfully!");
      setShowIndicator(false)
      navigation.navigate("Church Admin");
    } catch (error) {
      Alert.alert(error.message);
      setShowIndicator(false)
      console.error('Error signing up:' , error);
    }
  }

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
        setUpload(true)
      
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

   


    return(
        <View style={styles.container}>

    
        <View style={[styles.searchView,{height:300}]}>
            
            <View>
                <FontAwesome5 style={{position:"absolute", left:20, top:20,zIndex:2}}  name="home" size={22} color="rgba(0, 0, 128, 0.6)" />
                <TextInput style={{ width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"lightgray",borderWidth:1}}value={Username} onChangeText ={(text) => setUsername(text)}  keyboardType="default" inputMode="text" placeholder="Church Name" placeholderTextColor={"dimgray"}  cursorColor={"dimgray"}/>
            </View>
            
            <View>
                <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color="rgba(0, 0, 128, 0.6)" />
                <TextInput style={{ width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"lightgray",borderWidth:1}} value={signUpEmail} onChangeText ={(text) => setSignUpEmail(text)}  keyboardType="default" inputMode="text" placeholder="Email" placeholderTextColor={"dimgray"} textContentType="emailAddress"  cursorColor={"dimgray"}/>
            </View>

            <View>
                <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color="rgba(0, 0, 128, 0.6)" />
                <TextInput style={{ width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"lightgray",borderWidth:1}}  keyboardType="default" inputMode="text" value ={signUpPassword} onChangeText={(txt) => setSignUpPassword(txt)} placeholder="Password" secureTextEntry={ViewPass} placeholderTextColor={"dimgray"} cursorColor={"dimgray"}/>
                <TouchableOpacity onPress={()=> setViewPass(!ViewPass)} style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color="rgba(0, 0, 128, 0.6)"/></TouchableOpacity>
            </View>


            <TouchableOpacity style={{flexDirection:"row",elevation:2, justifyContent:"space-evenly", width:"35%",alignItems:"center",borderRadius:10, backgroundColor:"white", height:40}} onPress={pickImage} >
                <>
                    <Text style={{fontWeight:"500",color:"gray"}}>{upload ? "Uploaded" :"Upload Logo"}</Text>
                    <Ionicons name="image" size={20} color={upload? "rgba(0, 0, 128, 0.8)" :  "gray"}/>
                </>
            </TouchableOpacity>
           
        </View>

        <View style={{marginBottom:30}}>
            <TouchableOpacity onPress={() => {handleSignUp(); setShowIndicator(true)}} style={{width:"100%", height:60, alignItems:"center", justifyContent:"center",backgroundColor:"rgba(0, 0, 128, 0.8)", borderRadius:50}}>
            { showIndicator ? <ActivityIndicator size={"small"} color={"white"}/> :
                <Text style={[styles.text,{fontWeight:"500", fontSize:18,color:"white"}]}>Register</Text>
            }
            </TouchableOpacity>
            
        </View>


        </View>
    

    )
}