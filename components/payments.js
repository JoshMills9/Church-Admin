import React from 'react'
import {Image, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
import { Zocial } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';

export const Payments = ({route}) => {
    const navigation = useNavigation()
    const {username, ChurchName, events} = route.params

    const WindowsWidth = useWindowDimensions().width
    const WindowHeight = useWindowDimensions().height
 
  return (
    <View style={[styles.container,{justifyContent:"space-between",paddingHorizontal:20, paddingVertical:10}]}>
        <View style={{flex:1, justifyContent:"space-between",marginTop:20}}>
            <View>
                <AntDesign name="leftcircleo" size={35}  onPress={()=> navigation.navigate("Settings", {username : username , ChurchName : ChurchName ,events: events })} color="rgba(240, 240, 240, 1)" />
            </View>

            <View style={{alignSelf:"center",alignItems:"center", marginTop:10}}>
                <Ionicons name="wallet-outline" size={70} color="rgba(240, 240, 240, 1)" />
                <Text style={{fontSize: WindowHeight < 800 ? 38 : 50, color:"rgba(240, 240, 240, 1)" , fontWeight:"600"}}>Your Wallet</Text>
                <Text style={{fontSize:14, color:"rgba(240, 240, 240, 0.8)"}}>{0} Account Connected</Text>
            </View>
            
        </View>

        <View style={{flex:1,justifyContent: WindowHeight < 800 ? "flex-end" : "center", alignItems:"center"}}>
            <View>
                <Text style={{fontSize: WindowHeight < 800 ? 25 : 30, color:"rgba(240, 240, 240, 1)"}}>Balance</Text>
                <View style={{borderBottomWidth:3, borderColor:"rgba(100, 200, 255, 1)", width:40, alignSelf:"center"}}></View>
            </View>

            <View>
                <Text style={{fontSize: WindowHeight < 800 ? 35 : 45,marginTop: WindowHeight < 800 ? 10 : 15, color:"rgba(240, 240, 240, 1)"}}>GH₵ {100}.00</Text>
            </View>

        </View>

        <View style={{flex:2, paddingHorizontal:10, justifyContent:"space-between", marginTop: WindowHeight < 800 && 10}}>
            <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height: WindowHeight < 800 ? 70 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <View style={{flexDirection:"row", alignItems:"center", width:190, justifyContent:"space-between"}}>
                    <Image source={require("../assets/momo.png")}  resizeMode='cover' style={{backgroundColor:"white", padding:10, borderRadius:15, width:50, height:50}}  />
                    <Text style={{fontSize:20, color:"rgba(240, 240, 240, 1)"}}>Mobile Money</Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={30} color="rgba(100, 200, 255, 1)" />
            </TouchableOpacity>

            <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height:WindowHeight < 800 ? 70 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <View style={{flexDirection:"row", alignItems:"center", width:190, justifyContent:"space-between"}}>
                    <FontAwesome name="bank"  size={25} style={{backgroundColor:"white", padding:10, borderRadius:15, width:50 , height:50}} color="dimgray" />
                    <Text style={{fontSize:20, color:"rgba(240, 240, 240, 1)"}}>Bank Transfer</Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={30} color="rgba(100, 200, 255, 1)" />
            </TouchableOpacity>

            <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height:WindowHeight < 800 ? 70 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <View style={{flexDirection:"row", alignItems:"center", width:130, justifyContent:"space-between"}}>
                    <Zocial name="paypal" size={25} style={{backgroundColor:"white", padding:10, borderRadius:15, width:50 , height:50}} color="darkblue" />
                    <Text style={{fontSize:20, color:"rgba(240, 240, 240, 1)"}}>Paypal</Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={30} color="rgba(100, 200, 255, 1)" />
            </TouchableOpacity>

            <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height:WindowHeight < 800 ? 70 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <View style={{flexDirection:"row", alignItems:"center", width:120, justifyContent:"space-between"}}>
                    <Zocial name="bitcoin" size={25} style={{backgroundColor:"white", padding:10, borderRadius:15, width:50 , height:50}} color="brown" />
                    <Text style={{fontSize:20, color:"rgba(240, 240, 240, 1)"}}>Other</Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={30} color="rgba(100, 200, 255, 1)" />
            </TouchableOpacity>
        </View>

    </View>
  )
}
