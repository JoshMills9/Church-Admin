import React,{useState} from "react";
import { View, Text ,useWindowDimensions} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { ButtonGroup } from '@rneui/themed';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import Pledge from "./makePledge";
import AllPledges from "./allPledges";

export default function MakePledge({navigation, route}){
    const {username, ChurchName, events} = route.params || {}


    const [selectedIndex, setSelectedIndex] = useState(0);

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
                    selectedIndex === 1 ? 0 : selectedIndex=== 0 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));


    return(
        <View style={{flex:1,justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>

            <StatusBar style={'auto'} backgroundColor={"rgba(50, 50, 50, 1)"}/>

                <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginVertical:20}}>
                            <View style={{height:70,width:"100%", alignItems: "center",backgroundColor:"rgba(50, 50, 50, 1)",justifyContent:"space-between", flexDirection: "row",paddingHorizontal:10, marginBottom: 5 }}>

                                <Ionicons name="arrow-back" size={25} style={{width:40,}} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName,events:events})} />
                                <Text style={{ fontSize: 22, color: "rgba(240, 240, 240, 1)", fontWeight: "800" }}>Make Pledge</Text>
                                <Ionicons name="cash" size={25} color={"rgba(240, 240, 240, 1)"} />

                            </View>
                </View>


            <View style={{justifyContent:"flex-start",flex:1}}>

           
                <View style={{ width:"100%"}}>
                        <ButtonGroup
                            buttons={['MAKE PLEDGE','ALL PLEDGES']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {setSelectedIndex(value)}}
                            containerStyle={{  elevation:5, borderRadius:15, backgroundColor:"rgba(50, 50, 50, 1)", borderColor:"gray", alignSelf:"center"}}
                            selectedButtonStyle={{backgroundColor:" rgba(100, 200, 255, 0.8)"}}                      
                        />
                </View>

                <View style={[{flex:1,padding:15}]}>
                    
                {( selectedIndex === 0) ? 
                    <Animated.View style={[{flex:1},formStep1Style]}>
                        <Pledge /> 
                    </Animated.View>
                        : (selectedIndex > 0) &&
                    <Animated.View style={[{flex:1},formStep2Style]}>
                        <AllPledges />
                    </Animated.View>
                   }

                </View>                           

            </View>

        </View>
    )
}