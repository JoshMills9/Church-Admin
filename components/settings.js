import React, { useEffect, useLayoutEffect, useState ,useRef} from "react";
import { TextInput, View, Text,Pressable, FlatList, Image,ToastAndroid, TouchableOpacity,Alert, Switch, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import ModalScreen from "./modalScreen";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native";
import { getAuth , signOut, deleteUser} from "firebase/auth";
import { FAB , Badge} from "react-native-paper";
import email from 'react-native-email';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, setDoc, collection, query, where, doc,getDocs,deleteDoc, updateDoc, deleteField} from "firebase/firestore";


import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djb8fanwt/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my_images';  // Replace with your upload preset



export default function Settings ({route}){
    const navigation = useNavigation()

    const {username, ChurchName, events, NoOfEvent} = route.params

    const [isActive, setActive] = useState(true)
    const [isModal, setModal] = useState(false)
    const auth = getAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading,setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [body, setBody ]= useState("")
    const [selectedImage, setSelectedImage] = useState(false);
    const db = getFirestore()



    const [info, setInfo] = useState()


    //get chhurch info from storage
    useLayoutEffect(()=>{
        const getAccountDetails = async () => {
            try {
              const value = await AsyncStorage.getItem('churchInfo');
              if (value !== '') {
                setInfo(JSON.parse(value))
              } else {
                console.log("no item")
              }
            } catch (error) {
              console.error('Error checking church info', error);
            }
          };
          getAccountDetails();
          setSelectedImage(false)
    }, [selectedImage])


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

              info.Image = data.secure_url

              await AsyncStorage.setItem('churchInfo', JSON.stringify(info));

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

   
   useEffect(()=>{
        if(selectedImage){
            const uploadImage = async()=>{
                    try{
                        const userDetailsDocRef = doc(db, 'UserDetails', ChurchName?.id);
                
                        // Set a document within the Members subcollection
                        await updateDoc(userDetailsDocRef, {
                            "userDetails.Image": info.Image
                        });
            
                        // Clear form fields after successful registration
                        ToastAndroid.show("Image Updated Successfully!", ToastAndroid.LONG);
                        } 
                        catch (error) {
                        console.error("Error updating image: ", error);
                        Alert.alert("Image Upload Error", error.message);
                    
                    }
                    
            }
            uploadImage()
        }
            
    },[selectedImage])
        



        
        // Function to delete user details from auth
        const deleteUserAccount = async () => {
            const user = auth.currentUser;
            try {
                // Check if user is signed in
                if (user) {
                    // Delete the user
                    await deleteUser(user);
                    ToastAndroid.show('Account deleted successfully!.', ToastAndroid.LONG);
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


        const deleteDocumentByEmail = async (emailToSearch) => {
            const usersCollectionRef = collection(db, 'UserDetails');  // Reference to the collection

            // Query to find documents where the 'userDetails.email' field matches the given email
            const q = query(usersCollectionRef, where('userDetails.email', '==', emailToSearch));

            try {
                const querySnapshot = await getDocs(q);  // Execute the query to get matching documents

                if (querySnapshot.empty) {
                    console.log('No matching documents found.');
                    return false;  // No documents were found
                }

                const deletions = [];  // Array to store deletion promises

                querySnapshot.forEach((document) => {
                    const docRef = doc(db, `UserDetails/${document.id}`);  // Ensure you're referencing the correct path to the document
                    deletions.push(deleteDoc(docRef)  // Delete document
                        .then(() => {
                            console.log(`Document with ID ${document.id} deleted.`);
                        })
                        .catch((error) => {
                            console.error(`Error deleting document with ID ${document.id}:`, error);
                        })
                    );
                });

                // Wait for all deletions to complete
                await Promise.all(deletions);

                clearAllData();
                deleteUserAccount()  // Make sure this function is defined and works as expected
                navigation.navigate("LogIn");  // Navigate to login screen after deletion
                return true;  // Indicate success if deletion was successful
            } catch (error) {
                console.error('Error querying and deleting documents:', error);
                return false;  // Return false if there was an error during the process
            }
        };
                








    const Support = ()=>{
        return (
           <View style={{ position:"absolute",alignSelf:"center",padding:10,borderRadius:15,justifyContent:"space-between", bottom:130,right:20,height:200,width:"80%",elevation:5, backgroundColor:"rgba(30, 30, 30, 1)" }}>
                <View style={{alignItems:"center",flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{fontSize:17, fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Church Administrator</Text>
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


            <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>



            <View style={{height:60,marginTop:20, width:"100%", alignItems:"center",flexDirection:'row',paddingHorizontal:15, elevation:5, backgroundColor:"rgba(50, 50, 50, 1)"}}>
    
                <MaterialIcons name="admin-panel-settings" color={"rgba(240, 240, 240, 1)"} size={38}/>

                <Text style={{fontSize:25,fontWeight:"800",color:"rgba(240, 240, 240, 1)", marginLeft:20}}>Settings</Text>
            </View>

            
        
            <View style={{paddingHorizontal:15,paddingVertical:5, justifyContent:"space-between", flex:1, }}>
                <View >
                    <View>
                        <Text style={{fontSize:18, fontWeight:"500",color:"rgba(240, 240, 240, 1)"}}>
                            Account
                        </Text>

                    </View>

                    <View style={{flexDirection:"row",elevation:3, backgroundColor:"rgba(50, 50, 50, 1)",marginTop:10,borderRadius:15, height:80, alignItems:"center",padding:10 , justifyContent:"flex-start", marginBottom:10}}>
                        <TouchableOpacity onPress={() => {Alert.alert("", "CHOOSE HOW TO UPLOAD IMAGE", [
                                { text: "CAMERA", onPress: () => {pickImage("camera")}},
                                { text: "GALLERY", onPress: () => {pickImage("gallery")}},
                                ]);}} style={{marginRight:12, borderWidth: info?.Image ? 2 : 0, borderRadius:50, borderColor:"dimgray"}}>
                                {info?.Image? 
                                    <View  style={{width:60,height:60, alignItems:"center", justifyContent:"center"}}>
                                        <Image source={{uri : info?.Image}}  style={{width:60, height:60,borderRadius:50}}  />
                                    </View> :
                                    <View onPress={() => {
                                        Alert.alert("", "CHOOSE HOW TO UPLOAD IMAGE", [
                                          { text: "CAMERA", onPress: () => {pickImage("camera")}},
                                          { text: "GALLERY", onPress: () => {pickImage("gallery")}},
                                        ]);
                                      }} style={{ width:65,height:65,}}>
                                        <Ionicons name="person-circle-sharp" size={70} color={"gray"} />
                                    </View>
                            }
                            <View style={{position:'absolute',elevation:5, bottom:0, right:-4,borderWidth:0.5, borderColor:"dimgray", backgroundColor:"white",width:23,justifyContent:"center",alignItems:"center", height:23, borderRadius:50}}>
                                <Ionicons name="camera-outline" size={14}/>
                            </View>
                           
                        </TouchableOpacity>

                        <View>
                            <Text style={{fontSize:19,fontWeight:"800",color:"rgba(240, 240, 240, 1)", width:280}} adjustsFontSizeToFit={true} numberOfLines={1}>
                                {info?.ChurchName?.toUpperCase()}
                            </Text>

                            <Text style={{fontSize:15,fontWeight:"400",color:"gray",marginTop:2}} adjustsFontSizeToFit={true} numberOfLines={1}>
                               {username}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate("ChangeAccountName", {username:username, ChurchName: ChurchName, NoOfEvent: NoOfEvent, events: events})} style={{position:"absolute", right:0, width:50,height:30,justifyContent:"center", alignItems:"center", bottom:10}}>
                            <Ionicons name="pencil" size={16} color={"white"}/>
                        </TouchableOpacity>
                    </View>

                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:18, marginTop:15, justifyContent:"space-between" }}>
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
                                    {<Badge style={{position:"absolute",top:0,right:-2}} size={15}>{NoOfEvent || 0}</Badge>} 
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

                        

                        <TouchableHighlight  underlayColor="rgba(70, 70, 70, 1)" onPress={() => { clearAllData() ; handleSignOut()}} style={{flexDirection:"row" ,marginTop:15,backgroundColor:"rgba(50, 50, 50, 1)",elevation:1,borderRadius:15, height:60, alignItems:"center",paddingHorizontal:25 , justifyContent:"flex-start"}}>
                                <>
                                    <View style={{marginRight:15}}>
                                        <Ionicons name="log-out-outline"  size={30} color={" rgba(100, 200, 255, 1)"}/>
                                    </View>    
                                    
                                    <View >
                                        <Text style={{fontSize:19,fontWeight:"600", color:" rgba(100, 200, 255, 1)"}}>Log out</Text>
                                    </View>
                                </>
                        </TouchableHighlight>

                    
                        <TouchableOpacity onPress={() => {
                                        Alert.alert("", "CONFIRM DELETE", [
                                        { text: "Cancel", onPress:() => {},style: "cancel" },
                                        { text: "Yes", onPress:() => {deleteDocumentByEmail(ChurchName?.email)} },
                                        ]);
                                    }} style={{flexDirection:"row" , marginTop:10, height:60, alignItems:"center" , justifyContent:"center",}}>
                                
                                <View style={{marginRight:10}}>
                                    <Ionicons name="remove-circle-outline"  size={28} color={"orangered"}/>
                                </View>    
                                
                                <View >
                                    <Text style={{fontSize:18,fontWeight:"600", color:"orangered"}}>Delete account</Text>
                                </View>
                    
                        </TouchableOpacity>

                        <Text style={{fontSize:15,fontWeight:"600",alignSelf:"center",marginTop:28, color:"gray"}}>© ZipTech Inc.</Text>

                </ScrollView>

                <FAB variant="surface" loading={loading} onPress={()=>{ setModalVisible(true); Support()}} label="Support"  icon={"email-outline"} color="rgba(30, 30, 30, 1)"  style={{width:110,alignItems:"center",justifyContent:"center", height:50, position:"absolute" , bottom:12,borderRadius:10, backgroundColor:"white", right:15}}/>
            </View>



            
            <View style={{position:"static"}}>
                <View  style={{flexDirection:"row",backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:"space-between",paddingVertical:5,borderTopWidth:1,borderColor:"gray"}}>
                       
                    
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

