import React,{useState,useRef} from "react";
import { View, Text ,useWindowDimensions,PanResponder,useColorScheme, TouchableHighlight, TouchableOpacity} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { Searchbar } from "react-native-paper";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import Attendance from "./attendance";

export default function MarkAttendance({navigation, route}){
    const {username, ChurchName, events} = route.params || {}

    const [isPressedSearch, setIsPressedSearch] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [search, setSearch] = useState("")
    const screenWidth = useWindowDimensions().width;
    const isDarkMode = useColorScheme() === 'dark';

    // State to manage current step
    const [step, setStep] = useState(0);

    // Animation styles for form steps
    const formStep1Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    selectedIndex === 0 ? 0 : selectedIndex === 1 ? -screenWidth : screenWidth
                ),
            },
        ],
    }));

    const formStep2Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    selectedIndex === 1 ? 0 : selectedIndex === 0 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));

    const formStep3Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    selectedIndex === 2 ? 1 : selectedIndex === 1 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));

    const formStep4Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    selectedIndex === 3 ? 2 : selectedIndex === 2 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));


    const searchQueryHandler = (text) => {
        if (text) {
           setSearch(text)
        } else {
          setSearch("")
          setIsPressedSearch(false)
        }
    };


     //gesture handler logic
     const [positionY, setPositionY] = useState(600); // Only track Y position

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
        <View style={{flex:1,justifyContent:"space-between", backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>

            <StatusBar style={'auto'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}/>

                <View style={{alignItems:"center",borderBottomWidth:0.5,borderColor:"gray", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF',justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={ isDarkMode ? '#FFFFFF' : '#000000'} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 20, color:  isDarkMode ? '#FFFFFF' : '#000000', fontWeight: "800" }}> Record Church Attendance</Text>
                                <Ionicons name="book-sharp" size={25} color={ isDarkMode ? '#FFFFFF' : '#000000'} />

                            </View>
                </View>


            <View style={{justifyContent:"flex-start",flex:1}}>

              <View  style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingHorizontal:10,marginBottom:15}}>

                    {isPressedSearch ?
                    <Searchbar autoFocus={isPressedSearch}  iconColor={isDarkMode ? '#FFFFFF' : '#000000'}   elevation={2} style={{backgroundColor: isDarkMode ? "rgba(50, 50, 50, 1)" : "white",}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>

                    :
                    <>
                    <View style={{ width:"90%"}}>
                        <ButtonGroup
                            buttons={['MEN', 'WOMEN', 'YOUTH','CHILDREN']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {
                                setSelectedIndex(value);
                            }}
                            buttonContainerStyle={{}}
                            containerStyle={{elevation:5, borderBottomLeftRadius:15,borderTopLeftRadius:15,  backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' }}
                            selectedButtonStyle={{backgroundColor:" rgba(100, 200, 255, 0.8)"}}                      
                            />
                    </View>


                    <View style={{ width:"15%",backgroundColor:isDarkMode ? '#121212' : '#FFFFFF' ,height:39.7,alignItems:"center",borderWidth:isDarkMode? 1.5 :0, borderLeftWidth:isDarkMode? 0 : 0.5, borderColor:"gray",justifyContent:"center",elevation:2, borderTopRightRadius:15,borderBottomRightRadius:15}}>
                        <TouchableOpacity onPress={()=> setIsPressedSearch(true)}>
                            <Ionicons name="search" size={28} color={ isDarkMode ? '#FFFFFF' : '#000000' }/>
                        </TouchableOpacity>
                    </View>
                    </>
                    }
                </View>

                <View style={[{flex:1, marginBottom:10}]}>
                    
                {( selectedIndex === 0) && 
                    <Animated.View style={[{flex:1},formStep1Style]}>
                        <Attendance department= {"men"} Search = {search} />
                    </Animated.View>
                    || (selectedIndex === 1) &&
                    <Animated.View style={[{flex:1},formStep2Style]}>
                        <Attendance department= {"women"} Search = {search}/>
                    </Animated.View>
                    || (selectedIndex === 2) &&
                    <Animated.View style={[{flex:1},formStep3Style]}>
                        <Attendance department= {"youth"} Search = {search}/>
                    </Animated.View>
                    || (selectedIndex === 3) &&
                    <Animated.View style={[{flex:1},formStep4Style]}>
                        <Attendance department= {"children"} Search = {search}/>
                    </Animated.View>
                   }

                </View>                           

            </View>

            <View {...panResponder.panHandlers}  style={[{position:"absolute",width:120, height:55,
                backgroundColor:isDarkMode ? '#FFFFFF' : '#121212' ,borderRadius:15,top: positionY, left: screenWidth - 110 }]}>
                    <TouchableHighlight underlayColor={isDarkMode ? "rgba(70, 70, 70, 1)" : "lightgray"}  onPress={() => navigation.navigate("AttendanceList", {username: username, ChurchName: ChurchName, events: events})} style={{color:"rgba(30, 30, 30, 1)",justifyContent:"center", alignItems:"center",width:"100%", height:"100%",borderRadius:15}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{color:isDarkMode ? '#000000' : '#FFFFFF'}}>Attendance</Text>
                            <MaterialIcons name={"keyboard-arrow-right"} size={20} color={ isDarkMode ? '#000000' : '#FFFFFF'} />
                        </View>
                    </TouchableHighlight>
            </View>

        </View>
    )
}