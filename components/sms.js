import React ,{useLayoutEffect,useEffect, useState} from "react";
import { View, Text ,PanResponder,Dimensions,TextInput, ToastAndroid,Alert,FlatList,Image, TouchableOpacity, TouchableHighlight} from "react-native";
import *  as SMS from 'expo-sms'
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { RadioButton, Searchbar } from "react-native-paper";

import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';
import { getAuth, } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';
import { CheckBox } from "@rneui/themed";




import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SendSMS({title, Search, save}){

    const [search, setSearch] = useState("")
    const [sms, setSms] = useState("")
    const [show, setShow] = useState(false)
    const [church, setChurchName] = useState()
    const [showMembers, setshowMembers] = useState([])
    const [messageStatus, setMessageStatus] = useState(false)
    const db = getFirestore()
    const auth = getAuth()
    const [noOfAbsentees, setNoOfAbsentees] = useState();
    const [Show, setshow] = useState(false)
    const [smsList, setSmsList] = useState([]);
    const [smsListImg, setSmsListImg] = useState([])
    const [seen, setSeen] = useState(true)



    
    
    
    const getMember = async(email) => {
   
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
            setChurchName(church?.ChurchName)

            if(title === "pledge"){
                 // Fetch pledges
                const userDetailsDocRef = doc(db, "UserDetails", church.id);
                const eventsCollectionRef = collection(userDetailsDocRef, "Pledges");
                const eventsSnapshot = await getDocs(eventsCollectionRef);

                if (!eventsSnapshot.empty) {
                    const Data = eventsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data().Pledges,
                    }));
                                // Normalize the data
                    const normalizedData = Data.map(item => {
                        // If the object has a key like '0', extract it and use it as the object
                        if (item["0"]) {
                        return item["0"];
                        }
                        return item;  // Else, return the object as it is
                    });
                   
                    if(Data.filter(i => i.Redeemed === false).length !== 0){
                      setshowMembers(Data.filter(i => i.Redeemed === false))
                    }else{
                      setshowMembers([]);
                      setSeen(false)
                    }
                
                }else{
                    ToastAndroid.show("Please make a pledge!", ToastAndroid.SHORT)
                    setSeen(false)
                    return
                }

                }else if(title === "absentees"){
                            // Fetch Attendance
                    try {
                        const userDetailsDocRef = doc(db, "UserDetails", church.id);

                        // Reference to the Members subcollection within UserDetails
                        const membersCollectionRef = collection(userDetailsDocRef, 'Members');
                
                        // Get all documents from the Members subcollection
                        const querySnapshot = await getDocs(membersCollectionRef);
                        let totalMembers = []

                        if (!querySnapshot.empty) {
                            // If documents are found, extract their data and update the state with the tasks
                            const membersData = querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data().Member
                            }));
                            totalMembers = membersData;
                        }

                     
                        const AttendanceCollectionRef = collection(userDetailsDocRef, 'Attendance');
                        const attendanceSnapshot = await getDocs(AttendanceCollectionRef);

                        // Check if snapshot is empty
                        if (!attendanceSnapshot.empty) {

                        const attendanceData = attendanceSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().Date,
                        }));

                   

                    // Helper function to remove ordinal suffix (st, nd, rd, th)
                const removeOrdinalSuffix = (dateString) => {
                    if (dateString) {
                        // Ensure the dateString is a string
                        const dateStr = typeof dateString === 'string' ? dateString : dateString.toString();

                        // Remove ordinal suffix (st, nd, rd, th) from the day part of the date
                        return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Matches and removes ordinal suffixes like '7th'
                    }
                    return "";
                };

                        // Convert month name to month number (e.g. "Dec" -> 12)
                        const monthNameToNumber = (monthName) => {
                            const months = {
                                Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
                                Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
                            };
                            return months[monthName] || 0; // Return 0 if monthName is invalid
                        };

                        // Function to get the week number of the year
                        const getWeekOfYear = (date) => {
                            const start = new Date(date.getFullYear(), 0, 1); // January 1st of the year
                            const diff = date - start;
                            const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds
                            const dayOfYear = Math.floor(diff / oneDay);
                            return Math.ceil((dayOfYear + 1) / 7); // Calculate the week number
                        };


                        const date = new Date();
                        const currentWeek = getWeekOfYear(date); // Get the current week number of the year
                        

                        const newAttendance = attendanceData.filter(attendance => {
                            if (!attendance.formattedDate) {
                                console.warn(`Missing formattedDate for attendance with ID: ${attendance.id}`);
                                return false; // Skip if no formattedDate is present
                            }

                            // Clean the date string (e.g. "7th Dec, 2024" -> "7 Dec, 2024")
                            const cleanedDateString = removeOrdinalSuffix(attendance.formattedDate);
                

                            // Split the cleaned date string into day, month, year
                            const [day, month, year] = cleanedDateString.split(' ');

                            // Remove any trailing commas or spaces from the month part
                            const cleanMonth = month.replace(',', '').trim();


                            // Convert the month name to a number (e.g. "Dec" -> 12)
                            const monthNumber = monthNameToNumber(cleanMonth);

                            if (!monthNumber) {
                                console.warn(`Invalid month name: ${month}`);
                                return false; // Skip if month is invalid
                            }

                            // Reformat the date into "YYYY-MM-DD" format for reliable parsing
                            const formattedDateString = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
                        

                            // Parse the cleaned and formatted date string into a Date object
                            const attendanceDate = new Date(formattedDateString);

                            // Check if the date is valid
                            if (isNaN(attendanceDate.getTime())) {
                                console.warn(`Invalid date found: ${attendance.formattedDate}`);
                                return false; // Skip invalid dates
                            }

                            // Get the week number for the attendance date
                            const attendanceWeek = getWeekOfYear(attendanceDate);
                        

                            return attendanceWeek === currentWeek;
                    });
                    if(newAttendance){
                        const attendanceData = attendanceSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().AttendanceList,
                        }));
                    
                        const attendance = attendanceData.filter(item => 
                            newAttendance.some(a => a.id === item.id)
                          );                        
                          
                        const attendants = attendance.map(item => {
                            let values = []; // Initialize the array to hold values from each numeric key

                                // Loop through each key of the top-level item
                                Object.keys(item).forEach(key => {
                                    // Check if the key is numeric and the value is an object (nested data)
                                    if (!isNaN(key) && typeof item[key] === 'object' && item[key] !== null) {
                                    values.push(item[key]); // Push the object corresponding to the numeric key into the array
                                    }
                                });

                                return values; // Return an array of values for each item
                          });

                        if (attendants?.length !== 0){
                            const absentees = totalMembers.filter(i => !attendants.flat().map(a => a.id).includes(i.id))
                            setshowMembers(absentees)
                            setNoOfAbsentees(absentees.length)
                        }else{
                            setshowMembers(totalMembers)
                        }
                        }
                    }else{
                        setshowMembers(totalMembers)
                    }
                    } catch (error) {
                        console.error("Error fetching or processing attendance data:", error);
                    }
                }else{
                    try {
                        // Reference to the UserDetails document
                        const userDetailsDocRef = doc(db, 'UserDetails', church.id);

                        // Reference to the Members subcollection within UserDetails
                        const membersCollectionRef = collection(userDetailsDocRef, 'Members');
                
                        // Get all documents from the Members subcollection
                        const querySnapshot = await getDocs(membersCollectionRef);
                
                        if (!querySnapshot.empty) {
                            // If documents are found, extract their data and update the state with the tasks
                            const membersData = querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data().Member
                            }));


                            if(title === "birthday"){
                                const date = new Date();
                                const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                const monthOfYear = monthsOfYear[date.getMonth()];
                        
            
                                const monthAbr = monthOfYear.slice(0, 3);
                                const upcomingBirthdays = membersData.filter(member => {
                                    const memberMonth = member.Date_Of_Birth.split(' ')[1];
                                    return memberMonth === monthAbr;
                                });

                                if (upcomingBirthdays.length !== 0){
                                    setshowMembers(upcomingBirthdays);
                                }else{
                                    setSeen(false)
                                }

                            }else{
                                if (membersData.length !== 0){
                                    setshowMembers(membersData);
                                }else{
                                    setSeen(false)
                                }

                        }

                    }else {
                        ToastAndroid.show("Please register a member!", ToastAndroid.SHORT);
                        setSeen(false)
                        return
                    }
                }catch (error) {
                        console.log("Error getting member documents:", error);
                    }
                }

            }else {
                throw new Error("No church details found in database");
            }


            
        }


    const [email, setEmail] = useState()

    useLayoutEffect(() => {
            setshowMembers([])
            setSeen(true)
            getMember(email)
    },[title])

   
    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const value = await AsyncStorage.getItem('UserEmail');
            if (value !== '') {
              getMember(value)
              setEmail(value)
            } else {
              console.log("no item")
            }
          } catch (error) {
            console.error('Error checking onboarding status', error);
          }
        };
        checkLoginStatus()
      }, []);


    const defaultHeader = `•| ${church?.toUpperCase()} |•`;

  
    const sendSMS = async () => {

        if(!church){
            return ToastAndroid.show("No Church Name Found!, Visit Home Screen and try again!",  ToastAndroid.LONG)
        }else if(sms === "" ){
            return ToastAndroid.show("Please type a message to send!", ToastAndroid.LONG)
        }else if(smsList.length === 0){
            return ToastAndroid.show("Please select recipients",  ToastAndroid.LONG)
        }else{
            save(prevList => [{sms, defaultHeader,smsListImg, smsList , date }, ...prevList])
        }

        try {
          await SMS.sendSMSAsync(
            smsList, // Array of recipient phone numbers
            `${defaultHeader}\n\n${sms}` // Message body
          );
          ToastAndroid.show('Sms sent successfully!', ToastAndroid.SHORT);
          setSmsList([])
          setSmsListImg([])
          setClearAll(true)
          setSms("")
        } catch (error) {
          Alert.alert('Error', error.message);
          setMessageStatus(false)
        }
      };



      let date = new Date();
      const monthsOfYear1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayOfMonth1 = date.getDate();
      const monthOfYear1 = monthsOfYear1[date.getMonth()];
      const year1 = date.getFullYear();
  
      let suffix = 'th';
      if (dayOfMonth1 === 1 || dayOfMonth1 === 21 || dayOfMonth1 === 31) {
          suffix = 'st';
      } else if (dayOfMonth1 === 2 || dayOfMonth1 === 22) {
          suffix = 'nd';
      } else if (dayOfMonth1 === 3 || dayOfMonth1 === 23) {
          suffix = 'rd';
      }

      date = `${dayOfMonth1}${suffix} ${monthOfYear1} , ${year1}`



       //get sms sent from storage
    useEffect(()=>{
        const getSms = async () => {
            try {
              const value = await AsyncStorage.getItem('SMS');
              if (value !== null) {
                save(JSON.parse(value))
              } else {
                return
              }
            } catch (error) {
              console.error('Error checking sms', error);
            }
          };
          getSms();
    }, [])
      

     //handle clear marked items
                const [marked, setMarked] = useState([ ]);
                const [clearAll, setClearAll] = useState(false);
                const [selectAll, setSelectAll] = useState(false);


                useEffect(() => {
                    if(selectAll){
                        const markedAll = () =>{
                            if (showMembers) {
                                const updatedList = showMembers.map(member => {
                                const updatedMember = { ...member, Check: true }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setSmsList((prevList) => [updatedMember?.Number1 , ...prevList]);
                                } else {
                                    setSmsList([]);
                                    setSmsListImg([]) // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                                });
                    
                                setshowMembers(updatedList);
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
                                setSmsList([])
                                setSmsListImg([])
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
                    
                },[clearAll, selectAll]
            )



                //marking attendance functionality
        
                const handleAttendance = (id, number) => {
                    setshowMembers((prevMembers) => {
                        const updatedMembers = prevMembers.map((member) => {
                            if (member.id === id) {
                                const updatedMember = { ...member, Check: !member.Check }; // Toggle the Check status
                                // Handle attendance list update if the checkbox is checked
                                if (updatedMember.Check) {
                                    setSmsListImg((prevList) => [updatedMember?.Image, ...prevList])
                                    setSmsList((prevList) => [updatedMember?.Number1 , ...prevList]);
                                } else {
                                    setSmsList([]);
                                    setSmsListImg([]) // Clear the attendance list if unchecked
                                }
                                return updatedMember;
                            }
                            return member;
                        });
                        return updatedMembers;
                    });
                };
              
            
            


    return(
        <View style={{flex:1, justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>
                <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>

                <View>
                       {(title === "absentees") && 
                       <View style={{marginVertical:5, alignItems:"center"}}>
                            <Text style={{color:"white", fontWeight:"500"}}>Absentees: {noOfAbsentees ? noOfAbsentees : "-"}</Text>
                       </View>
                       }
                        <View style={{flexDirection:"row",marginHorizontal:10 , justifyContent:"space-evenly", alignItems:"center"}}>
                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setSelectAll(true)} style={{flexDirection:"row",borderRadius:10, width:"30%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                                <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Select all</Text>         
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() => setClearAll(true)} style={{flexDirection:"row",borderRadius:10, width:"30%",paddingVertical:8,paddingHorizontal:5,justifyContent:"center", alignItems:"center"}}>
                                <Text style={{color:" rgba(100, 200, 255, 1)",fontSize:13}}>Clear all</Text>         
                            </TouchableHighlight>
                        </View>     
                      
                </View>

                <View style={{flex:1 , justifyContent: showMembers?.length !== 0 ? "flex-start" : "center" , alignItems: "center"}}>
                {showMembers?.length !== 0 ?
                        <FlatList 

                        data = {!Search ? showMembers : showMembers?.filter(member => 
                            member.FirstName && member.SecondName && 
                            (member.FirstName.toLowerCase().includes(Search?.toLowerCase()) || 
                            member.SecondName.toLowerCase().includes(Search?.toLowerCase()))
                        )}
                        showsVerticalScrollIndicator={false}

                        key={(index,item)=> item.id}

                        ListEmptyComponent={()=> 
                            <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Not Found!</Text>
                            </View>
               
                        }

                        renderItem={({item , index}) => {
                            return(

                                <View style={{flex:1,paddingHorizontal:20,marginTop:10}}>
                                    

                                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                                        {(!item.Title) ?
                                        <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                            style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:2}}>
                                            <>
                                                {item.Image ?
                                                            <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                            :
                                                            <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                                <Fontisto name="person"  size={20} color={"gray"}/>
                                                            </View>
                                            
                                                }
                                                
                                                <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true}>{item.FirstName} {item.SecondName}</Text>
                                            </>
                                        </TouchableHighlight>
                                        :
                                        <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                            style={{height:45,width:"85%",alignItems:"center",flexDirection:"row",borderTopLeftRadius:50 , borderBottomLeftRadius:50, padding:10, backgroundColor:"rgba(50, 50, 50, 1)",elevation:2}}>
                                            <>
                                              
                                                <View style={{width:30,height:30 ,borderColor:"gray",borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                    <Fontisto name="person"  size={20} color={"gray"}/>
                                                </View>
                                                <Text style={{fontSize:18,fontWeight:"400",marginLeft:10,alignSelf:"center",color:"rgba(240, 240, 240, 1)"}} adjustsFontSizeToFit={true}>{item.FullName}</Text>
                                            </>
                                        </TouchableHighlight>
                                        }
                                    
                                        <CheckBox
                                            center={true}
                                            checked={item.Check}
                                            onPress={() => {handleAttendance(item.id, item.Number1); setMarked(prevList => [...prevList , index])}}  
                                            size={24}
                                            checkedColor="rgba(240, 240, 240, 1)"
                                            containerStyle={{backgroundColor:"rgba(50, 50, 50, 1)",width:"15%", borderLeftWidth:1, borderColor:"gray", borderTopRightRadius:50,borderBottomRightRadius:50, alignSelf:"center",}}
                                            uncheckedColor="gray"
                                            />
                                                                

                                    </View>
                                </View>
                        )}}
                        />
                        :
                        <View style={{alignItems:"center",justifyContent:"center", backgroundColor:'rgba(100, 100, 100, 0.2)',width:230, height:45, borderRadius:10}}>
                            <Text style={{color:"white"}}>{ seen ? "Loading ..." : "No Members"}</Text>
                        </View>
                        }
                    </View>


            <View style={{marginTop:10}}>
                <View style={{ width:"100%", justifyContent:"center", maxHeight:200, marginBottom:8}}>
                    
                    <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
                        <TextInput  multiline={true} style={{width:"80%",paddingHorizontal:28,paddingVertical:10,textAlign:"justify", minHeight:45, elevation:1,backgroundColor:"rgba(50, 50, 50, 1)",color:"rgba(240, 240, 240,1)", borderRadius:50,fontSize:16, fontWeight:"300"}}   value={sms} onChangeText={(txt) => setSms(txt)} placeholder="Send Message" placeholderTextColor={"gray"}/>
                        
                        <TouchableOpacity   style={{flexDirection:"row", alignSelf:"flex-end"}} onPress={()=>{sendSMS()}} >
                            <Ionicons name="arrow-forward-circle-sharp" size={50}  color={"rgba(240, 240, 240, 0.5)"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    )
}
