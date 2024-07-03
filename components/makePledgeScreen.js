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

export default function MakePledge({navigation}){

    const [selectedIndex, setSelectedIndex] = useState(0);

    const screenWidth = useWindowDimensions().width;

    // State to manage current step
    const [step, setStep] = useState(1);

    // Animation styles for form steps
    const formStep1Style = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(
                    step === 1 ? 0 : step > 1 ? -screenWidth : screenWidth
                ),
            },
        ],
    }));


    return(
        <View style={{flex:1,justifyContent:"space-between"}}>

            <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>

            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:10}}>
                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"white",elevation:6}}>
                    <Ionicons name="arrow-back" size={35} color={"rgba(0, 0, 128, 0.8)"} onPress={() => navigation.navigate('ModalScreen',{username:"", ChurchName:""})} />
                    </View>

                    <View style={{height:70, width:"80%", alignItems:"center", justifyContent:"space-around",flexDirection:"row", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"white" }}>
                        <Text style={{fontSize:20,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)"}}>Make Pledge</Text>
                        <Ionicons name="cash" size={26} color={"rgba(0, 0, 128, 0.8)"} />
                    </View>
            </View>

            <View style={{justifyContent:"flex-start",flex:1}}>

           
                <View style={{ width:"100%"}}>
                        <ButtonGroup
                            buttons={['MAKE PLEDGE','ALL PLEDGES']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {setSelectedIndex(value);}}
                            containerStyle={{  elevation:5, borderRadius:15, alignSelf:"center"}}
                            selectedButtonStyle={{backgroundColor:"rgba(0, 0, 128, 0.8)"}}                      
                        />
                </View>

                <Animated.View style={[{backgroundColor:"whitesmoke",flex:1,padding:15},formStep1Style]}>
                    
                {selectedIndex === 0 ?  <Pledge /> : <AllPledges />}

                </Animated.View>                           

            </View>

        </View>
    )
}