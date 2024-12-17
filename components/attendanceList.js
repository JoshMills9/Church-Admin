import React,{useEffect, useState} from "react";
import { View ,Text, TouchableHighlight, FlatList} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, getDocs, doc} from "firebase/firestore";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AttendanceList ({navigation, route}){
    const {username, ChurchName, events} = route.params || {}

    const db = getFirestore();
    const [attendance, setAttendance] = useState([]);
    const [viewList , setViewList] = useState(null);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [Show, setshow] = useState(true);
    const [formattedDate, setFormattedDate] = useState(null)
    const [selected, setSelected] = useState(false)
    const [seen, setSeen] = useState(true)


       // Handle date change
       const onChange = (event, selectedDate) => {
           if(event.type === 'dismissed') {
               setShow(false)
               setSelected(false);
               setFormattedDate(null)
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
           setSelected(true);
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
       
        useEffect(()=>{
            setFormattedDate(`${dayOfMonth}${suffix} ${monthOfYear}, ${year}`)
        },[show, date])


    useEffect(()=>{
        const attendanceList = async(userEmail) =>{
            // Fetch Attendance
            try {

                 // Fetch church details based on user email
            const tasksCollectionRef = collection(db, 'UserDetails');
            const querySnapshot = await getDocs(tasksCollectionRef);

            if (!querySnapshot.empty) {
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().userDetails
                }));
  
                const church = tasks?.find(item => item.email === userEmail);
            

                const userDetailsDocRef = doc(db, 'UserDetails', church?.id);

                const AttendanceCollectionRef = collection(userDetailsDocRef, 'Attendance');
                const attendanceSnapshot = await getDocs(AttendanceCollectionRef);

                // Check if snapshot is empty
                if (attendanceSnapshot.empty) {
                    console.log("No attendance data found in the snapshot.");
                    setSeen(false)
                    return;
                }

                const attendanceData = attendanceSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().Date,
                    ...doc.data().AttendanceList
                     // Assuming the date is stored under "Date"
                }));


                // Set the attendance count for the current week
                setAttendance(attendanceData);
            }
        } catch (error) {
                console.error("Error fetching or processing attendance data:", error);
            }
          
        }
        attendanceList(username)
    }, [ ])


    const selectList = () =>{

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

            // Filter the attendance based on the week number
            return attendanceWeek === currentWeek;
        });

    }


    //handle list expansion
        const handlePress = (selectedIndex) => {
            if (viewList === selectedIndex) {
            setViewList(null); // Collapse the item if it's already open
            } else {
            setViewList(selectedIndex); // Expand the selected item
            }
        };


    return(
        <View style={{flex:1,backgroundColor:"rgba(30, 30, 30, 1)"}}>

                <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>                

                <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('Attendance',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Church Attendance</Text>
                                <Ionicons name="book-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                </View>


                <View style={{flex:1}}>
                    <View style={{flexDirection:"row",justifyContent:"center", alignItems:"center",marginBottom:10}}>
                        <TouchableHighlight  underlayColor="rgba(70, 70, 70, 1)"  onPress={showDatePicker} style={{flexDirection:"row",paddingVertical:3,paddingHorizontal:5, borderRadius:8, alignItems:"center"}}>
                            <>
                            <Text style={{color:" rgba(100, 200, 255, 1)", fontSize:13}}>{selected ? formattedDate : "Select attendance date"}</Text>

                            <MaterialIcons name={"keyboard-arrow-down"} size={25} color="gray" />
                            </>    
                        </TouchableHighlight>
                    </View>

                    <View style={{flex:1 , justifyContent: attendance?.length !== 0 ? "flex-start" : "center" , alignItems: attendance?.length !== 0  ? "stretch" :"center"}}>
                            {attendance?.length !== 0 ?

                            <FlatList 
                                data={attendance?.filter(i => {
                                    // Ensure formattedDate exists and matches the search term (case-insensitive)
                                    return formattedDate ? i.formattedDate.toLowerCase().includes(formattedDate?.toLowerCase()) : i.formattedDate;
                                })}
                                key={(item)=> item.id}

                                ListEmptyComponent={()=> 
                                    (Show ? 
                                    <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Choose CANCEL to view all attendance </Text>
                                    </View>
                                    : 
                                    <View></View>
                                )
                                }

                                renderItem={({item, index}) => {
                                    return(
                                        <View style={{flex:1}}>
                                            <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)" onPress={()=> handlePress(index)} style={{margin:10,borderRadius:10,padding:10,backgroundColor:"rgba(50, 50, 50, 1)",}}>
                                                <>
                                                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                                    <Text style={{color:"white", fontSize:16}}>
                                                        Date: {item.formattedDate}
                                                    </Text>

                                                    <MaterialIcons name={viewList ? "keyboard-arrow-down" :"keyboard-arrow-right"} size={25} color="gray" />
                                                </View>
                                                {
                                                (viewList === index) && (
                                                    <View style={{margin:10}}>
                                                        {Object.keys(item).map((key, idx) => {
                                                            if (key !== "formattedDate" && key !== "id") { // Skip non-member keys
                                                                const memberData = item[key]; // Access member at item[key]
                                                                const firstName = memberData?.FirstName;
                                                                const lastName = memberData?.SecondName;
                                                                return (
                                                                    <Text style={{color:"white", fontSize:14 , padding:5}} key={key}> {idx + 1}. {firstName} {lastName}</Text>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </View>
                                                )
                                                }
                                                </>
                                            </TouchableHighlight>
                                        </View>
                                    )
                                }}
                            />
                            :
                            <View style={{alignItems:"center",justifyContent:"center", backgroundColor:'rgba(100, 100, 100, 0.2)',width:230, height:45, borderRadius:10}}>
                                <Text style={{color:"white"}}>{ seen ? "Loading ..." : "No Attendance"}</Text>
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