import React,{useState,useRef} from "react";
import { View, Text ,useWindowDimensions,PanResponder,TouchableHighlight, TouchableOpacity} from "react-native";
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



import SendSMS from "./sms";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PrepareSmsScreen({navigation, route}){

    const {username, ChurchName, events} = route.params || {}

    const [isPressedSearch, setIsPressedSearch] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [search, setSearch] = useState("")
    const screenWidth = useWindowDimensions().width;

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


 const [messages, setMessages] = useState([ ]);

 const handleSave = async (message) => {
    try {
        
    await AsyncStorage.setItem('SMS', JSON.stringify(message));
        
    } catch (e) {
    console.error('Failed to save the data to the storage', e);
    }

}




    return(
        <View style={{flex:1,justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>

            <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>

                <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 20, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Prepare SMS</Text>
                                <Ionicons name="book-sharp" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                </View>


            <View style={{justifyContent:"flex-start",flex:1}}>

              <View  style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingHorizontal:10,marginBottom:15}}>

                    {isPressedSearch ?
                    <Searchbar iconColor="rgba(240, 240, 240, 1)"   elevation={2} style={{backgroundColor:"rgba(50, 50, 50, 1)",}} value={search}  onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search member by name"/>

                    :
                    <>
                    <View style={{ width:"95%"}}>
                        <ButtonGroup
                            buttons={['GENERAL', 'BIRTHDAY', 'PLEDGE','ABSENTEES']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {
                                setSelectedIndex(value);
                            }}
                            buttonContainerStyle={{borderColor:"gray"}}
                            containerStyle={{  elevation:5, borderBottomLeftRadius:15,borderTopLeftRadius:15, borderColor:"dimgray",  backgroundColor:"rgba(50, 50, 50, 1)"}}
                            selectedButtonStyle={{backgroundColor:" rgba(100, 200, 255, 0.8)"}}                      
                            />
                    </View>


                    <View style={{ width:"10%",backgroundColor:"rgba(50, 50, 50, 1)",height:39.5,alignItems:"center",borderLeftWidth:0.5,borderColor:"gray",justifyContent:"center",elevation:5, borderTopRightRadius:15,borderBottomRightRadius:15}}>
                        <TouchableOpacity onPress={()=> setIsPressedSearch(true)}>
                            <Ionicons name="search" size={28} color={"rgba(240, 240, 240, 1)"}/>
                        </TouchableOpacity>
                    </View>
                    </>
                    }
                </View>

                <View style={[{flex:1,}]}>
                    
                {( selectedIndex === 0) && 
                    <Animated.View style={[{flex:1},formStep1Style]}>
                        <SendSMS Search={search} save={(value) => setMessages(value)} />
                    </Animated.View>
                    || (selectedIndex === 1) &&
                    <Animated.View style={[{flex:1},formStep2Style]}>
                        <SendSMS title= {"birthday"} Search = {search} save={(value) => setMessages(value)}/>
                    </Animated.View>
                    || (selectedIndex === 2) &&
                    <Animated.View style={[{flex:1},formStep3Style]}>
                        <SendSMS title = {"pledge"} Search = {search} save={(value) => setMessages(value)}/>
                    </Animated.View>
                    || (selectedIndex === 3) &&
                    <Animated.View style={[{flex:1},formStep4Style]}>
                        <SendSMS title = {"absentees"} Search = {search} save={(value) => setMessages(value)}/>
                    </Animated.View>
                   }

                </View>                           

            </View>

            <View {...panResponder.panHandlers}  style={[{position:"absolute",width:120, height:55,
                backgroundColor:"white",borderRadius:15,top: positionY, left: screenWidth - 110 }]}>
                    <TouchableHighlight underlayColor="rgba(70, 70, 70, 1)"  onPress={() =>{handleSave(messages); navigation.push("Messages", {username: username, ChurchName: ChurchName, events: events})}} style={{color:"rgba(30, 30, 30, 1)",justifyContent:"center", alignItems:"center",width:"100%", height:"100%",borderRadius:15}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{marginRight:5}}>SMS</Text>
                            <Ionicons name={"chatbox-ellipses-outline"} size={24}  color={"rgba(50, 50, 50, 1)"} />
                        </View>
                    </TouchableHighlight>
            </View>

        </View>
    )
}