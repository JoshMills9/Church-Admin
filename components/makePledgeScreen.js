import React,{useState} from "react";
import { View, StatusBar,Text ,useWindowDimensions} from "react-native";
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
                    step === 0 ? 0 : step === 1 ? -screenWidth : screenWidth
                ),
            },
        ],
    }));

    const formStep2Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    step === 1 ? 0 : step === 0 ? screenWidth : -screenWidth
                ),
            },
        ],
    }));


    return(
        <View style={{flex:1,justifyContent:"space-between", backgroundColor:"rgba(30, 30, 30, 1)"}}>

            <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>

            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:10}}>
                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"rgba(50, 50, 50, 1)",elevation:6}}>
                    <Ionicons name="arrow-back" size={35} color={"rgba(240, 240, 240, 1)"} onPress={() => navigation.navigate('ModalScreen',{username: username, ChurchName: ChurchName, events: events})} />
                    </View>

                    <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"space-around",flexDirection:"row", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                        <Text style={{fontSize:20,fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Make Pledge</Text>
                        <Ionicons name="cash" size={26} color={"rgba(240, 240, 240, 1)"} />
                    </View>
            </View>

            <View style={{justifyContent:"flex-start",flex:1}}>

           
                <View style={{ width:"100%"}}>
                        <ButtonGroup
                            buttons={['MAKE PLEDGE','ALL PLEDGES']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {setSelectedIndex(value); setStep(selectedIndex === 1 ? selectedIndex-1: selectedIndex+1)}}
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