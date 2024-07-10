import React, {useState} from 'react'
import { View , Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions} from 'react-native'
import styles from './styles'

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";



function Users({route}) {
    const {email, password, newAdmin} = route.params
    const navigation = useNavigation()
    const auth = getAuth();
    const db = getFirestore()
    
    const [signUpEmail, setSignUpEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [showActivity, setActivity] = useState(false)
    const [ViewPass, setViewPass] = useState(true)
    const [Switch, setSwitch] = useState(true)
    const [users , setUser] = useState(false)
    const [confirmPassword, setConfrimPassword] = useState("")
    const [role, setRole] = useState("")
    const [showIndicator, setShowIndicator] = useState(false)
    const [show,setShow] = useState(false)
    const [color, setColor] = useState(false)
    const newadmin = true 
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

    const formStep3Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    step === 3 ? 0 : step === 1 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));

    //Confirm Admin
    const Confirm = () =>{
        setActivity(true);
        try{
            (confirmPassword === password ) ? 
            (setColor(true),navigation.navigate("Church Admin",{mainEmail : email, newAdmin: newadmin || newAdmin}), setActivity(false))
            :
            (Alert.alert("You are not Admin!!", "Create Users account instead"),
            setActivity(false))
        }catch(error){
            alert(error.message);
            setActivity(false)
        }
    }


   //Function to handle submit
   const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, signUpEmail, loginPassword)
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
        const membersCollectionRef = collection(userDetailsDocRef, 'Users');

        // Example data for a member document within the subcollection
        const User = {
            Role: role,
            email: signUpEmail,
            password: loginPassword,
            createdAt: new Date().getTime(),
        };

        // Set a document within the Members subcollection
        await setDoc(doc(membersCollectionRef), {User: User});

        setShow(true)
          
        } else {
            throw new Error("No church details found in database");
        }

    

    } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Creation Error", error.message);
    }
};

     //sign up func
    const handleSignUp = async () => {
        try {
        handleSubmit();
        setSignUpEmail('');
        setLoginPassword('');
        setRole("")
        Alert.alert("Sign Up Success", "Account Created Succesfully!");
        setShowIndicator(false);
        setActivity(false);
        {show && navigation.navigate("Church Admin",{mainEmail:email,email: signUpEmail, newAdmin: newadmin || newAdmin, role: role})}
        } catch (error) {
        Alert.alert(error.message);
        setActivity(false)
        setShowIndicator(false)
        console.error('Error signing up:' , error);
        }
    }

    const Login = async () => {
        try {
            await signInWithEmailAndPassword(auth, signUpEmail, loginPassword)
            navigation.navigate("Church Admin", {role: role, email: signUpEmail, password: loginPassword, mainEmail:email, newAdmin: newadmin});
            setActivity(false)
        } catch (error) {
            Alert.alert("Error", error.message)
            setActivity(false)
        }
    
    };


  return (
    <View style={[styles.container, {justifyContent:'center', alignItems:"center", padding:15, backgroundColor:"rgba(25, 25, 25, 0.8)"}]}>

        <View style={{marginTop:15, marginBottom:15}}>
            {color ? 
                <MaterialCommunityIcons name='shield-lock-open-outline' size={60} color={"green"} />
            :   <MaterialCommunityIcons name='shield-alert-outline' size={60} color={"orangered"} />
            }
        </View>
        <View style={{backgroundColor: "rgba(30, 30, 30, 1)",height:380, width:"100%", padding:15,borderRadius:15, elevation:8, justifyContent:"space-between" }}>

            <View style={{backgroundColor:"rgba(70, 70, 70, 0.2)",borderRadius:50,height:60,padding:5,width:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:"center", marginBottom: users ? 15 : 25}}>
                         
                          {!users ?  
                                <>
                                <TouchableOpacity onPress={()=> {setSwitch(true);setStep(1)}} style={{backgroundColor: Switch ? "rgba(50, 50, 50, 1)" : "transparent" ,width:"50%",elevation: Switch ? 7 : 0,justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                                    <Text style={{fontSize:16, color: Switch ? " rgba(100, 200, 255, 1)" : "lightgray",fontWeight: Switch ? "bold" : "normal"}}>Admin</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {setSwitch(false);setStep(2)}} style={{backgroundColor: step === 2 ? "rgba(50, 50, 50, 1)" : "transparent",elevation: step === 2 ? 7 : 0 ,width:"50%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                                    <Text style={{fontSize:16, color: !Switch ? " rgba(100, 200, 255, 1)" : "lightgray",fontWeight: !Switch ? "bold" : "normal"}}>User</Text>
                                </TouchableOpacity>
                                </>
                                :
                                <>
                                <TouchableOpacity onPress={()=> {setSwitch(true);setStep(1); setUser(false)}} style={{width:"20%",justifyContent:"center",alignItems:"center",height:50,borderRadius:50}} >
                                    <MaterialIcons name='keyboard-arrow-left' size={40} color={"lightgray"} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{backgroundColor: users ? "rgba(50, 50, 50, 1)" : "transparent" ,width:users && "80%",elevation: users ? 7 : 0,justifyContent:"center",alignItems:"center",height:50,borderRadius:50}}>
                                     <Text style={{fontSize:16, color: users? " rgba(100, 200, 255, 1)" : "lightgray",fontWeight: users ? "bold" : "normal"}}>Create User</Text>
                                </TouchableOpacity>
                                </>
                            }
            </View>



            {Switch && step === 1 ? 
            
                <Animated.View style={[{flex:1, justifyContent:"space-between"},formStep1Style]}>

                    <View style={{marginTop:30}}>
                        <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color={"dimgray"} />
                        <TextInput style={{ width:"100%",color:"white", height:60,borderColor:"gray",borderWidth:1, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="visible-password" inputMode="text" placeholder="Confirm Password" secureTextEntry={ViewPass} textContentType="password" value={confirmPassword} onChangeText={(txt) => setConfrimPassword(txt)} placeholderTextColor={"lightgray"}  cursorColor={"dimgray"}/>
                        <TouchableOpacity onPress={() => setViewPass(!ViewPass)}  style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"dimgray"} /></TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={Confirm} style={{justifyContent:"center", alignSelf:"center", alignItems:"center", backgroundColor:"rgba(50, 50, 50, 1)", height:50, width:"100%", borderRadius:50, elevation:3}}>
                        {showActivity ?   
                            <ActivityIndicator size={'small'} color={" rgba(100, 200, 255, 1)"} />
                            :
                            <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:18}}>Confirm</Text>
                        }
                    </TouchableOpacity>

                    <View style={{flexDirection:"row",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"rgba(240, 240, 240, 1)"}}>Not An Admin?</Text>
                        <TouchableOpacity onPress={()=> {setStep(3); setUser(true)}} style={{marginLeft:8}}>
                            <Text style={{color:" rgba(100, 200, 255, 1)"}}>Create users account</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                :
                !Switch && step === 2 ?  

                    <Animated.View style={[{flex:1, justifyContent:"space-between"},formStep2Style]}>

                    <View>
                        <Feather style={{position:"absolute", left:20, top:20,zIndex:2}} name="at-sign" size={23} color={"dimgray"}/>
                        <TextInput style={{ width:"100%",color:"white", height:60, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  inputMode="email" placeholder="Email" placeholderTextColor={"lightgray"} value={signUpEmail} onChangeText={(text)=> setSignUpEmail(text)} textContentType="emailAddress" cursorColor={"gray"}/>
                    </View>

                    <View>
                        <MaterialIcons style={{position:"absolute", left:20, top:20,zIndex:2}}  name="key" size={24} color={"dimgray"} />
                        <TextInput style={{ width:"100%",color:"white", height:60,borderColor:"gray",borderWidth:1, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="visible-password" inputMode="text" placeholder="Password" secureTextEntry={ViewPass} textContentType="password" value={loginPassword} onChangeText={(txt) => setLoginPassword(txt)} placeholderTextColor={"lightgray"}  cursorColor={"dimgray"}/>
                        <TouchableOpacity onPress={() => setViewPass(!ViewPass)}  style={{position:"absolute", right:20, top:20,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"dimgray"} /></TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={Login} style={{justifyContent:"center", alignSelf:"center", alignItems:"center", backgroundColor:"rgba(50, 50, 50, 1)", height:50, width:"100%", borderRadius:50, elevation:3}}>
                        {showActivity ?   
                            <ActivityIndicator size={'small'} color={" rgba(100, 200, 255, 1)"} />
                            :
                            <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:18}}>LogIn User</Text>
                        }
                    </TouchableOpacity>

                    <View style={{flexDirection:"row",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"rgba(240, 240, 240, 1)"}}>Don't have account?</Text>
                        <TouchableOpacity onPress={()=> {setStep(3); setUser(true)}} style={{marginLeft:8}}>
                            <Text style={{color:" rgba(100, 200, 255, 1)"}}>Create users account</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            :
              (users &&  step === 3) &&
                    <Animated.View style={[{flex:1, justifyContent:"space-between"},formStep3Style]}>

                    <View>
                        <Feather style={{position:"absolute", left:20, top:15,zIndex:2}} name="user" size={23} color={"dimgray"}/>
                        <TextInput style={{ width:"100%",color:"white", height:50, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  inputMode="text" placeholder="Role" placeholderTextColor={"lightgray"} value={role} onChangeText={(text)=> setRole(text)} textContentType="emailAddress" cursorColor={"gray"}/>
                    </View>
                    
                    <View>
                        <Feather style={{position:"absolute", left:20, top:15,zIndex:2}} name="at-sign" size={23} color={"dimgray"}/>
                        <TextInput style={{ width:"100%",color:"white", height:50, borderRadius:50,paddingHorizontal:15,paddingLeft:55,fontSize:17,borderColor:"gray",borderWidth:1}}  inputMode="email" placeholder="Email" placeholderTextColor={"lightgray"} value={signUpEmail} onChangeText={(text)=> setSignUpEmail(text)} textContentType="emailAddress" cursorColor={"gray"}/>
                    </View>

                    <View>
                        <MaterialIcons style={{position:"absolute", left:20, top:15,zIndex:2}}  name="key" size={24} color={"dimgray"} />
                        <TextInput style={{ width:"100%",color:"white", height:50,borderColor:"gray",borderWidth:1, borderRadius:50,paddingHorizontal:55,fontSize:17}}  keyboardType="visible-password" inputMode="text" placeholder="Password" secureTextEntry={ViewPass} textContentType="password" value={loginPassword} onChangeText={(txt) => setLoginPassword(txt)} placeholderTextColor={"lightgray"}  cursorColor={"dimgray"}/>
                        <TouchableOpacity onPress={() => setViewPass(!ViewPass)}  style={{position:"absolute", right:20, top:15,zIndex:2}} ><MaterialCommunityIcons  name="eye-off" size={24} color={"dimgray"} /></TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleSignUp} style={{justifyContent:"center", alignSelf:"center", alignItems:"center", backgroundColor:"rgba(50, 50, 50, 1)", height:50, width:"100%", borderRadius:50, elevation:3}}>
                        {showActivity ?   
                            <ActivityIndicator size={'small'} color={" rgba(100, 200, 255, 1)"} />
                            :
                            <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:18}}>Create User</Text>
                        }
                    </TouchableOpacity>

                    <View style={{flexDirection:"row",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"rgba(240, 240, 240, 1)"}}>Have an account?</Text>
                        <TouchableOpacity onPress={()=>{setStep(2); setUser(false); setSwitch(false)}} style={{marginLeft:8}}>
                            <Text style={{color:" rgba(100, 200, 255, 1)"}}>LogIn User</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            }
        </View>
    </View>
  )
}

export default Users