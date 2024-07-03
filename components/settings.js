import React, { useEffect, useLayoutEffect, useState ,useRef} from "react";
import { TextInput, View, Text,Pressable, FlatList, Image, TouchableOpacity,Alert, StatusBar, Modal, Switch, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ModalScreen from "./modalScreen";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native";
import { getAuth , signOut} from "firebase/auth";
import { FAB } from "react-native-paper";
import email from 'react-native-email';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { collection ,doc,getFirestore, setDoc} from "firebase/firestore";



export default function Settings ({route}){
    const {username, ChurchName} = route.params
    const navigation = useNavigation()
    const [isActive, setActive] = useState(true)
    const [isModal, setModal] = useState(false)
    const auth = getAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading,setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const body = useRef(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const db = getFirestore()

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setLoading(false)
    };
    

    const sendEmail = () => {
        setLoading(true); // Start loading state
    
        const to = ['joshuamills105@gmail.com'];
        const emailOptions = {
          subject: 'Assistance Needed!',
          body: body.current.value,
        };
    
        email(to, emailOptions)
          .then(() => {
            console.log('Email sent successfully');
            setLoading(false); // Stop loading state
            // Handle success
          })
          .catch(error => {
            console.error('Error sending email:', error);
            setLoading(false); // Stop loading state
            // Handle error
          });
      };



    //function to signout user
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                console.log("User signed out successfully");
                navigation.navigate("LogIn")
            })
            .catch((error) => {
                // An error happened.
                console.error("Error signing out user:", error);
            });
    }


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
/*
      useEffect(()=>{
        if(selectedImage !== null){
            const uploadImage = async()=>{
                    try{
                        const userDetailsDocRef = doc(db, 'UserDetails', ChurchName?.id);
                
                        // Example data for a member document within the subcollection
                        const userDetails = {
                            ChurchName: ChurchName?.ChurchName,
                            email: ChurchName?.email,
                            password: ChurchName?.password,
                            Image: selectedImage,
                            id: ChurchName?.id
                        };
                
                        // Set a document within the Members subcollection
                        await setDoc(userDetailsDocRef, userDetails);
            
                        // Clear form fields after successful registration
                        Alert.alert("Success", "Image Updated Successful!");
                        } 
                        catch (error) {
                        console.error("Error updating image: ", error);
                        Alert.alert("Image Upload Error", error.message);
                    
                    }
                    
            }
            uploadImage()
        }
            
    },[selectedImage])
        
*/

    const Support = ()=>{
        return (
           <View style={{ position:"absolute",alignSelf:"center",padding:10,borderRadius:15,justifyContent:"space-between", bottom:130,right:20,height:200,width:"80%",elevation:5, backgroundColor:"white", }}>
                <View style={{alignItems:"center",flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{fontSize:17, fontWeight:"800", color:"rgba(0, 0, 128, 0.8)"}}>Church Admin</Text>
                    <Ionicons name="close-sharp" size={23} color={"red"} onPress={toggleModal}/>
                </View>
                <View>
                    <Text>How can i assist you today?</Text>
                </View>
                <View>
                    <TextInput ref={body} style={{backgroundColor:"lightgray",fontSize:15, height:90,borderRadius:10 ,padding:10}} multiline={true} textAlignVertical="top" placeholder="message"  />
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{toggleModal();setLoading(true); sendEmail()}} style={{backgroundColor:"rgba(0, 0, 128, 0.8)", width:"30%",height:30,alignSelf:"center",justifyContent:"center",alignItems:"center", borderRadius:10,}}>
                        <Text style={{color:"white", fontWeight:"500",}}>Send</Text>
                    </TouchableOpacity>
                </View>
           </View>
           )
    
        }

    

    return(
        <View style={{flex:1, justifyContent:"space-between"}}>


            <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>


            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:10}}>
                            <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"white",elevation:6}}>
                                <MaterialIcons name="admin-panel-settings" color={"rgba(0, 0, 128, 0.8)"} size={38}/>
                            </View>

                            <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"center", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"white" }}>
                                <Text style={{fontSize:25,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)"}}>Settings</Text>
                            </View>
            </View>
            
        
            <View style={{paddingHorizontal:15,paddingVertical:5, justifyContent:"space-between", flex:1, }}>
                <View >
                    <View>
                        <Text style={{fontSize:18, fontWeight:"500"}}>
                            Account
                        </Text>

                    </View>

                    <View style={{flexDirection:"row",elevation:3, backgroundColor:"white",marginTop:10,borderRadius:15, height:80, alignItems:"center",padding:10 , justifyContent:"flex-start", marginBottom:10}}>
                        <View style={{marginRight:10}}>
                            {ChurchName?.Image || selectedImage ? 
                                <TouchableOpacity onPress={pickImage} style={{width:60,height:60, alignItems:"center", justifyContent:"center"}}>
                                    <Image source={{uri : ChurchName?.Image || selectedImage}}  style={{width:60, height:60,borderRadius:50}}  />
                                </TouchableOpacity> :
                                <View style={{alignItems:"center", justifyContent:"center"}}>
                                    <Ionicons name="person-circle-sharp" size={60}  color={"gray"} onPress={pickImage} />
                                </View>
                            }
                        </View>

                        <View >
                            <Text style={{fontSize:19,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                {ChurchName?.ChurchName.toUpperCase()}
                            </Text>

                            <Text style={{fontSize:17,fontWeight:"400",color:"gray",marginTop:2}}>
                                {username}
                            </Text>
                        </View>
                    </View>

                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:25, marginTop:15, justifyContent:"space-between" }}>
                <View >

                    <View>
                        <Text style={{fontSize:18, fontWeight:"500"}}>
                            General
                        </Text>

                    </View>
                    
                    <View style={{backgroundColor:"white" ,elevation:1, marginTop:10, borderRadius:15, }}>

                        <TouchableHighlight onPress={()=>{}} underlayColor="#ccc" style={{flexDirection:"row",  height:80, alignItems:"center",padding:20 ,borderTopRightRadius:15,borderTopLeftRadius:15, justifyContent:"space-between"}}>
                            <> 
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <View style={{marginRight:15}}>
                                    <Ionicons name="invert-mode" size={30} color={"gray"}/>
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                        Light mode
                                    </Text>

                                    <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                        Change app looks
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Switch value={true}  thumbColor={"white"} trackColor={"lightgray"}/>
                            </View>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ccc" onPress={()=> {}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20, justifyContent:"flex-start"}}>
                            <>
                            <View style={{marginRight:15}}>
                                <Ionicons name="notifications-outline" size={30}  color={"gray"}/>
                            </View>

                            <View style={{paddingRight:25,}}>
                                <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                    Notifications
                                </Text>

                                <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                    Control how the app alerts you
                                </Text>
                            </View>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ccc" onPress={()=> {}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 , justifyContent:"flex-start"}}>
                            <> 
                            <View style={{marginRight:15}}>
                                <Ionicons name="shield-checkmark-outline" size={30}  color={"gray"}/>
                            </View>

                            <View style={{paddingRight:25,}}>
                                <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                    Privacy
                                </Text>

                                <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2,}}>
                                    Manage how your data is handled and shared
                                </Text>
                            </View>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ccc" onPress={()=>{}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 , justifyContent:"flex-start"}}>
                            <>
                            <View style={{marginRight:15}}>
                                <Ionicons name="lock-closed-outline" size={30} color={"gray"}/>
                            </View>

                            <View style={{paddingRight:25,}}>
                                <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                    Security
                                </Text>

                                <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                    Customize security features to fit your needs
                                </Text>
                            </View>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight underlayColor="#ccc" onPress={()=>{}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 ,borderBottomLeftRadius:15,borderBottomRightRadius:15, justifyContent:"flex-start"}}>
                            <>
                            <View style={{marginRight:15}}>
                                <Ionicons name="language-outline" size={30} color={"gray"} />
                            </View>

                            <View style={{paddingRight:25,}}>
                                <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                    Language
                                </Text>

                                <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                    English
                                </Text>
                            </View>
                            </>
                        </TouchableHighlight>

                    </View>
                </View>

                <TouchableHighlight underlayColor="#ccc" onPress={()=>{}} style={{flexDirection:"row", backgroundColor:"white",elevation:1, borderRadius:15,marginTop:15, height:60, alignItems:"center",paddingHorizontal:25 , justifyContent:"space-between"}}>
                            <>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <View style={{marginRight:15}}>
                                    <Ionicons name="cash-outline" size={30} color={"gray"}/>
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                        Payments
                                    </Text>

                                    <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                        Mobile money
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <MaterialIcons name="arrow-right" size={30} color={"gray"} />
                            </View>
                            </>
                </TouchableHighlight>

                

                <TouchableOpacity onPress={handleSignOut} style={{flexDirection:"row" ,marginTop:15,backgroundColor:"white",elevation:1,borderRadius:15, height:60, alignItems:"center",paddingHorizontal:25 , justifyContent:"flex-start"}}>
                    
                        <View style={{marginRight:15}}>
                            <Ionicons name="log-out-outline"  size={30} color={"rgba(0, 0, 128, 0.8)"}/>
                        </View>    
                        
                        <View >
                            <Text style={{fontSize:19,fontWeight:"600", color:"rgba(0, 0, 128, 0.8)"}}>Log out</Text>
                        </View>
             
                </TouchableOpacity>

                </ScrollView>

                <FAB variant="surface" loading={loading} onPress={()=>{ setModalVisible(true); Support()}} label="Support"  icon={"chat-outline"} color="rgba(0, 0, 128, 0.8)"  style={{width:100,alignItems:"center",justifyContent:"center", height:55, position:"absolute" , bottom:12, backgroundColor:"white", right:15}}/>
            </View>



            
            <View >
                <View  style={{flexDirection:"row",backgroundColor:"white", justifyContent:"space-around",paddingVertical:5,borderTopWidth:1,borderColor:"lightgray"}}>
                       
                    
                            <Pressable onPress={()=> navigation.navigate("ModalScreen", {username:username, ChurchName : ChurchName})} >
                           
                                    <View style={{alignItems:"center"}}>
                                        <MaterialCommunityIcons name="view-dashboard-outline" size={28} color={"gray"} />
                                        <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                            More
                                        </Text>
                                    </View>
                                   
                            </Pressable>

                            <Pressable onPress={()=> navigation.replace("Church Admin")}>
                               
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home-outline" size={27} color={"gray"}   />
                                    <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                           
                            </Pressable>
                         

                            <Pressable onPress={()=> navigation.navigate("Settings", {username: username, ChurchName:ChurchName})}  >
                                {({pressed})=>(
                                    <View style={{alignItems:"center"}}>
                                        <Ionicons name="settings-sharp" size={27} color={pressed || isActive ? "rgba(0, 0, 128, 0.8)" :"gray"} />
                                        <Text style={{color: pressed || isActive ? "rgba(0, 0, 128, 0.8)" : "gray",fontWeight:"500", fontSize:12}}>
                                            Settings
                                        </Text>
                                    </View>
                                 )}
                            </Pressable>
                            
                    
                    </View>
                </View>

            {modalVisible && <Support  />}

           {isModal && <ModalScreen name = {username}/>}
        </View>
    )
}

