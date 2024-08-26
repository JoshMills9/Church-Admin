import React, { useEffect, useLayoutEffect, useState ,useRef} from "react";
import { TextInput, View, Text,Pressable, FlatList, Image,ToastAndroid, TouchableOpacity,Alert, StatusBar, Modal, Switch, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ModalScreen from "./modalScreen";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native";
import { getAuth , signOut, deleteUser} from "firebase/auth";
import { FAB } from "react-native-paper";
import email from 'react-native-email';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, setDoc, collection, query, where, doc,getDocs,deleteDoc, updateDoc, deleteField} from "firebase/firestore";


import AsyncStorage from '@react-native-async-storage/async-storage';





export default function Settings ({route}){
    const {username, ChurchName, events} = route.params

    const navigation = useNavigation()
    const [isActive, setActive] = useState(true)
    const [isModal, setModal] = useState(false)
    const auth = getAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading,setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [body, setBody ]= useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const db = getFirestore()


    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setLoading(false)
    };
    

    const sendEmail = () => {
        setLoading(true); // Start loading state
    
        const to = 'joshuamills105@gmail.com';
        const emailOptions = {
          subject: 'Assistance Needed!',
          body: body
        };
    
        email(to, emailOptions)
          .then(() => {
            ToastAndroid.show('Email sent successfully!', ToastAndroid.SHORT);
            setLoading(false); // Stop loading state
            // Handle success
          })
          .catch(error => {
            console.error('Error sending email:', error);
            setLoading(false); // Stop loading state
            // Handle error
          });
      };

      const clearAllData = async () => {
        try {
          await AsyncStorage.clear();
          console.log('All data cleared!');
        } catch (error) {
          console.error('Error clearing data:', error);
        }
      };
      
      


    //function to signout user
    const handleSignOut = () => {
        clearAllData()
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                ToastAndroid.show("You've Signed Out!", ToastAndroid.LONG);
                navigation.navigate("LogIn")
            })
            .catch((error) => {
                // An error happened.
                console.error("Error signing out user:", error.message);
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
  

        
        // Function to delete user details from auth
        const deleteUserAccount = async () => {
            const user = auth.currentUser;
            try {
                // Check if user is signed in
                if (user) {
                    // Delete the user
                    await deleteUser(user);
                    Alert.alert("---- Church Administrator ----", 'Account deleted successfully.');
                    navigation.navigate("LogIn")
                } else {
                    // User is not signed in
                    console.log('No user signed in.');
                }
            } catch (error) {
                // Handle error
                console.error('Error deleting user:', error.message);
                // Display error message to the user or handle it appropriately
            }
        };



     /* delete user details from db
     const deleteFieldByEmail = async () => {
        const usersCollectionRef = collection(db, 'UserDetails');
    
        const q = query(usersCollectionRef, where('userDetails.email', '==', mainEmail));
    
        try {
            const querySnapshot = await getDocs(q);
    
            for (const document of querySnapshot.docs) {
                const docRef = doc(db, `UserDetails/${document.id}`); // Add db here
    
                await updateDoc(docRef, {
                    ["userDetails"]: deleteField()
                });

                console.log(`Field  deleted from document with ID: ${document.id}`);
            }
            deleteUserAccount()
            return true;
        } catch (error) {
            console.error('Error deleting field:', error);
            return false;
        }
    };


*/

const deleteFieldByEmail = async () => {
    const usersCollectionRef = collection(db, 'UserDetails');
    
    try {
        // Query for documents where userDetails.email matches mainEmail
        const q = query(usersCollectionRef, where('userDetails.email', '==', mainEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming you want to delete the first document found
            const doc = querySnapshot.docs[0]; // Get the first document

            // Delete the document by its ID
            await deleteDoc(doc.ref);

            deleteUserAccount()
            return true;
        } else {
            console.log(`No document found where userDetails.email matches ${mainEmail}`);
            return false;
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        return false;
    }
}






    const Support = ()=>{
        return (
           <View style={{ position:"absolute",alignSelf:"center",padding:10,borderRadius:15,justifyContent:"space-between", bottom:130,right:20,height:200,width:"80%",elevation:5, backgroundColor:"rgba(30, 30, 30, 1)" }}>
                <View style={{alignItems:"center",flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{fontSize:17, fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Church Admin</Text>
                    <Ionicons name="close-sharp" size={23} color={"red"} onPress={toggleModal}/>
                </View>
                <View>
                    <Text style={{color:"rgba(240, 240, 240, 1)"}}>How can we assist you?</Text>
                </View>
                <View>
                    <TextInput value={body} onChangeText={(txt)=> setBody(txt)} style={{backgroundColor:"gray",color:"white",fontSize:15, height:90,borderRadius:10 ,padding:10}} multiline={true} textAlignVertical="top" placeholder="message"  />
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{toggleModal();setLoading(true); sendEmail()}} style={{backgroundColor:"rgba(50, 50, 50, 1)", width:"30%",height:30,alignSelf:"center",justifyContent:"center",alignItems:"center", borderRadius:10,}}>
                        <Text style={{color:" rgba(100, 200, 255, 1)", fontWeight:"500",}}>Send</Text>
                    </TouchableOpacity>
                </View>
           </View>
           )
    
        }

    

    return(
        <View style={{flex:1, justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>


            <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>


            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:10}}>
                            <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"rgba(50, 50, 50, 1)",elevation:6}}>
                                <MaterialIcons name="admin-panel-settings" color={"rgba(240, 240, 240, 1)"} size={38}/>
                            </View>

                            <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"center", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                                <Text style={{fontSize:25,fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Settings</Text>
                            </View>
            </View>
            
        
            <View style={{paddingHorizontal:15,paddingVertical:5, justifyContent:"space-between", flex:1, }}>
                <View >
                    <View>
                        <Text style={{fontSize:18, fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>
                            Account
                        </Text>

                    </View>

                    <View style={{flexDirection:"row",elevation:3, backgroundColor:"rgba(50, 50, 50, 1)",marginTop:10,borderRadius:15, height:80, alignItems:"center",padding:10 , justifyContent:"flex-start", marginBottom:10}}>
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
                            <Text style={{fontSize:19,fontWeight:"800",color:"rgba(240, 240, 240, 1)",}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                {ChurchName?.ChurchName?.toUpperCase() || ChurchName?.toUpperCase()}
                            </Text>

                            <Text style={{fontSize:15,fontWeight:"400",color:"gray",marginTop:2}} adjustsFontSizeToFit={true} numberOfLines={1}>
                               {username}
                            </Text>
                        </View>
                    </View>

                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:25, marginTop:15, justifyContent:"space-between" }}>
                    <View >

                        <View>
                            <Text style={{fontSize:18, fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>
                                General
                            </Text>

                        </View>
                        
                        <View style={{backgroundColor:"rgba(50, 50, 50, 1)" ,elevation:1, marginTop:10, borderRadius:15, }}>

                            <TouchableHighlight onPress={()=>{}} underlayColor="rgba(70, 70, 70, 1)" style={{flexDirection:"row",  height:80, alignItems:"center",padding:20 ,borderTopRightRadius:15,borderTopLeftRadius:15, justifyContent:"space-between"}}>
                                <> 
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <View style={{marginRight:15}}>
                                        <Ionicons name="invert-mode" size={30} color={"gray"}/>
                                    </View>

                                    <View style={{paddingRight:25,}}>
                                        <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                            Light mode
                                        </Text>

                                        <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                            Change app looks
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Switch value={true}  thumbColor={"rgba(240, 240, 240, 1)"}  trackColor={"lightgray"}/>
                                </View>
                                </>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=> {navigation.navigate("Notification",{username: username , ChurchName : ChurchName,events: events})}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20, justifyContent:"flex-start"}}>
                                <>
                                <View style={{marginRight:15}}>
                                    <Ionicons name="notifications-outline" size={30}  color={"gray"}/>
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                        Notifications
                                    </Text>

                                    <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                        Control how the app alerts you
                                    </Text>
                                </View>
                                </>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=> {}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 , justifyContent:"flex-start"}}>
                                <> 
                                <View style={{marginRight:15}}>
                                    <Ionicons name="shield-checkmark-outline" size={30}  color={"gray"}/>
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                        Privacy
                                    </Text>

                                    <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2,}}>
                                        Manage how your data is handled and shared
                                    </Text>
                                </View>
                                </>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=>{}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 , justifyContent:"flex-start"}}>
                                <>
                                <View style={{marginRight:15}}>
                                    <Ionicons name="lock-closed-outline" size={30} color={"gray"}/>
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                        Security
                                    </Text>

                                    <Text style={{fontSize:14,fontWeight:"400",color:"gray",marginTop:2}}>
                                        Customize security features to fit your needs
                                    </Text>
                                </View>
                                </>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=>{}} style={{flexDirection:"row", height:80, alignItems:"center",padding:20 ,borderBottomLeftRadius:15,borderBottomRightRadius:15, justifyContent:"flex-start"}}>
                                <>
                                <View style={{marginRight:15}}>
                                    <Ionicons name="language-outline" size={30} color={"gray"} />
                                </View>

                                <View style={{paddingRight:25,}}>
                                    <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
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

                        <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=> { navigation.navigate("Payment",{username: username , ChurchName : ChurchName, events: events})}} style={{flexDirection:"row", backgroundColor:"rgba(50, 50, 50, 1)",elevation:1, borderRadius:15,marginTop:15, height:60, alignItems:"center",paddingHorizontal:25 , justifyContent:"space-between"}}>
                                    <>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <View style={{marginRight:15}}>
                                            <Ionicons name="cash-outline" size={30} color={"gray"}/>
                                        </View>

                                        <View style={{paddingRight:25,}}>
                                            <Text style={{fontSize:19,fontWeight:"500",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true} numberOfLines={1}>
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

                        

                        <TouchableOpacity onPress={handleSignOut} style={{flexDirection:"row" ,marginTop:15,backgroundColor:"rgba(50, 50, 50, 1)",elevation:1,borderRadius:15, height:60, alignItems:"center",paddingHorizontal:25 , justifyContent:"flex-start"}}>
                            
                                <View style={{marginRight:15}}>
                                    <Ionicons name="log-out-outline"  size={30} color={" rgba(100, 200, 255, 1)"}/>
                                </View>    
                                
                                <View >
                                    <Text style={{fontSize:19,fontWeight:"600", color:" rgba(100, 200, 255, 1)"}}>Log out</Text>
                                </View>
                    
                        </TouchableOpacity>

                    
                        <TouchableOpacity  onPress={()=> {}} style={{flexDirection:"row" , marginTop:8, height:60, alignItems:"center" , justifyContent:"flex-start",marginLeft:65}}>
                                
                                <View style={{marginRight:10}}>
                                    <Ionicons name="remove-circle-outline"  size={28} color={"orangered"}/>
                                </View>    
                                
                                <View >
                                    <Text style={{fontSize:18,fontWeight:"600", color:"orangered"}}>Delete account</Text>
                                </View>
                    
                        </TouchableOpacity>

                </ScrollView>

                <FAB variant="surface" loading={loading} onPress={()=>{ setModalVisible(true); Support()}} label="Support"  icon={"chat-outline"} color="rgba(240, 240, 240, 1)"  style={{width:110,alignItems:"center",justifyContent:"center", height:55, position:"absolute" , bottom:12, backgroundColor:"rgba(50, 50, 50, 1)", right:15}}/>
            </View>



            
            <View >
                <View  style={{flexDirection:"row",backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:"space-around",paddingVertical:5,borderTopWidth:1,borderColor:"gray"}}>
                       
                    
                            <Pressable style={{width:120}}  onPress={()=> navigation.navigate("ModalScreen", {username:username, ChurchName : ChurchName , events: events})} >
                           
                                    <View style={{alignItems:"center"}}>
                                        <MaterialCommunityIcons name="view-dashboard-outline" size={28} color={"gray"} />
                                        <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                            More
                                        </Text>
                                    </View>
                                   
                            </Pressable>

                            <Pressable style={{width:120}}  onPress={()=> navigation.navigate("Church Admin")}>
                               
                                <View style={{alignItems:"center",}}>
                                    <Ionicons name="home-outline" size={27} color={"gray"}   />
                                    <Text style={{color:"gray",fontWeight:"500", fontSize:12}}>
                                        Home
                                    </Text>
                                </View>
                           
                            </Pressable>
                         

                            <Pressable style={{width:120}}  onPress={()=> navigation.navigate("Settings", {username: username, ChurchName:ChurchName})}  >
                                {({pressed})=>(
                                    <View style={{alignItems:"center"}}>
                                        <Ionicons name="settings-sharp" size={27} color={pressed || isActive ? " rgba(100, 200, 255, 1)" :"gray"} />
                                        <Text style={{color: pressed || isActive ? " rgba(100, 200, 255, 1)" : "gray",fontWeight:"500", fontSize:12}}>
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

