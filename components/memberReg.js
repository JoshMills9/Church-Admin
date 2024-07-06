import React, {useState, useLayoutEffect, useEffect} from "react";
import { View, Text, Pressable, TextInput, TouchableOpacity,Image, StatusBar,Platform, ScrollView, Alert } from "react-native";
import styles from "./styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import { ActivityIndicator, RadioButton, Switch } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { getAuth, } from 'firebase/auth';




export default function AddMembers(props){
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation()
    const db = getFirestore()
    const [churchName, setchurchName] = useState(null)
    const [showMembers, setshowMembers] = useState(null)
    const [Username, setUserName] = useState("")
    const [user, setUser] = useState('')
    const auth = getAuth()


   


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
    


    const [regDate, setRegDate] = useState(new Date())
    const [mode, setMode] = useState('');
    const [Birthdate, setBirthDate] = useState(new Date())
    const [show, setShow] = useState(false);
    const [department, setDepartment] = useState("")
    const [marital, setMarital] = useState("")
    const [selectedValue, setSelectedValue] = useState("");
    const [baptized, setBaptized] = useState("")
    const [phone1, setPhone1] = useState("")
    const [phone2, setPhone2] = useState("")
    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [email, setemail] = useState("")
    const [Occupation, setOccupation] = useState("")
    const [visiting, setVisiting] = useState("")
    const [showSubmitting, setSubmitting] = useState(false)
    const [location, setLocation] = useState("")
    const [NewDateShow, setNewDateShow] = useState(false)
    const [calendar, setCalendar] = useState("")



    //state to update the display of datetime (calendar or clock)
    const [display, setDisplay] = useState("")

    const showMode = (currentMode,value) => {
        setShow(true);
        setMode(currentMode);
        setCalendar(value)
    };



    //function to update the dateTime
    const onchange = (event, selectedDate) => {
        if(calendar === "BirthDate"){
            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setBirthDate(currentDate);
        }else{
            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setRegDate(currentDate)
        }
        
    };


  
     
        const monthsOfYear1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth1 = Birthdate.getDate();
        const monthOfYear1 = monthsOfYear1[Birthdate.getMonth()];
        const year1 = Birthdate.getFullYear();
    
        let Suffix = 'th';
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = 'rd';
        }
        const formattedDateOfBirth = `${dayOfMonth1}${Suffix} ${monthOfYear1} , ${year1}`;
      
        const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth = regDate.getDate();
        const monthOfYear = monthsOfYear[regDate.getMonth()];
        const year = regDate.getFullYear();
    
        let suffix = 'th';
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = 'rd';
        }
        const formattedRegDate = `${dayOfMonth}${suffix} ${monthOfYear} , ${year}`;
        
   
   
    
        // function for radioButtons
    const radiobtn = (value) =>{
        if (value === "single"){
            setMarital("single")
           
        }else  if (value === "married"){
            setMarital("married")
          
        }else  if (value === "divorced"){
            setMarital("divorced")
    
        }else  if (value === "widowed"){
            setMarital("widowed")
            
        }else  if (value === "youth"){
            setDepartment("youth")
            
        }else  if (value === "men"){
            setDepartment("men")
            
        }else  if (value === "women"){
            setDepartment("women")
            
        }else  if (value === "children"){
            setDepartment("children")
            
        }
    }




    //Function to handle submit
    const handleSubmit = async () => {
        try {
            // Step 1: Retrieve user email from Firebase authentication
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user signed in");
            }
            const userEmail = user.email;
    
            // Step 2: Fetch church details based on user email
            const tasksCollectionRef = collection(db, 'UserDetails');
            const querySnapshot = await getDocs(tasksCollectionRef);
    
            if (!querySnapshot.empty) {
                // Filter tasks to find matching church based on user email
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().userDetails
                }));
    
                const church = tasks.find(item => item.email === userEmail);
    
                if (!church) {
                    throw new Error("Church details not found for the logged-in user");
                }
    
                setchurchName(church); // Set church details in state
                  // Step 3: Validate and submit member registration
                if (!firstName || !secondName) {
                    throw new Error("First Name and Second Name must be filled!");
                }

                  // Reference to the UserDetails document
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
    
            // Reference to the Members subcollection within UserDetails
            const membersCollectionRef = collection(userDetailsDocRef, 'Members');
    
            // Example data for a member document within the subcollection
            const member = {
                FirstName: firstName,
                SecondName: secondName,
                Date_Of_Birth: formattedDateOfBirth,
                Registration_Date: formattedRegDate,
                Number1: phone1,
                Number2: phone2,
                Email: email,
                Marital_Status: marital,
                No_Of_Children: selectedValue,
                Department: department,
                Baptized: baptized,
                Visting: visiting,
                occupation: Occupation,
                Location: location,
                Image: selectedImage
            };
    
            // Set a document within the Members subcollection
            await setDoc(doc(membersCollectionRef), {Member: member});

            // Clear form fields after successful registration
            setFirstName('');
            setSecondName('');
            setPhone1('');
            setPhone2('');
            setemail('');
            setMarital('');
            setSelectedValue('');
            setDepartment('');
            setBaptized('');
            setVisiting('');
            setOccupation('');
            setLocation('');
            setSelectedImage(null);
    
            setSubmitting(false);
    
            Alert.alert("Member Registration", "Registration Successful!");
              
            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Registration Error", error.message);
            setSubmitting(false);
        }
    };
    




    const handleUpdate = async () => {
        try {
            if (!props?.info[0]?.id) {
                throw new Error("Missing document ID for update.");
            }

            try {
                // Reference to the UserDetails document
                const userDetailsDocRef = doc(db, 'UserDetails', props?.Id);
        
                // Reference to the Members subcollection within UserDetails
                const memberDocRef = doc(userDetailsDocRef, 'Members', props?.info[0]?.id); // Replace 'documentId' with the actual document ID of memberData
        
                // Update fields in the memberData document within the Members subcollection
                await updateDoc(memberDocRef, {
                    Member:{
                        FirstName : firstName || props?.info[0].FirstName,
                        SecondName: secondName || props?.info[0].SecondName,
                        Date_Of_Birth : formattedDateOfBirth || props?.info[0].Date_Of_Birth,
                        Registration_Date : formattedRegDate || props?.info[0].Registration_Date,
                        Number1 : phone1 || props?.info[0].Number1,
                        Number2: phone2 || props?.info[0].Number2,
                        Email : email || props?.info[0].Email,
                        Marital_Status: marital || props?.info[0].Marital_Status,
                        No_Of_Children: selectedValue || props?.info[0].No_Of_Children,
                        Department: department || props?.info[0].Department,
                        Baptized : baptized || props?.info[0].Baptized,
                        Visting : visiting || props?.info[0].Visting,
                        occupation: Occupation || props?.info[0].occupation,
                        Location: location || props?.info[0].Location,
                        Image: selectedImage || props?.info[0].Image
                    }
                });
        
                Alert.alert("Success","Member data updated successfully!")
                props?.Show(false); 
            } catch (error) {
                console.error("Error updating member document:", error);
                Alert.alert('Update Error', error.message);
                setSubmitting(false); 
            }
        }catch(error){
            console.log(error)
        }
            
    };
    

    return(
        <View style={{flex:1, justifyContent:"space-between",backgroundColor:"rgba(30, 30, 30, 1)"}}>

            {props?.show ? <View></View> : 
                <><StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"} />
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ height: 70, width: "18%", justifyContent: "center", borderBottomRightRadius: 50, padding: 10, borderTopRightRadius: 50, backgroundColor: "rgba(50, 50, 50, 1)", elevation: 5 }}>
                            <Ionicons name="arrow-back" size={35} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.replace('ModalScreen',{username:"", ChurchName:""})} />
                        </View>

                        <View style={{ height: 70, width: "80%", alignItems: "center", justifyContent: "space-around", flexDirection:"row", elevation: 6, borderBottomRightRadius: 60, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: "rgba(50, 50, 50, 1)" }}>
                            <Text style={{ fontSize: 20, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Registration</Text>
                            <Ionicons name="person-add-sharp" size={26} color={"rgba(240, 240, 240, 1)"} />
                        </View>
                    </View>
                </>
                }

            <ScrollView contentContainerStyle={{padding:10}} showsVerticalScrollIndicator={false}>
            <View style={{margin:10, alignItems:'center'}}>
                <Text style={{fontSize:16, fontWeight:"400",color:"rgba(240, 240, 240, 1)"}}>
                    MEMBERSHIP DETAILS
                </Text>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center", marginTop:10}}>
                <TextInput style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}}  value={firstName} onChangeText={(text) => setFirstName(text)} placeholderTextColor={"rgba(240, 240, 240, 1)"} placeholder={props.info ? props.info[0].FirstName : "First Name" }/>
                <TextInput style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}}   value={secondName} onChangeText={(text) => setSecondName(text)} placeholder={props.info ? props.info[0].SecondName : "Last Name" } placeholderTextColor={"rgba(240, 240, 240, 1)"}/>
            </View>

            <View style={{flexDirection:"row",marginTop:30, justifyContent:"space-between"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", width:"45%",alignItems:"center"}}>

                    <TouchableOpacity onPress={() => {setNewDateShow(true);showMode("date", "BirthDate");setDisplay("calendar")}}>
                        <Ionicons name="calendar-outline" size={37} color={" rgba(100, 200, 255, 1)"}/>
                    </TouchableOpacity>

                    <TextInput readOnly={true}   style={{width:"80%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:45, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}}placeholderTextColor={"rgba(240, 240, 240, 1)"}   placeholder={NewDateShow ? formattedDateOfBirth : (props.info ? props.info[0].Date_Of_Birth : "Date of Birth" )} />
                </View>

                <View style={{flexDirection:"row", justifyContent:"space-between", width:"45%",alignItems:"center"}}>

                <TouchableOpacity onPress={() => {setNewDateShow(true);showMode("date","RegDate");setDisplay("calendar")}}>
                    <Ionicons name="calendar-outline" size={37} color={" rgba(100, 200, 255, 1)"}/>
                </TouchableOpacity>

                <TextInput readOnly={true}  style={{width:"80%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:45, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}} placeholderTextColor={"rgba(240, 240, 240, 1)"}  placeholder={NewDateShow ? formattedRegDate : (props.info ? props.info[0].Registration_Date : "Registration Date" ) } />
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", justifyContent:"space-between"}}>
                <TextInput  style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15, color:"rgba(240, 240, 240, 1)"}}placeholderTextColor={"rgba(240, 240, 240, 1)"}  inputMode="tel"  value={phone1} onChangeText={(text) => setPhone1(text)} placeholder={props.info ? props.info[0].Number1 : "Phone Number 1" } />
                <TextInput  style={{width:"48%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15, color:"rgba(240, 240, 240, 1)"}} placeholderTextColor={"rgba(240, 240, 240, 1)"} inputMode="tel"  value={phone2} onChangeText={(text) => setPhone2(text)} placeholder={props.info ? props.info[0].Number2 : "Phone Number 2" } />
            </View>

            <View style={{marginTop:30, flexDirection:"row"}}>
                <TextInput  style={{width:"100%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}} placeholderTextColor={"rgba(240, 240, 240, 1)"} inputMode="email"  value={email} onChangeText={(text) => setemail(text)} placeholder={props.info ? props.info[0].Email : "Email address" } />
            </View>

            <View style={{marginTop:30, flexDirection:"row"}}>
                <TextInput  style={{width:"100%", borderWidth:1,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15,color:"rgba(240, 240, 240, 1)"}} placeholderTextColor={"rgba(240, 240, 240, 1)"} inputMode="text"  value={location} onChangeText={(text) => setLocation(text)} placeholder={props.info ? props.info[0].Location : "Residential address" } />
            </View>

            <View style={{marginTop:30}}>
                <Text style={{fontSize:16, fontWeight:"normal", color:"rgba(240, 240, 240, 1)"}}>
                    Marital status:
                </Text>
                <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14, fontWeight:"300", color:"rgba(240, 240, 240, 1)"}}>Single  </Text> 
                        <RadioButton  status={(marital  || (props?.info && props?.info[0]?.Marital_Status)) === "single"  ? "checked" : "unchecked"} onPress={()=> radiobtn("single")}/>
                    </View>
                   
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Married  </Text> 
                        <RadioButton  status={(marital || (props?.info && props.info[0].Marital_Status)) === "married" ? "checked" : "unchecked"}  onPress={()=> radiobtn("married")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Divorced  </Text> 
                        <RadioButton  status={(marital || (props.info && props?.info[0]?.Marital_Status)) === "divorced" ? "checked" : "unchecked"} onPress={()=> radiobtn("divorced")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Widowed  </Text> 
                        <RadioButton  status={(marital || (props.info && props?.info[0]?.Marital_Status)) === "widowed" ? "checked" : "unchecked"} value="" onPress={() => radiobtn("widowed")}/>
                    </View>
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <Text style={{fontSize:16, fontWeight:'400',color:"rgba(240, 240, 240, 1)"}}>Number of Children</Text>
                <View style={{borderRadius:10,borderWidth:1,height:45, borderColor:"gray", flexDirection:"row", minWidth:100,justifyContent:"space-around",alignItems:"center",paddingHorizontal:5}}><Text style={ { fontSize:16, color:"rgba(240, 240, 240, 1)"}}>{selectedValue || "Select"}</Text>
                            <Picker
                                selectedValue={selectedValue || (props?.info && props?.info[0].No_Of_Children)}
                                dropdownIconColor={" rgba(100, 200, 255, 1)"}
                                enabled={marital === "single" ? false : true}
                                style={{ height:20, width:40, color:"rgba(240, 240, 240, 1)" }}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="4" value="4" />
                                <Picker.Item label="5" value="5" />
                                <Picker.Item label="6" value="6" />
                                <Picker.Item label="7" value="7" />
                                <Picker.Item label="8" value="8" />
                                <Picker.Item label="9" value="9" />
                                <Picker.Item label="10" value="10" />

                            </Picker>
                            </View>
            </View>

            <View style={{marginTop:30}}>
            <Text style={{fontSize:16, fontWeight:"normal",color:"rgba(240, 240, 240, 1)"}}>
                    Department:
                </Text>
                <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Youth</Text> 
                        <RadioButton  status={(department || (props.info && props?.info[0]?.Department)) === "youth" ? "checked" : "unchecked"} onPress={()=> radiobtn("youth")}/>
                    </View>
                   
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Men</Text> 
                        <RadioButton  status={(department || (props.info && props?.info[0]?.Department)) === "men" ? "checked" : "unchecked"}  onPress={()=> radiobtn("men")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14, fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Women </Text> 
                        <RadioButton status={(department || (props.info && props?.info[0]?.Department)) === "women" ? "checked" : "unchecked"} onPress={()=> radiobtn("women")} />
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:14,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Children</Text> 
                        <RadioButton    status={(department || (props.info && props?.info[0]?.Department)) === "children" ? "checked" : "unchecked"} value="" onPress={() => radiobtn("children")}/>
                    </View>
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:16,color:"rgba(240, 240, 240, 1)"}}>
                    Are you Baptized?
                </Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Yes</Text>
                    <Switch thumbColor={"gray"}   value={(baptized || (props.info && props?.info[0]?.Baptized)) === "Yes" ? true : false} onValueChange={() => setBaptized("Yes")} />
                </View>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>No</Text>
                    <Switch thumbColor={"gray"}  value={(baptized || (props.info && props?.info[0]?.Baptized)) === "No" ? true : false } onValueChange={() => setBaptized("No")} />
                </View>
            </View>

            <View style={{marginTop:30, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:16,color:"rgba(240, 240, 240, 1)"}}>
                    Are you Visiting?
                </Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Yes</Text>
                    <Switch thumbColor={"gray"}  value={(visiting || (props.info && props?.info[0]?.Visting)) === "Yes" ? true : false} onValueChange={() => setVisiting("Yes")} />
                </View>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>No</Text>
                    <Switch thumbColor={"gray"} value={(visiting || (props.info && props?.info[0]?.Visting)) === "No" ? true : false } onValueChange={() => setVisiting("No")} />
                </View>
            </View>

            <View style={{marginTop:30}}>
                <TextInput  style={{width:"100%",color:"rgba(240, 240, 240, 1)", borderWidth:1, marginTop:5,borderColor:"gray",backgroundColor:"rgba(50, 50, 50, 1)", height:50, borderRadius:10,padding:10, fontSize:15}} placeholderTextColor={"rgba(240, 240, 240, 1)"} inputMode="text" value={Occupation} onChangeText={(text) => setOccupation(text)} placeholder={props?.info ? props.info[0].occupation :"Occupation"} />
            </View>

            <View style={{marginTop:30, flexDirection:'row',justifyContent:"space-around",alignItems:"center"}}> 
                
                <TouchableOpacity onPress={pickImage} style={{borderWidth:1,borderColor:"gray", width:"40%",height:40,alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderRadius:10,padding:5}}><Text  style={{fontSize:16,color:"rgba(240, 240, 240, 1)"}}>{props?.info? "Update photo" : "Upload a photo"}</Text><Ionicons name="images" size={23} color="rgba(240, 240, 240, 1)"/></TouchableOpacity>

                {(selectedImage || props?.info) && (
                    <View style={{borderWidth:1, borderRadius:50,height:80,width:80, alignItems:"center",justifyContent:"center", borderColor:"lightgray", backgroundColor:"white"}}>
                        <Image source={{ uri: selectedImage || props?.info[0].Image}} style={{ width: 70, height: 70 ,borderRadius:50}} />
                    </View>
                    )
                }
            </View>


            
            <View style={{marginTop:40 ,marginBottom:20, alignItems:"center"}}>
                <TouchableOpacity onPress={() => {setSubmitting(true); (props.show ? handleUpdate() : handleSubmit())}} style={{backgroundColor:"rgba(50, 50, 50, 1)", width:"60%",height:50, borderRadius:10,elevation:3, alignItems:"center", justifyContent:"center"}}>
                    {showSubmitting ? 
                    <ActivityIndicator  color=" rgba(100, 200, 255, 1)"/> 
                    :
                    <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:18, fontWeight:"500"}}>{props?.show? "Update Data":"Register Member"}</Text>
                    }
                </TouchableOpacity>
            </View>

            </ScrollView>

            {show && (<DateTimePicker testID="dateTimePicker" value={props?.info ? Birthdate : Birthdate || regDate} mode={mode} 
             display={display} onChange={onchange} />
            )}
        </View>
    )
}