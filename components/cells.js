import React,{useEffect, useState} from "react";
import { View ,Text, TouchableHighlight, FlatList} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, getDocs, doc} from "firebase/firestore";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CellList ({navigation, route}){
    const {username, ChurchName, events} = route.params || {}

    const db = getFirestore();
    const [cells, setCell] = useState([]);
    const [viewList , setViewList] = useState(null);

    const [selected, setSelected] = useState(false)
    const [seen, setSeen] = useState(true)
  

     

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

                const AttendanceCollectionRef = collection(userDetailsDocRef, 'Cells');
                const attendanceSnapshot = await getDocs(AttendanceCollectionRef);

                // Check if snapshot is empty
                if (attendanceSnapshot.empty) {
                    console.log("No cell data found in the snapshot.");
                    setSeen(false)
                    return;
                }

                const cellData = attendanceSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().found,
                    ...doc.data().Cell,
                     // Assuming the date is stored under "Date"
                }));
                setSeen(false)
                setCell(cellData);
            }
        } catch (error) {
                setSeen(false)
                console.error("Error fetching or processing cell data:", error);
            }
          
        }
        attendanceList(username)
    }, [ ])


   
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

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('Update Cell',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>All Cells</Text>
                                <Ionicons name="people-outline" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                </View>


                <View style={{flex:1}}>

                    <View style={{flex:1 , justifyContent: cells?.length !== 0 ? "flex-start" : "center" , alignItems: cells?.length !== 0  ? "stretch" :"center"}}>
                            {cells?.length !== 0 ?

                            <FlatList 
                                data={cells}
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
                                                        {item.cellName.toUpperCase()}
                                                    </Text>
                                                    <View style={{flexDirection:"row", }}>
                                                        <Text style={{color:"white", fontSize:16}}>
                                                           {item.cellLocation.toUpperCase()}
                                                        </Text>

                                                        <MaterialIcons name={viewList ? "keyboard-arrow-down" :"keyboard-arrow-right"} size={25} color="gray" />
                                                    </View>
                
                                                </View>
                                                {
                                                (viewList === index) && (
                                                    <View style={{margin:10}}>
                                                        {Object.keys(item).map((key, idx) => {
                                                            if (key !== "cellLocation" && key !== "id" && key !== "cellName") { // Skip non-member keys
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
                                <Text style={{color:"white"}}>{ seen ? "Loading ..." : "No Cells"}</Text>
                            </View> 

                            }
                     </View>       
                </View>

        </View>
    )
}