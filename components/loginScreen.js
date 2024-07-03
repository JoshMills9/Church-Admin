import React,{useState} from "react";
import { View , Image, Text, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert} from "react-native";
import styles from "./styles";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FireBaseApp } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword, RecaptchaVerifier } from "firebase/auth";


export default function LogIn ({navigation}){
  
    const [signUpEmail, setSignUpEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [showActivity, setActivity] = useState(false)
    const [error,setError] = useState("")

  // Function to log in a user
    const auth = getAuth();

    const Login = async () => {
        try {
            await signInWithEmailAndPassword(auth, signUpEmail, loginPassword)
            navigation.navigate("Church Admin");
            setActivity(false)
        } catch (error) {
        setError(error.message)
            Alert.alert("Error", error.message)
            setActivity(false)
        }
    
    };
    

    return(
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>

            <View style={styles.logoView}>
                <View style={{height:100,width:"100%", justifyContent:"center", alignItems:"center"}}>
                    <Image style={{width:"30%", height:"100%",}} source={require("../assets/new.png")} />
                </View>

                <View style={{marginTop:10}}>
                    <Text style={styles.welcomeTxt}>Church Administrator</Text>
                </View>
            </View>
            
           
            <View style={styles.searchView}>
                <View>
                    <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color={"rgba(0, 0, 128, 0.8)"}/>
                    <TextInput style={{backgroundColor:"white", width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,}}  inputMode="email" placeholder="Email" placeholderTextColor={"dimgray"} value={signUpEmail} onChangeText={(text)=> setSignUpEmail(text)} textContentType="emailAddress" cursorColor={"dimgray"}/>
                </View>

                <View>
                    <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color={"rgba(0, 0, 128, 0.8)"} />
                    <TextInput style={{backgroundColor:"white", width:"100%", height:60, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="default" inputMode="text" placeholder="Password" secureTextEntry={true} value={loginPassword} onChangeText={(txt) => setLoginPassword(txt)} placeholderTextColor={"dimgray"} cursorColor={"dimgray"}/>
                    <TouchableOpacity style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"rgba(0, 0, 128, 0.8)"} /></TouchableOpacity>
                </View>

                <View style={{flexDirection:"row",justifyContent:"flex-end", alignItems:"center"}}>
                   <TouchableOpacity>
                        <Text style={[styles.text,{color:"rgba(0, 0, 128, 0.8)"}]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.loginbtnView}>
                <TouchableOpacity onPress={() => {Login(); setActivity(true)}} style={{width:70, height:70, alignItems:"center",alignSelf:"center", justifyContent:"center",backgroundColor:"rgba(0, 0, 128, 0.8)", borderRadius:50}}>
                    {showActivity ? <ActivityIndicator size={"small"} color={"white"}/>
                    :
                    <Feather  name="arrow-right" size={30} color="white" />
                    }
                    </TouchableOpacity>
            </View>

            <View style={styles.socialView}>
                <View >
                    <Text style={{ color: "dimgray", }}>———— Or Login With ————</Text>
                </View>

                <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"80%", alignItems:"center"}}>
                    <TouchableOpacity style={{backgroundColor:"white", elevation:6, borderRadius:15, width:55,height:55, alignItems:"center",justifyContent:"center"}}><Image style={{width:25,height:25}} source={require("../assets/google.png")}/></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:"white", elevation:6, borderRadius:15, width:55,height:55, alignItems:"center",justifyContent:"center"}}><Image style={{width:25,height:25}}  source={require("../assets/facebook.png")}/></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:"white", elevation:6, borderRadius:15, width:55,height:55, alignItems:"center",justifyContent:"center"}}><Image style={{width:25,height:25}}  source={require("../assets/apple.png")}/></TouchableOpacity>
                </View>
            </View>

            <View style={styles.options}> 
                <Text style={styles.text}>Not a member? </Text><TouchableOpacity onPress={() => navigation.navigate("SignUp")}><Text style={[styles.text,{color:"rgba(0, 0, 128, 0.8)"}]}>Register Now</Text></TouchableOpacity>
            </View>
       
        </View>
     
    )
}