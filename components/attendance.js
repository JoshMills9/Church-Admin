import React, { useState, useRef, useEffect, useLayoutEffect, Children } from "react";
import { View,FlatList, Text,useColorScheme, Image,ToastAndroid,Dimensions, TouchableHighlight, ActivityIndicator } from "react-native";

import { getFirestore,collection,getDocs, doc, setDoc ,updateDoc, addDoc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { CheckBox } from "@rneui/themed";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';




export default function Attendance ({department, Search, cell, found}){

    const [showMembers, setshowMembers] = useState([])
    const [churchName, setchurchName] = useState(null)
    const [save, setSave] = useState(false);
    const [seen, setSeen] = useState(true)
    const isDarkMode = useColorScheme() === 'dark';

    const db = getFirestore()
    const auth = getAuth()



    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(false)
       // Handle date change
       const onChange = (event, selectedDate) => {
           if(event.type === 'dismissed') {
               setShow(false)
               setSelected(false)
               return;
           }else{
               const currentDate = selectedDate || date;
               setShow(false);
               setDate(currentDate);
           };
       }


       // Show the date picker
       const showDatePicker = () => {
           setShow(true);
           setSelected(true)
       };
      
        const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayOfMonth = date.getDate();
        const monthOfYear = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();
    
        let suffix = 'th';
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = 'rd';
        }
        const formattedDate = `${dayOfMonth}${suffix} ${monthOfYear}, ${year}`;


    
   
        const GetMember = async(email) => {

        
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
                    setchurchName(church);
                    try {
                        // Reference to the UserDetails document
                        const userDetailsDocRef = doc(db, 'UserDetails', church.id);
                
                        // Reference to the Members subcollection within UserDetails
                        const membersCollectionRef = collection(userDetailsDocRef, 'Members');
                
                        // Get all documents from the Members subcollection
                        const querySnapshot = await getDocs(membersCollectionRef);
                
                        if (!querySnapshot.empty) {
                            // If documents are found, extract their data and update the state with the tasks
                            const tasks = querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data().Member}))


                                if(department === "men"){
                                    const Men =tasks.filter(department => department.Department === "men" );
                                    setshowMembers(Men)
                                    if(Men.length === 0){
                                        setSeen(false)
                                    }
                                }else if(department === "women"){
                                    const Women =tasks.filter(department => department.Department === "women" );
                                    setshowMembers(Women)
                                    if(Women.length === 0){
                                        setSeen(false)
                                    }
                                }else if(department === "youth"){
                                    const Youth =tasks.filter(department => department.Department === "youth" );
                                    setshowMembers(Youth)
                                    if(Youth.length === 0){
                                        setSeen(false)
                                    }
                                }else if(department === "children"){
                                    const Children =tasks.filter(department => department.Department === "children" );
                                    setshowMembers(Children)
                                    if(Children.length === 0){
                                        setSeen(false)
                                    }
                                }else{
                                    setshowMembers(tasks)
                                }
                
                    }else {
                        ToastAndroid.show('Please register a member!', ToastAndroid.SHORT);
                        setSeen(false);
                        return;
                    }
                }
                    catch (error) {
                        console.log("Error getting member documents:", error);
                    }
                    }else {
                        throw new Error("No church details found in database");
                    }

                }



                //marking attendance functionality
                const [AttendanceList, setAttendanceList] = useState([]);

                const handleAttendance = (id) => {
                    setshowMembers((prevMembers) => {
                        const updatedMembers = prevMembers.map((member) => {
                            if (member.id === id) {
                                const updatedMember = { ...member, Check: !member.Check }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setAttendanceList((prevList) => [updatedMember, ...prevList]);
                                } else {
                                    setAttendanceList([]); // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                            }
                            return member;
                        });
                        return updatedMembers;
                    });
                };
              


            //add attendance to db
        const markAttendance = async(Email) => {
    
            if (AttendanceList.length !== 0 ){
                setSave(true)

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
            
                        const church = tasks.find(item => item.email === Email);
            
                        if (!church) {
                            throw new Error("Church details not found for the logged-in user");
                        }
            
                        // Reference to the UserDetails document
                    const userDetailsDocRef = doc(db, 'UserDetails', church.id);
            
                    // Reference to the Members subcollection within UserDetails
                    const membersCollectionRef = collection(userDetailsDocRef, 'Attendance');
            
                    // Set a document within the Members subcollection
                    await setDoc(doc(membersCollectionRef), {AttendanceList, Date:{formattedDate}, Department: {department}});
            
                    ToastAndroid.show("Attendance saved successful!", ToastAndroid.LONG);
                    setSave(false);
                    setClearAll(true)
                    setAttendanceList([])

                    } else {
                        throw new Error("No church details found in database");
                    }
            
                
            
                } catch (error) {
                    console.error("Error adding document: ", error);
                    ToastAndroid.show(`Error saving attendance: ${error.message}`, ToastAndroid.LONG);
                    setSave(false)
                }
        } else{
            ToastAndroid.show("Please mark attendance!", ToastAndroid.LONG);
            return;
        }
       
        }
        


        //handle clear marked items
        const [marked, setMarked] = useState([ ]);
        const [clearAll, setClearAll] = useState(false);
        const [selectAll, setSelectAll] = useState(false);


        useEffect(() => {
            if(selectAll){
                const markedAll = () =>{
                    if (showMembers) {
                        const updatedList = showMembers.map(member => {
                            // Create a new object with Check set to true for each member
                            return { ...member, Check: true };
                        });
            
                        // Update the state with the modified list
                        setshowMembers(updatedList);
                        setAttendanceList(updatedList);
                        setSelectAll(false); // Reset the selectAll flag
                    }
                };

                markedAll();
            
            }else if(clearAll && selectAll === false) {
                const clearAll = () =>{
                    if (showMembers) {
                        const updatedList = showMembers.map(member => {
                            // Create a new object with Check set to true for each member
                            return { ...member, Check: false };
                        });
            
                        // Update the state with the modified list
                        setshowMembers(updatedList);
                        setAttendanceList([])
                        setClearAll(false); // Reset the selectAll flag
                    }
                };

                clearAll();
            } else if (clearAll){
                const clearMarked = () =>{
                    if (showMembers){
                    const updatedList = [...showMembers];
                    // Update the Check property of items at marked indices
                    marked.forEach(i => {
                        if (updatedList[i]) {
                            updatedList[i] = { ...updatedList[i], Check: false }; // Create a new object to avoid mutation
                        }
                });
                
            // Update the state with the modified list
            setshowMembers(updatedList);
            setAttendanceList([])
            setClearAll(false)
            }
            }
            clearMarked()
        }
            
        },[save, clearAll, selectAll]
    )
   

    const [email, setEmail] = useState()

    useLayoutEffect(() => {
        setshowMembers([])
        setSeen(true)
        GetMember(email)
    },[department])

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
              GetMember(value)
              setEmail(value)
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        }
        checkLoginStatus()
      }, [db]);



       //add attendance to db
    const updateCell = async(Email, id) => {
        setSave(true)
        if (AttendanceList.length !== 0 ){

            if(!found){
                ToastAndroid.show("Please search for cell!", ToastAndroid.LONG);
                setSave(false)
                setClearAll(true)
                return
            }
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
        
                    const church = tasks.find(item => item.email === Email);
        
                    if (!church) {
                        throw new Error("Church details not found for the logged-in user");
                    }
        
                    // Reference to the UserDetails document
                const userDetailsDocRef = doc(db, 'UserDetails', church.id);
        
                // Reference to the Pledges subcollection within UserDetails
                const membersCollectionRef = doc(userDetailsDocRef, 'Cells', id);
        
                // Set a document within the Pledges subcollection
                await updateDoc(membersCollectionRef, {Cell: AttendanceList, found});
                ToastAndroid.show("Cell updated successfully!", ToastAndroid.LONG);
                setClearAll(true)
                setSave(false)
                setAttendanceList([])
    
                } else {
                    throw new Error("No church details found in database");
                }
        
            
        
            } catch (error) {
                console.error("Error adding document: ", error);
                ToastAndroid.show(`Error updating cell: ${error.message}`, ToastAndroid.LONG);
            }
        } else{
            ToastAndroid.show("Please select members! ", ToastAndroid.LONG);
            setSave(false)
            return;
        }
    
        }
    
    
    
   




  

    return(
        <View style={{flex:1,backgroundColor: isDarkMode ? '#121212' : '#FFFFFF'}}>  

        
            <View style={{ flex:1}}>

            <View style={{flexDirection:"row",width:"100%" ,marginVertical:10,borderBottomWidth:0.5, borderColor:"lightgray", alignItems:"center",justifyContent:"space-evenly"}}>
                <View style={{flexDirection:"row" ,justifyContent:selected ? "space-around" : "flex-start" ,alignItems:"center"}}>
                    {!cell &&<TouchableHighlight  underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={showDatePicker} style={{flexDirection:"row",paddingVertical:3,paddingHorizontal:5, borderRadius:8, alignItems:"center"}}>
                        <>
                        <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:13}}>{selected ? formattedDate : "Select date"}</Text>

                        <MaterialIcons name={"keyboard-arrow-down"} size={25} color="gray" />
                        </>    
                    </TouchableHighlight>
                    }
                </View>

                <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => setSelectAll(true)} style={{flexDirection:"row",borderRadius:8, width:"20%",paddingVertical:6,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Select all</Text>         
                </TouchableHighlight>

                <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => setClearAll(true)} style={{flexDirection:"row",borderRadius:8, width:"20%",paddingVertical:6,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Clear all</Text>         
                </TouchableHighlight>

                <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => {cell ? updateCell(email, found?.id) : markAttendance(email)}} style={{flexDirection:"row", borderRadius:8, width:"20%",paddingVertical:6,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                    {save ?  
                        <View style={{flexDirection:"row"}}>
                            <Text style={{color:" rgba(100, 200, 255, 1)"}}>Saving </Text>
                            <ActivityIndicator size={"small"} color={" rgba(100, 200, 255, 1)"} />
                        </View>
                        :    
                        <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>{cell ? "Add to cell" : "Save"}</Text>
                    }          
                </TouchableHighlight>
           
            </View>
            
            <View style={{flex:1 , justifyContent: showMembers?.length !== 0 ? "flex-start" : "center" , alignItems: "center"}}>
                {showMembers?.length !== 0 ?
                <FlatList 

                data = {showMembers?.filter(member => 
                    member.FirstName && member.SecondName && 
                    (member.FirstName.toLowerCase().includes(Search.toLowerCase()) || 
                    member.SecondName.toLowerCase().includes(Search.toLowerCase()))
                )}
                showsVerticalScrollIndicator={false}
                key={(index,item)=> item.id && item.Check}

                ListEmptyComponent={()=>(
                    <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                        <Text style={{fontSize:15,fontWeight:"300",color:isDarkMode ? '#FFFFFF' : '#000000'}}>Not Found!</Text>
                    </View>
                    )}


                renderItem={({item , index}) => {
                    return(
                        <View style={{flex:1,paddingHorizontal:20,marginTop:10}}>
                            

                        <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                        
                                            <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"} onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                                style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:isDarkMode ?  "rgba(50, 50, 50, 1)" : '#FFFFFF',elevation:4}}>
                                                <>
                                                    {item.Image ?
                                                                <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                                :
                                                                <View style={{width:30,height:30 ,borderColor:"gray",borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                                    <Fontisto name="person"  size={20} color={"gray"}/>
                                                                </View>
                                                
                                                    }
                                                    
                                                    <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center",color: isDarkMode ? '#FFFFFF' : '#000000'}} adjustsFontSizeToFit={true}>{item.FirstName} {item.SecondName}</Text>
                                                </>
                                            </TouchableHighlight>

                                        
                                            <CheckBox
                                                center={true}
                                                checked={item.Check}
                                                onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                                size={24}
                                                checkedColor= { isDarkMode ? '#FFFFFF' : '#000000'}
                                                containerStyle={{backgroundColor:isDarkMode ?  "rgba(50, 50, 50, 1)" : '#FFFFFF',width:"15%",elevation:4, borderLeftWidth:isDarkMode ? 1 : 0.5, borderColor:"gray", borderTopRightRadius:50,borderBottomRightRadius:50, alignSelf:"center",}}
                                                uncheckedColor="gray"
                                                />
                                                                    

                                        </View>
                        </View>
                )}}
                />
                :
                <View style={{alignItems:"center",justifyContent:"center", backgroundColor:isDarkMode? 'rgba(100, 100, 100, 0.2)':'lightgray',width:230, height:45, borderRadius:10}}>
                        <Text style={{color:isDarkMode? "white" : "black"}}>{ seen ? "Loading ..." : "No Members"}</Text>
                </View> 
                }
            </View>
            </View>
            
            {show && (<DateTimePicker testID="dateTimePicker" value={date} mode={"date"} 
             display={"calendar"} onChange={onChange} />
            )}
            
       
        </View>
    )
}