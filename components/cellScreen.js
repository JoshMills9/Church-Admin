import React, {useState, useRef} from "react";
import { View , useColorScheme,Text, PanResponder, useWindowDimensions, TouchableHighlight, ToastAndroid, TextInput} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getFirestore,collection,getDocs, doc } from "firebase/firestore";


import Attendance from "./attendance";

export default function UpdateCell({navigation, route}){
    const {username, ChurchName, events} = route.params
    const [found, setFound] = useState()
    const db = getFirestore()
    const [search, setSearch] = useState("");
    const isDarkMode = useColorScheme() === 'dark';


    //Function to handle submit
  const handleSubmit = async (txt) => {

    try {

        if(!txt){
            return ToastAndroid.show("Please enter cell name", ToastAndroid.LONG)
        }

        // Step 2: Fetch church details based on user email
        const tasksCollectionRef = collection(db, 'UserDetails');
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
            // Filter tasks to find matching church based on user email
            const tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().userDetails
            }));

            const church = tasks.find(item => item.email === username);


            if (!church) {
                throw new Error("Church details not found for the logged-in user");
            }
        

         // Fetch cells
         try{
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
            const pledgesCollectionRef = collection(userDetailsDocRef, "Cells");
            const pledgesSnapshot = await getDocs(pledgesCollectionRef);

            if (!pledgesSnapshot.empty) {
                const Data = pledgesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data().Cell,
                ...doc.data().found,
                
                }));
                if(!Data?.found){
                    const pledge = Data.find(i => i.cellName === txt);
                    pledge ? (setFound(pledge) , ToastAndroid.show(`${pledge?.cellName} cell found! Add Members!`, ToastAndroid.LONG, setSearch(''))):
                    (setFound(),ToastAndroid.show(`${search} not Found!`, ToastAndroid.SHORT),setSearch(`${search} not Found!`))
                }else{
                    const pledge = Data?.found?.find(i => i.cellName === txt);
                    pledge ? (setFound(pledge) , ToastAndroid.show(`${pledge?.cellName} cell found! Add Members!`, ToastAndroid.LONG, setSearch(''))):
                    (setFound(),ToastAndroid.show(`${search} not Found!`, ToastAndroid.SHORT),setSearch(`${search} not Found!`))
                }
                }else{
                    ToastAndroid.show(`${search} not Found in database!`, ToastAndroid.LONG)
                    setSearch('')
                }
            }catch(error){
                console.log("Error fetching cells", error)
            }
        } else {
            throw new Error("No church details found in database");
        }
    } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Creation Error" , error.message);
    }
};



    const searchQueryHandler = (text) => {
        if (text) {
           setSearch(text)
        } else {
          setSearch("")
        }
    };

         //gesture handler logic
         const [positionY, setPositionY] = useState(600); // Only track Y position
         const screenWidth = useWindowDimensions().width;
         // PanResponder to handle the drag gesture
         const panResponder = useRef(
             PanResponder.create({
             onStartShouldSetPanResponder: () => true, // Enable touch response
             onMoveShouldSetPanResponder: () => true,  // Keep responding to move gestures
        
             onPanResponderMove: (event, gestureState) => {
                 // Only update Y position when dragging vertically
                 setPositionY(gestureState.moveY); 
             },
        
             onPanResponderRelease: () => {
                 // Optionally handle release if needed
             },
             })
         ).current;
        



    return(
        <View style={{flex:1,backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>

            <StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}/> 

            <View style={{height:70,width:"100%",borderBottomWidth:0.5, borderColor:"gray",marginTop:20, alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF',justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={isDarkMode ? '#FFFFFF' : '#000000' } onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events: events})} />
                <Text style={{ fontSize: 22, color: isDarkMode ? '#FFFFFF' : '#000000' , fontWeight: "800" }}>Update Cell</Text>
                <Ionicons name="people-sharp" size={28} color={isDarkMode ? '#FFFFFF' : '#000000' } />

            </View>

            <View style={{padding:8}}>
                <TextInput elevation={2} autoFocus={true} returnKeyType="search" keyboardType="default" on onSubmitEditing={()=>{ToastAndroid.show("Searching cell...", ToastAndroid.LONG); handleSubmit(search)}} 
                 style={{backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : "white",fontSize:15,height:50,borderRadius:50,padding:15, width:"100%", color:isDarkMode ? '#FFFFFF' : '#000000',marginBottom:5}}   value={search}  
                 onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={found ? "lightgreen" : 'gray'} placeholder={found ? (`Found Cell : ${found.cellName} ✓`) : `Search cell name`}/>
            </View>

            <View style={{flex:1, marginBottom:10}}>
                <Attendance Search={search} cell = {true} found={found}/>
            </View>

            <View {...panResponder.panHandlers}  style={[{position:"absolute",width:120, height:55,
                backgroundColor:isDarkMode ? "white" : "black",borderRadius:15,top: positionY, left: screenWidth - 110 }]}>
                    <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => navigation.navigate("Cell List", {username: username, ChurchName: ChurchName, events: events})} style={{color:"rgba(30, 30, 30, 1)",justifyContent:"center", alignItems:"center",width:"100%", height:"100%",borderRadius:15}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{color:isDarkMode ? '#000000' : '#FFFFFF' }}>Cells</Text>
                            <MaterialIcons name={"keyboard-arrow-right"} size={20} color={isDarkMode ? '#000000' : '#FFFFFF' } />
                        </View>
                    </TouchableHighlight>
            </View>

        </View>
    )
}