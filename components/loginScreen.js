import React,{useState,useLayoutEffect, useRef} from "react";
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
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";

import SignUp from "./signUpScreen";




export default function LogIn ({navigation}){
  
    const [signUpEmail, setSignUpEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [showActivity, setActivity] = useState(false)
    const [error,setError] = useState("")
    const [Switch, setSwitch] = useState(true)
    const [ViewPass, setViewPass] = useState(true)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const reset = useRef(null)
    const WindowWidth = useWindowDimensions().width
    const WindowHeight = useWindowDimensions().height



  // Function to log in a user
    const auth = getAuth(app);

    const Login = async () => {
        try {
            await signInWithEmailAndPassword(auth, signUpEmail, loginPassword)
            navigation.navigate("Users", {email: signUpEmail, password: loginPassword});
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



  useLayoutEffect(()=>{
    startAnimation()
    StartAnimation()
  },[Switch,showForgotPassword])
  
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




  const [email, setEmail] = useState('');

    const ForgotPassword = () =>{
        return(
            <Animated.View style={[{position:"absolute", width: WindowWidth > 400 ? 380 : 350,height:WindowHeight > 600 ? 210 : 200, borderRadius:15,alignSelf:"center",bottom:0, backgroundColor:"rgba(50, 50, 50, 1)",elevation:5, padding:20 }, animatedstyle]}>
                <View style={{flexDirection:"row", justifyContent:"space-between",marginBottom:20, alignItems:"center"}}>
                    <Text style={{fontSize:25,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>Forgot Password?</Text>
                    <MaterialIcons name="close" size={30} color={"red"}  onPress={()=>setShowForgotPassword(!showForgotPassword)}/>  
                </View>
                
                <View>
                    <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color={"gray"}/>
                    <TextInput ref={reset} style={{ width:"100%", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  inputMode="email" placeholder="Email" placeholderTextColor={"rgba(240, 240, 240, 1)"} value={email} onChangeText={(txt)=>setEmail(txt)}  textContentType="emailAddress" cursorColor={"dimgray"}/>
                    <TouchableOpacity onPress={handleResetPassword} style={{marginTop:20, width:"80%", borderRadius:20, backgroundColor:"transparent", height:50, alignItems:"center", justifyContent:"center", alignSelf:"center"}}><Text style={{color:" rgba(100, 200, 255, 1)",fontSize:18}}>Reset Password</Text></TouchableOpacity>
                </View>
            </Animated.View>
        )
    }


        const handleResetPassword = () => {
            sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Success","reset link sent, check your email.")
                setEmail("");
                setShowForgotPassword(!showForgotPassword)
            })
            .catch((error) => {
                alert(error.message);
                // ..
            });
          };

      
      

    return(
        <SafeAreaView style={styles.container} >
            <View  style={styles.overlay}>
                <StatusBar barStyle={"light-content"} backgroundColor={"rgba(30, 30, 30, 1)"} />

                <ImageBackground resizeMode="cover" source={require("../assets/new1.jpg")} style={[styles.logoView,{height:WindowHeight < 800 ? 420 : 550, width:WindowWidth > 400 ? 420 : 500, position:"absolute",top:0}]} >
                            <Animated.View style={animatedStyle}>
                                <Text style={styles.welcomeTxt}>Church</Text><Text style={styles.welcomeTxt}>Administrator</Text>
                            </Animated.View>
                            <Animated.View style={animatedstyle}>
                                <Text style={{color:"lightgray",fontSize:14,marginTop:5}} adjustsFontSizeToFit={true} numberOfLines={1}>{Switch ? "Welcome back!" : "Register to enjoy the best administration experience"}</Text>
                            </Animated.View>
                </ImageBackground>


                <View style={[styles.main,{height: WindowHeight < 800 ? 380 : 460}]}>


                    <View style={{backgroundColor:"rgba(70, 70, 70, 0.2)",borderRadius:50,height:60,padding:5,width:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <TouchableOpacity onPress={()=> {setSwitch(true);setStep(1)}} style={{backgroundColor: Switch ? "rgba(50, 50, 50, 1)" : "transparent" ,width:"50%",elevation: Switch ? 7 : 0,justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                            <Text style={{fontSize:16, color: Switch ? " rgba(100, 200, 255, 1)" : "lightgray",fontWeight: Switch ? "bold" : "normal"}}>LogIn</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> {setSwitch(false);setStep(2)}} style={{backgroundColor: step === 2 ? "rgba(50, 50, 50, 1)" : "transparent",elevation: step === 2 ? 7 : 0 ,width:"50%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                            <Text style={{fontSize:16, color: !Switch ? " rgba(100, 200, 255, 1)" : "lightgray",fontWeight: !Switch ? "bold" : "normal"}}>Register</Text>
                        </TouchableOpacity>

                    </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{height: WindowHeight > 600 ? 380 : 600, justifyContent:"flex-start"}}>
                        {(Switch && step === 1) ? 
                
                        <Animated.View style={formStep1Style}>
                
                        <View style={[styles.searchView,{height: WindowHeight < 800 ? 200 : 210}]}>
                            <View>
                                <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color={"dimgray"}/>
                                <TextInput style={{ width:"100%",color:"white", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  inputMode="email" placeholder="Email" placeholderTextColor={"lightgray"} value={signUpEmail} onChangeText={(text)=> setSignUpEmail(text)} textContentType="emailAddress" cursorColor={"gray"}/>
                            </View>

                            <View>
                                <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color={"dimgray"} />
                                <TextInput style={{ width:"100%",color:"white", height:60,borderColor:"gray",borderWidth:1, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="visible-password" inputMode="text" placeholder="Password" secureTextEntry={ViewPass} textContentType="password" value={loginPassword} onChangeText={(txt) => setLoginPassword(txt)} placeholderTextColor={"lightgray"}  cursorColor={"dimgray"}/>
                                <TouchableOpacity onPress={()=> setViewPass(!ViewPass)} style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"dimgray"} /></TouchableOpacity>
                            </View>

                            <View style={{flexDirection:"row",justifyContent:"flex-end", alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>{setShowForgotPassword(!showForgotPassword)}}>
                                    <Text style={[styles.text,{color:" rgba(100, 200, 255, 1)"}]}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>




                        <View style={styles.loginbtnView}>
                            <TouchableOpacity onPress={() => {Login(); setActivity(true)}} style={{width:"100%", height:55, alignItems:"center",alignSelf:"center", justifyContent:"center",backgroundColor:"rgba(50, 50, 50, 1)", borderRadius:50,elevation:3}}>
                                {showActivity ? <ActivityIndicator size={"small"} color={" rgba(100, 200, 255, 1)"}/>
                                :
                                <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:18, fontWeight:"500"}}>LogIn</Text>
                                }
                                </TouchableOpacity>
                        </View>

                        <View style={styles.socialView}>
                            <View >
                                <Text style={{ color: "dimgray", }}>————Or Login With————</Text>
                            </View>

                            <View style={{flexDirection:"row", justifyContent:"space-evenly", width:"100%", alignItems:"center"}}>
                                <TouchableOpacity style={{borderWidth:1,borderColor:"gray",width:"45%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50,flexDirection:"row"}}><Image style={{width:25,height:25, marginRight:10}} source={require("../assets/google.png")}/><Text style={{fontSize:16, color:"lightgray"}}>Google</Text></TouchableOpacity>
                                <TouchableOpacity style={{borderWidth:1,borderColor:"gray",width:"45%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50,flexDirection:"row"}}><Image style={{width:25,height:25,marginRight:10, tintColor:"lightgray"}}  source={require("../assets/apple.png")}/><Text style={{fontSize:16,color:"lightgray"}}>Apple</Text></TouchableOpacity>
                            </View>
                        </View>

                        </Animated.View>
                        :
                        (!Switch && step === 2 )&& (
                        <Animated.View style={[{flex:1},formStep2Style]}>
                            <SignUp />
                        </Animated.View>
            
                        )
                     
                    }
                    </ScrollView>
                </View>

                {showForgotPassword && <ForgotPassword />}
            </View>
        </SafeAreaView>
     
    )
}