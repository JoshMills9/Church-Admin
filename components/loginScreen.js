import React,{useState,useEffect} from "react";
import { View , ImageBackground,Image, Text,useWindowDimensions, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, SafeAreaView} from "react-native";
import styles from "./styles";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import app from "../firebaseConfig";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import SignUp from "./signUpScreen";





export default function LogIn ({navigation}){
  
    const [signUpEmail, setSignUpEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [showActivity, setActivity] = useState(false)
    const [error,setError] = useState("")
    const [Switch, setSwitch] = useState(true)
    const [ViewPass, setViewPass] = useState(true)




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



    const screenWidth = useWindowDimensions().width;

    // State to manage current step
    const [step, setStep] = useState(1);

    // Animation styles for form steps
    const formStep1Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    step === 1 ? 0 : step === 2 ? -screenWidth : screenWidth
                ),
            },
        ],
    }));

    const formStep2Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    step === 2 ? 0 : step === 1 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));




    const slideInAnimation = useSharedValue(-350); // Initial off-screen position

  const startAnimation = () => {
    slideInAnimation.value = withTiming(0, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing for smooth animation
    });
  };

  // Animated style configuration
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideInAnimation.value }],
    };
  });



  useEffect(()=>{
    startAnimation()
    StartAnimation()
  },[navigation,Switch])
  
  const SlideInAnimation = useSharedValue(200); // Initial off-screen position

  const StartAnimation = () => {
    SlideInAnimation.value = withTiming(0, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing for smooth animation
    });
  };

  // Animated style configuration
  const animatedstyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: SlideInAnimation.value }],
    };
  });

    

    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.logoView}>
                <ImageBackground style={{flex:1}} source={require("../assets/new1.jpg")} >
                    
                    <View style={{position:"absolute", bottom:130,left:25}}>
                        <Animated.View style={animatedStyle}>
                            <Text style={styles.welcomeTxt}>Church</Text><Text style={styles.welcomeTxt}>Administrator</Text>
                        </Animated.View>
                        <Animated.View style={animatedstyle}>
                            <Text style={{color:"lightgray",fontSize:14,marginTop:5}}>{Switch ? "Welcome back!" : "Register to enjoy the best administration experience"}</Text>
                        </Animated.View>
                    </View>
                </ImageBackground>
            </View>


            <View style={styles.main}>


                <View style={{backgroundColor:"rgba(0, 0, 139, 0.1)",borderRadius:50,height:60,padding:5,width:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <TouchableOpacity onPress={()=> {setSwitch(true);setStep(1)}} style={{backgroundColor: Switch ? "white" : "transparent" ,width:"50%",elevation: Switch ? 3 : 0,justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                        <Text style={{fontSize:16, color: Switch ? "black" : "dimgray",fontWeight: Switch ? "bold" : "normal"}}>LogIn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> {setSwitch(false);setStep(2)}} style={{backgroundColor: step === 2 ? "white" : "transparent",elevation: !Switch ? 3 : 0 ,width:"50%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                        <Text style={{fontSize:16, color: !Switch ? "black" : "dimgray",fontWeight: !Switch ? "bold" : "normal"}}>Register</Text>
                    </TouchableOpacity>
                </View>

                {(Switch && step === 1) ? 
                    <Animated.View style={formStep1Style}>
            
                    <View style={styles.searchView}>
                        <View>
                            <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color={"rgba(0, 0, 128, 0.6)"}/>
                            <TextInput style={{ width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"lightgray",borderWidth:1}}  inputMode="email" placeholder="Email" placeholderTextColor={"dimgray"} value={signUpEmail} onChangeText={(text)=> setSignUpEmail(text)} textContentType="emailAddress" cursorColor={"dimgray"}/>
                        </View>

                        <View>
                            <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color={"rgba(0, 0, 128, 0.6)"} />
                            <TextInput style={{backgroundColor:"white", width:"100%", height:60,borderColor:"lightgray",borderWidth:1, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="default" inputMode="text" placeholder="Password" secureTextEntry={ViewPass} value={loginPassword} onChangeText={(txt) => setLoginPassword(txt)} placeholderTextColor={"dimgray"} cursorColor={"dimgray"}/>
                            <TouchableOpacity onPress={()=> setViewPass(!ViewPass)} style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"rgba(0, 0, 128, 0.6)"} /></TouchableOpacity>
                        </View>

                        <View style={{flexDirection:"row",justifyContent:"flex-end", alignItems:"center"}}>
                        <TouchableOpacity>
                                <Text style={[styles.text,{color:"rgba(0, 0, 128, 0.6)"}]}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>




                    <View style={styles.loginbtnView}>
                        <TouchableOpacity onPress={() => {Login(); setActivity(true)}} style={{width:"100%", height:60, alignItems:"center",alignSelf:"center", justifyContent:"center",backgroundColor:"rgba(0, 0, 128, 0.8)", borderRadius:50}}>
                            {showActivity ? <ActivityIndicator size={"small"} color={"white"}/>
                            :
                            <Text style={{color:"white", fontSize:18, fontWeight:"500"}}>LogIn</Text>
                            }
                            </TouchableOpacity>
                    </View>

                    <View style={styles.socialView}>
                        <View >
                            <Text style={{ color: "dimgray", }}>————Or Login With————</Text>
                        </View>

                        <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%", alignItems:"center"}}>
                            <TouchableOpacity style={{borderWidth:1,borderColor:"lightgray",width:"45%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50,flexDirection:"row"}}><Image style={{width:25,height:25, marginRight:10}} source={require("../assets/google.png")}/><Text style={{fontSize:16}}>Google</Text></TouchableOpacity>
                            <TouchableOpacity style={{borderWidth:1,borderColor:"lightgray",width:"45%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50,flexDirection:"row"}}><Image style={{width:25,height:25,marginRight:10}}  source={require("../assets/apple.png")}/><Text style={{fontSize:16}}>Apple</Text></TouchableOpacity>
                        </View>
                    </View>

                    </Animated.View>
                    :
                    step === 2 && (
                    <Animated.View style={[{flex:1},formStep2Style]}>
                        <SignUp />
                    </Animated.View>
                    )
                }

            </View>
        </SafeAreaView>
     
    )
}